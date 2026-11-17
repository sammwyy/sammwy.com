import type { APIRoute } from "astro";
import { getPosts } from "../../lib/blog";

export const GET: APIRoute = () =>
  Response.json(getPosts().map(({ n, slug, title, description, brief, date, minutes }) => ({ n, slug, title, description, brief, date, minutes })));
