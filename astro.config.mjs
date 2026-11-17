import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://sammwy.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  devToolbar: { enabled: false },
  build: { inlineStylesheets: "never" },
});
