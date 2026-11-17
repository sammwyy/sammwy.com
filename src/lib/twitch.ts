import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface Channel {
  login: string;
  name: string;
  live: boolean;
  title: string;
  game: string;
  viewers: number;
  since: string | null;
}

function env(key: string) {
  if (process.env[key]) return process.env[key];
  const file = join(process.cwd(), ".env");
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith(`${key}=`));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : undefined;
}

const TTL = 60_000;
const TIMEOUT = 3000;

let token: { value: string; exp: number } | null = null;
let cache: { key: string; at: number; data: Map<string, Channel> } | null = null;
let pending: Promise<Map<string, Channel>> | null = null;
let failUntil = 0;

export const twitchConfigured = () => Boolean(env("TWITCH_CLIENT_ID") && env("TWITCH_CLIENT_SECRET"));

async function getToken() {
  if (token && Date.now() < token.exp) return token.value;
  const params = new URLSearchParams({
    client_id: env("TWITCH_CLIENT_ID")!,
    client_secret: env("TWITCH_CLIENT_SECRET")!,
    grant_type: "client_credentials",
  });
  const r = await fetch(`https://id.twitch.tv/oauth2/token?${params}`, { method: "POST", signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) throw new Error(`twitch token ${r.status}`);
  const j = (await r.json()) as { access_token: string; expires_in: number };
  token = { value: j.access_token, exp: Date.now() + (j.expires_in - 120) * 1000 };
  return token.value;
}

async function helix<T>(path: string, logins: string[], param: string): Promise<T[]> {
  const q = logins.map((l) => `${param}=${encodeURIComponent(l)}`).join("&");
  const go = async () =>
    fetch(`https://api.twitch.tv/helix/${path}?${q}&first=100`, {
      headers: { "Client-Id": env("TWITCH_CLIENT_ID")!, Authorization: `Bearer ${await getToken()}` },
      signal: AbortSignal.timeout(TIMEOUT),
    });
  let r = await go();
  if (r.status === 401) {
    token = null;
    r = await go();
  }
  if (!r.ok) throw new Error(`twitch ${path} ${r.status}`);
  return ((await r.json()) as { data: T[] }).data;
}

const offline = (login: string): Channel => ({ login, name: login, live: false, title: "", game: "", viewers: 0, since: null });

async function fetchChannels(logins: string[]) {
  const [users, streams] = await Promise.all([
    helix<{ login: string; display_name: string }>("users", logins, "login"),
    helix<{ user_login: string; title: string; game_name: string; viewer_count: number; started_at: string }>("streams", logins, "user_login"),
  ]);
  const map = new Map<string, Channel>();
  for (const l of logins) map.set(l, offline(l));
  for (const u of users) map.set(u.login, { ...map.get(u.login)!, name: u.display_name });
  for (const s of streams) {
    const c = map.get(s.user_login);
    if (c) map.set(s.user_login, { ...c, live: true, title: s.title, game: s.game_name, viewers: s.viewer_count, since: s.started_at });
  }
  return map;
}

export async function getChannels(input: string[]): Promise<Channel[]> {
  const logins = [...new Set(input.map((l) => l.toLowerCase()))].slice(0, 100);
  const key = logins.join(",");
  const fallback = () => logins.map((l) => cache?.data.get(l) ?? offline(l));
  if (!logins.length) return [];
  if (!twitchConfigured()) return fallback();
  if (cache && cache.key === key && Date.now() - cache.at < TTL) return fallback();
  if (Date.now() < failUntil) return fallback();
  try {
    pending ??= fetchChannels(logins).finally(() => (pending = null));
    const data = await pending;
    cache = { key, at: Date.now(), data };
  } catch (e) {
    console.error("[twitch]", (e as Error).message);
    failUntil = Date.now() + 30_000;
  }
  return fallback();
}
