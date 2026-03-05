/**
 * rehype-link-card
 * Markdown 内の「段落に単独URLだけ書かれた行」を OGP リンクカードに変換するプラグイン。
 *
 * 変換対象: <p><a href="URL">URL</a></p>
 * 変換後: <div class="link-card">...</div>
 */

import { visit } from "unist-util-visit";

const TIMEOUT_MS = 5000;

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

    const html = await res.text();
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
        const ogp = await fetchOgp(url);
        const html = buildCardHtml(url, ogp);

        // <p> ノードをカード HTML ノードに置き換える
        parent.children.splice(index, 1, {
          type: "raw",
          value: html,
        });
      })
    );
  };
}
