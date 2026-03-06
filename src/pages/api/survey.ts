import type { APIRoute } from "astro";

export const prerender = false;

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID_AMAINO;
const AIRTABLE_TABLE_NAME = "記事フィードバック";

export const POST: APIRoute = async ({ request }) => {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { articlePath?: string; articleTitle?: string; rating?: number; reason?: string; reasonOther?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { articlePath, articleTitle, rating, reason, reasonOther } = body;

  if (!articlePath || typeof rating !== "number" || rating < 1 || rating > 5 || !reason) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid input" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const fields: Record<string, string | number> = {
    ArticlePath: articlePath,
    ArticleTitle: articleTitle ?? "",
    Rating: rating,
    Reason: reason,
    SubmittedAt: new Date().toISOString(),
  };
  if (reasonOther) {
    fields.ReasonOther = reasonOther;
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
    console.error("[survey] Airtable error:", res.status, err);
    return new Response(
      JSON.stringify({ ok: false, error: "Save failed" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
