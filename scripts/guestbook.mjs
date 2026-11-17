import { readFileSync, writeFileSync } from "node:fs";
import { parse, parseDocument } from "yaml";

const FILE = "data/guestbook.yaml";
const USER_KEYS = new Set(["name", "text", "psm"]);
const LIMITS = { name: 32, text: 280, psm: 60 };

const entries = (src) => (src.trim() ? parse(src)?.entries ?? [] : []);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = (msg) => {
  console.error(`::error file=${FILE}::${msg}`);
  process.exit(1);
};

function validate(basePath, headPath) {
  let base, head;
  try {
    base = entries(readFileSync(basePath, "utf8"));
    head = entries(readFileSync(headPath, "utf8"));
  } catch (e) {
    fail(`invalid YAML: ${e.message}`);
  }
  if (!Array.isArray(head)) fail("`entries` must be a list");
  if (head.length !== base.length + 1) fail(`add exactly one entry (found ${head.length - base.length} new)`);
  base.forEach((b, i) => same(b, head[i]) || fail(`entry #${i + 1} was modified; only append a new entry at the end`));
  const e = head[head.length - 1];
  if (!e || typeof e !== "object" || Array.isArray(e)) fail("the new entry must be a mapping");
  for (const k of Object.keys(e)) if (!USER_KEYS.has(k)) fail(`field \`${k}\` is not allowed (it is filled automatically or unknown)`);
  for (const k of ["name", "text"]) if (typeof e[k] !== "string" || !e[k].trim()) fail(`\`${k}\` is required`);
  for (const [k, max] of Object.entries(LIMITS)) {
    if (e[k] !== undefined && typeof e[k] !== "string") fail(`\`${k}\` must be text`);
    if (typeof e[k] === "string" && e[k].length > max) fail(`\`${k}\` is too long (${e[k].length}/${max})`);
  }
  if (/<[a-z!/]/i.test(`${e.name} ${e.text} ${e.psm ?? ""}`)) fail("HTML is not allowed");
  console.log(`ok: new entry from "${e.name}"`);
}

function stamp(beforePath, login, pr, date) {
  const before = entries(readFileSync(beforePath, "utf8"));
  const doc = parseDocument(readFileSync(FILE, "utf8"));
  const list = doc.get("entries");
  if (!list || !list.items) return console.log("no entries");
  let n = 0;
  list.items.forEach((item, i) => {
    if (i < before.length || item.get("github")) return;
    item.set("github", login);
    item.set("avatar", `https://github.com/${login}.png?size=64`);
    if (pr) item.set("pr", pr);
    item.set("date", date);
    n++;
  });
  if (n) writeFileSync(FILE, doc.toString({ lineWidth: 0 }));
  console.log(`stamped ${n} entr${n === 1 ? "y" : "ies"} for @${login}`);
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === "validate") validate(args[0], args[1] ?? FILE);
else if (cmd === "stamp") stamp(args[0], args[1], args[2], args[3]);
else fail("usage: guestbook.mjs validate <base> [head] | stamp <before> <login> <pr-url> <date>");
