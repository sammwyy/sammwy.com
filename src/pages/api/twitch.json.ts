import type { APIRoute } from "astro";
import { getSocial } from "../../lib/data";
import { getChannels, twitchConfigured } from "../../lib/twitch";

export const GET: APIRoute = async () =>
  Response.json({ configured: twitchConfigured(), channels: await getChannels(getSocial().twitch.channels) });
