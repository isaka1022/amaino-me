import type { APIRoute } from "astro";
import { verifyTurnstile } from "../../lib/turnstile";

export const prerender = false;

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID_AMAINO;
const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME || "メールリスト";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const POST: APIRoute = async ({ request }) => {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { email?: string; name?: string; source?: string; website?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Honeypot: BOT が埋めた場合は成功を装って無視する
  if (body.website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Turnstile 検証
  const ip = request.headers.get("x-forwarded-for") ?? "";
  const isValid = await verifyTurnstile(body.turnstileToken ?? "", ip);
  if (!isValid) {
    return new Response(JSON.stringify({ ok: false, error: "Verification failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Valid email is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "amaino.me";
  const fields: Record<string, string> = {
    Email: email,
    Source: source,
    RegisteredAt: new Date().toISOString(),
  };
  if (typeof body.name === "string" && body.name.trim()) {
    fields.Name = body.name.trim();
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[subscribe] Airtable error:", res.status, err);
    return new Response(
      JSON.stringify({ ok: false, error: "Registration failed" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
