/**
 * rehype-link-card
 * Markdown 内の「段落に単独URLだけ書かれた行」を OGP リンクカードに変換するプラグイン。
 *
 * 変換対象: <p><a href="URL">URL</a></p>
 * 変換後: <div class="link-card">...</div>
 */

import { visit } from "unist-util-visit";

const TIMEOUT_MS = 5000;

/** Google Maps URL かどうか判定 */
function isGoogleMapsUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === "maps.app.goo.gl" || hostname.includes("google.com/maps");
  } catch {
    return false;
  }
}

/** Google Maps 埋め込みカード HTML を生成 */
function buildGoogleMapsCardHtml(url) {
  const encodedUrl = encodeURIComponent(url);
  const embedSrc = `https://maps.google.com/maps?q=${encodedUrl}&output=embed`;
  return `<div class="google-maps-card">
  <iframe src="${embedSrc}" width="100%" height="300" style="border:0;border-radius:8px;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <div class="google-maps-card-meta">
    <img src="https://www.google.com/s2/favicons?domain=maps.google.com&sz=32" alt="" width="14" height="14" loading="lazy" />
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="google-maps-card-link">Google マップで開く ↗</a>
  </div>
</div>`;
}

/** レスポンスの charset を検出して文字列にデコード */
async function decodeResponse(res) {
  const contentType = res.headers.get("content-type") ?? "";
  const ctCharset = contentType.match(/charset=([^\s;]+)/i)?.[1];
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // まず latin1 で仮デコードして meta charset を探す
  const latin1 = new TextDecoder("latin1").decode(bytes);
  const metaCharset =
    latin1.match(/<meta[^>]+charset=["']?([^"'\s;>]+)/i)?.[1] ??
    latin1.match(/charset=([^"'\s;>]+)/i)?.[1];
  const charset = ctCharset ?? metaCharset ?? "utf-8";
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

/** OGP・メタ情報を URL からフェッチして返す */
async function fetchOgp(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;

    const html = await decodeResponse(res);
    const get = (pattern) => {
      const m = html.match(pattern);
      return m ? m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim() : null;
    };

    const title =
      get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ??
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ??
      get(/<title[^>]*>([^<]+)<\/title>/i) ??
      url;

    const description =
      get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ??
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ??
      get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

    const image =
      get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const siteName =
      get(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ??
      get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i) ??
      new URL(url).hostname;

    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;

    return { title, description, image, siteName, favicon };
  } catch {
    return null;
  }
}

/** OGP 情報からリンクカード HTML を生成 */
function buildCardHtml(url, ogp) {
  const title = ogp?.title ?? url;
  const description = ogp?.description ?? "";
  const image = ogp?.image ?? "";
  const siteName = ogp?.siteName ?? new URL(url).hostname;
  const favicon = ogp?.favicon ?? "";

  const descHtml = description
    ? `<p class="link-card-description">${description.replace(/</g, "&lt;")}</p>`
    : "";

  const imageHtml = image
    ? `<div class="link-card-image"><img src="${image}" alt="" loading="lazy" decoding="async" /></div>`
    : "";

  return `<a href="${url}" class="link-card" target="_blank" rel="noopener noreferrer">
  ${imageHtml}
  <div class="link-card-text">
    <p class="link-card-title">${title.replace(/</g, "&lt;")}</p>
    ${descHtml}
    <div class="link-card-meta">
      <img class="link-card-favicon" src="${favicon}" alt="" width="14" height="14" loading="lazy" />
      <span class="link-card-site">${siteName.replace(/</g, "&lt;")}</span>
    </div>
  </div>
</a>`;
}

/** rehype プラグイン本体 */
export function rehypeLinkCard() {
  return async function (tree) {
    const targets = [];

    visit(tree, "element", (node, index, parent) => {
      // <p> 要素で、子が <a> 1つだけで、そのテキストがhrefと同じ（= 生URL貼り付け）
      if (
        node.tagName !== "p" ||
        !parent ||
        node.children.length !== 1
      ) return;

      const child = node.children[0];
      if (child.type !== "element" || child.tagName !== "a") return;

      const href = child.properties?.href;
      if (!href || typeof href !== "string") return;

      // aの子テキストがURLと一致するか（生URLとして貼られたリンク）
      const textContent = child.children
        .filter((c) => c.type === "text")
        .map((c) => c.value)
        .join("");
      if (textContent !== href) return;

      // http/https のみ対象
      if (!href.startsWith("http://") && !href.startsWith("https://")) return;

      targets.push({ node, index, parent, url: href });
    });

    // OGP を並列フェッチ
    await Promise.all(
      targets.map(async ({ node, index, parent, url }) => {
        const html = isGoogleMapsUrl(url)
          ? buildGoogleMapsCardHtml(url)
          : buildCardHtml(url, await fetchOgp(url));

        // <p> ノードをカード HTML ノードに置き換える
        parent.children.splice(index, 1, {
          type: "raw",
          value: html,
        });
      })
    );
  };
}
