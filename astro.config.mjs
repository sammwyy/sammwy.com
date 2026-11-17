import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://sammwy.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { host: true, port: 4321 },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: "never" },
});
