import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "data", ".state");
const FILE = join(DIR, "counter.json");

let hits: number | null = null;

function read() {
  if (hits !== null) return hits;
  try {
    hits = JSON.parse(readFileSync(FILE, "utf8")).hits ?? 0;
  } catch {
    hits = 0;
  }
  return hits as number;
}

export function bumpVisitors() {
  hits = read() + 1;
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify({ hits }));
  return hits;
}

export const getVisitors = () => read();
