import { getProjects, type Project } from "./data";

const SH = 8;

type Cells = number[][];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashOf(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

const mirror = (half: Cells): Cells => half.map((row) => [...row, ...row.slice(0, 5).reverse()]);

function invader(r: () => number): [Cells, Cells] {
  const half: Cells = Array.from({ length: SH }, (_, y) =>
    Array.from({ length: 6 }, () => {
      const p = y < 2 ? 0.35 : y < 6 ? 0.62 : 0.45;
      return r() < p ? (r() < 0.2 ? 2 : 1) : 0;
    }),
  );
  for (let y = 1; y < 6; y++) half[y][5] = half[y][5] || 1;
  const ex = 2 + Math.floor(r() * 2);
  const ey = 2 + Math.floor(r() * 2);
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) half[ey + dy][ex + dx] = half[ey + dy][ex + dx] || 1;
  half[ey][ex] = 3;
  const alt: Cells = half.map((row) => [...row]);
  for (let y = 6; y < SH; y++) for (let x = 0; x < 6; x++) alt[y][x] = r() < 0.5 ? (r() < 0.2 ? 2 : 1) : 0;
  if (r() < 0.5) alt[ey][ex] = 1;
  for (let y = 2; y < 5; y++) alt[y][0] = half[y][0] ? 0 : 1;
  return [mirror(half), mirror(alt)];
}

function runs(cells: Cells, colors: Record<number, string>) {
  const by = new Map<number, string>();
  cells.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const v = row[x];
      let len = 1;
      while (row[x + len] === v) len++;
      if (v && colors[v]) by.set(v, (by.get(v) ?? "") + `M${x} ${y}h${len}v1h-${len}z`);
      x += len;
    }
  });
  return [...by].map(([v, d]) => ({ fill: colors[v], d }));
}

export interface Banner {
  hue: number;
  pattern: number;
  delay: number;
  frames: { fill: string; d: string }[][];
}

let cacheKey = "";
let cache = new Map<string, Banner>();

function build(projects: Project[]) {
  const seen = new Set<string>();
  const map = new Map<string, Banner>();
  projects.forEach((p, i) => {
    const hue = p.hue ?? Math.round((i * 137.508) % 360);
    let salt = 0;
    let frames: [Cells, Cells];
    do {
      frames = invader(rng(hashOf(`${p.name}#${salt++}`)));
    } while (seen.has(JSON.stringify(frames[0])));
    seen.add(JSON.stringify(frames[0]));
    const colors = {
      1: `hsl(${hue} 72% 56%)`,
      2: `hsl(${(hue + 150) % 360} 85% 62%)`,
      3: "#2b3340",
    };
    map.set(p.name, {
      hue,
      pattern: i % 4,
      delay: (hashOf(p.name) % 10) / 10,
      frames: frames.map((f) => runs(f, colors)),
    });
  });
  return map;
}

export function bannerFor(project: Project) {
  const { projects } = getProjects();
  const key = projects.map((p) => `${p.name}:${p.hue ?? ""}`).join("|");
  if (key !== cacheKey) {
    cache = build(projects);
    cacheKey = key;
  }
  return cache.get(project.name) ?? build([project]).get(project.name)!;
}
