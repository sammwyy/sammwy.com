import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Status } from "./data";

export const FRAME = "/assets/frames/frame.png";

const STATUS_FILE: Record<Status, string> = {
  on: "online",
  away: "away",
  busy: "busy",
  off: "offline",
  phone: "phone",
  mobile: "mobile",
};

export const STATUS_LABEL: Record<Status, string> = {
  on: "",
  away: "Away",
  busy: "Busy",
  off: "",
  phone: "On the phone",
  mobile: "Mobile",
};

export const statusIcon = (s: Status) => `/assets/status/${STATUS_FILE[s] ?? "online"}.png`;

const EMOTE_DIR = join(process.cwd(), "public", "assets", "emotes");
const ALIASES: Record<string, string> = {
  heart: "red-heart",
  wink: "winking-smile",
  sad: "crying-face",
  cry: "crying-face",
  tongue: "smile-with-tongue-out",
  angry: "angry-smile",
  confused: "confused-smile",
  blush: "embarrassed-smile",
  cool: "hot-smile",
  sick: "sick-smile",
  sleepy: "sleepy-smile",
  surprised: "surprised-smile",
  sarcastic: "sarcastic-smile",
  eyeroll: "eye-rolling-smile",
};

let emotes: Map<string, string> | null = null;

export function emoteSrc(code: string) {
  if (!emotes) {
    emotes = new Map();
    try {
      for (const f of readdirSync(EMOTE_DIR)) {
        const m = f.match(/^(.+)\.(png|gif|webp)$/i);
        if (m) emotes.set(m[1].toLowerCase(), `/assets/emotes/${f}`);
      }
    } catch {}
  }
  const key = code.toLowerCase();
  return emotes.get(key) ?? emotes.get(ALIASES[key] ?? "") ?? null;
}
