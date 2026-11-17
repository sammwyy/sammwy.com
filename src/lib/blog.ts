import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { parse } from "yaml";
import { marked } from "marked";

export interface Post {
  n: number;
  slug: string;
  title: string;
  description: string;
  brief: string;
  date: string;
  year: number;
  month: number;
  day: number;
  html: string;
  minutes: number;
  file: string;
}

const DIR = join(process.cwd(), "data", "blog");
const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let cacheKey = "";
let cache: Post[] = [];

function walk(dir: string): string[] {
  let out: string[] = [];
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function read(file: string) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(FM);
  const meta = (m ? parse(m[1]) : {}) ?? {};
  const body = m ? raw.slice(m[0].length) : raw;
  const parts = relative(DIR, file).split(sep);
  const name = parts[parts.length - 1].replace(/\.md$/, "");
  const rawDate = meta.date instanceof Date ? meta.date.toISOString() : String(meta.date ?? "");
  const dm = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const year = dm ? Number(dm[1]) : Number(parts[0]) || 1970;
  const month = dm ? Number(dm[2]) : Number(parts[1]) || 1;
  const day = dm ? Number(dm[3]) : 1;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    draft: meta.draft === true,
    post: {
      n: 0,
      slug: slugify(String(meta.slug ?? name)),
      title: String(meta.title ?? name.replace(/[_-]+/g, " ")),
      description: String(meta.description ?? ""),
      brief: String(meta.brief ?? ""),
      date: dm ? rawDate : `${year}-${String(month).padStart(2, "0")}-01`,
      year,
      month,
      day,
      html: marked.parse(body, { async: false, gfm: true }) as string,
      minutes: Math.max(1, Math.round(words / 200)),
      file,
    } satisfies Post,
  };
}

export function getPosts(): Post[] {
  const files = walk(DIR);
  const key = files.map((f) => `${f}:${statSync(f).mtimeMs}`).join("|");
  if (key === cacheKey) return cache;
  const posts = files
    .map(read)
    .filter((r) => !r.draft)
    .map((r) => r.post)
    .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  posts.forEach((p, i) => (p.n = i + 1));
  cache = posts.reverse();
  cacheKey = key;
  return cache;
}

export function getPost(slug: string) {
  const posts = getPosts();
  const i = posts.findIndex((p) => p.slug === slug.toLowerCase());
  if (i < 0) return null;
  return { post: posts[i], newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}

export const formatDate = (p: Post) => `${String(p.day).padStart(2, "0")} ${MONTHS[p.month - 1]} ${p.year}`;

export function archive(posts: Post[], year: number) {
  const years = [...new Set(posts.map((p) => p.year))].sort((a, b) => b - a);
  const y = years.includes(year) ? year : (years[0] ?? year);
  const i = years.indexOf(y);
  const months = new Map<number, Post[]>();
  for (const p of posts.filter((p) => p.year === y)) months.set(p.month, [...(months.get(p.month) ?? []), p]);
  return {
    year: y,
    newer: i > 0 ? years[i - 1] : null,
    older: i >= 0 && i < years.length - 1 ? years[i + 1] : null,
    months: [...months].sort((a, b) => b[0] - a[0]).map(([m, list]) => ({ label: MONTHS[m - 1], posts: list })),
  };
}
