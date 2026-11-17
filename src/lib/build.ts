import { execSync } from "node:child_process";
import type { Site } from "./data";

function git(cmd: string) {
  try {
    return execSync(`git ${cmd}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

const commit = process.env.BUILD_COMMIT || git("rev-parse --short HEAD") || "dev";
const commitDate = git("log -1 --format=%cI");

export function getBuild(site: Site) {
  const modified = new Date(commitDate || site.lastModified);
  const elapsed = Math.max(0, Math.floor((Date.now() - modified.getTime()) / 1000));
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(modified)
      .map((p) => [p.type, p.value]),
  );
  return {
    version: site.version,
    commit,
    modified,
    modifiedLabel: `${parts.day}.${parts.month}.${parts.year} ${parts.hour}:${parts.minute}`,
    uptime: { days: Math.floor(elapsed / 86400), rest: elapsed % 86400, total: elapsed },
  };
}
