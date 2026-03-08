const SECRET = import.meta.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!SECRET) return true; // ローカル開発時はスキップ
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: SECRET, response: token, remoteip: ip }),
  });
  const { success } = (await res.json()) as { success: boolean };
  return success;
}
