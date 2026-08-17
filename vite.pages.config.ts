import { defineConfig } from "vite";
import { resolve } from "node:path";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.BASE_PATH || "/sm64-title/",
  root: resolve(import.meta.dirname, "pages"),
  publicDir: resolve(import.meta.dirname, "public"),
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  define: {
    "import.meta.env.VITE_PAGES": JSON.stringify("1"),
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
});
