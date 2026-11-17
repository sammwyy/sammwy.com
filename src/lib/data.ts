import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

export type Status = "on" | "away" | "busy" | "off" | "phone" | "mobile";

export interface Project {
  name: string;
  url: string;
  desc: string;
  category: string;
  featured?: boolean;
  hue?: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Client {
  name: string;
  role: string;
  url: string;
}

export interface Site {
  domain: string;
  repo: string;
  branch: string;
  version: string;
  node: string;
  timezone: string;
  lastModified: string | Date;
  nav: { href: string; label: string }[];
  hero: { pre: string; title: string; kata: string[]; tag: string; code: string };
  profile: {
    avatar: string;
    fields: [string, string][];
    stats: { label: string; value: number; low?: boolean }[];
    camCaption: string;
  };
  popup: { title: string; text: string; actions: string[] };
  tape: string;
  nowPlaying: { artist: string; track: string };
  about: { lead: string; paragraphs: string[]; chips: string[] };
  status: { online: boolean; lastWatched: string; lastCleared: string };
  quote: { text: string; author: string };
  warn: { title: string; text: string; code: string };
  pet: { name: string; age: string; hunger: number; happy: number };
  featuredProjects: number;
  webring: { name: string; base: string; button: string };
  footer: { copy: string; jp: string; secret: string };
}

export interface Social {
  links: { label: string; handle: string; url: string; icon: string }[];
  interests: [string, string][];
  friends: { name: string; url?: string; avatar?: string; style?: string; status: Status }[];
  twitch: { title?: string; channels: string[] };
}

export interface ProjectsFile {
  github: string;
  categories: Category[];
  projects: Project[];
  clients: Client[];
}

const DATA_DIR = join(process.cwd(), "data");
const cache = new Map<string, { mtime: number; value: unknown }>();

function load<T>(name: string): T {
  const file = join(DATA_DIR, `${name}.yaml`);
  const mtime = statSync(file).mtimeMs;
  const hit = cache.get(file);
  if (hit && hit.mtime === mtime) return hit.value as T;
  const value = parse(readFileSync(file, "utf8")) as T;
  cache.set(file, { mtime, value });
  return value;
}

export const getSite = () => load<Site>("site");
export const getSocial = () => load<Social>("social");
export const getProjects = () => load<ProjectsFile>("projects");

export interface GuestbookEntry {
  name: string;
  text: string;
  psm?: string;
  github?: string;
  avatar?: string;
  pr?: string;
  date?: string | Date;
  status?: Status;
}

export const getGuestbook = () => load<{ entries: GuestbookEntry[] | null }>("guestbook").entries ?? [];

export const slugOf = (p: Project) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getProject = (slug: string) => getProjects().projects.find((p) => slugOf(p) === slug.toLowerCase());

export function getCategory(id: string) {
  return getProjects().categories.find((c) => c.id === id);
}

export function getCategories() {
  const { categories, projects } = getProjects();
  return categories.map((c) => ({ ...c, count: projects.filter((p) => p.category === c.id).length }));
}
