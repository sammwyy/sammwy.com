import type { APIRoute } from "astro";
import { getSite } from "../../lib/data";
import { getBuild } from "../../lib/build";
import { getVisitors } from "../../lib/counter";

export const GET: APIRoute = () => {
  const site = getSite();
  const build = getBuild(site);
  return Response.json({
    domain: site.domain,
    version: build.version,
    commit: build.commit,
    lastModified: build.modified.toISOString(),
    uptimeSeconds: build.uptime.total,
    online: site.status.online,
    nowPlaying: site.nowPlaying,
    visitors: getVisitors(),
  });
};
