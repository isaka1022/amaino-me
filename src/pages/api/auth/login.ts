import type { APIRoute } from 'astro';

const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID ?? process.env.GITHUB_CLIENT_ID;
const ALLOWED_USER = 'isaka1022';

export const prerender = false;

function getSiteUrl(requestUrl: URL): string {
  const envUrl = import.meta.env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL;
  if (envUrl) return envUrl;
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return requestUrl.origin;
}

export const GET: APIRoute = ({ url }) => {
  if (!GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID is not configured', { status: 500 });
  }

  const redirectUri = `${getSiteUrl(url)}/api/auth/callback`;
  const scope = 'read:user';
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

  return Response.redirect(githubAuthUrl, 302);
};
