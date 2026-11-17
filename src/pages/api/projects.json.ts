import type { APIRoute } from "astro";
import { getProjects } from "../../lib/data";

export const GET: APIRoute = ({ url }) => {
  const cat = url.searchParams.get("category");
  const { projects } = getProjects();
  return Response.json(cat ? projects.filter((p) => p.category === cat) : projects);
};
