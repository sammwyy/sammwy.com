import { defineMiddleware } from "astro:middleware";

const A = /<a\b([^>]*?)\shref="(https?:\/\/[^"]+)"([^>]*)>/gi;

export const onRequest = defineMiddleware(async (ctx, next) => {
  const res = await next();
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const own = new Set([ctx.url.host, "sammwy.com", "www.sammwy.com"]);
  const html = (await res.text()).replace(A, (tag, pre: string, href: string, post: string) => {
    let host = "";
    try {
      host = new URL(href).host;
    } catch {
      return tag;
    }
    if (own.has(host) || /\starget=/i.test(pre + post)) return tag;
    const rel = /\srel=/i.test(pre + post) ? "" : ' rel="noopener noreferrer"';
    return `<a${pre} href="${href}"${post} target="_blank"${rel}>`;
  });
  const headers = new Headers(res.headers);
  headers.delete("content-length");
  return new Response(html, { status: res.status, statusText: res.statusText, headers });
});
