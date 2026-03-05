import type { APIRoute } from 'astro';
import { setSession } from '../../../lib/auth';

const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID ?? process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET ?? process.env.GITHUB_CLIENT_SECRET;
const ALLOWED_USER = 'isaka1022';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  if (!code) {
    return redirect('/?error=no_code', 302);
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return new Response('OAuth is not configured', { status: 500 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth/callback`,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return redirect(`/?error=${encodeURIComponent(tokenData.error || 'token_failed')}`, 302);
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const user = await userRes.json();
  if (user.login !== ALLOWED_USER) {
    return new Response(`Access denied. Only ${ALLOWED_USER} can access the admin panel.`, {
      status: 403,
    });
  }

  setSession(cookies, accessToken);
  return redirect('/admin/', 302);
};
