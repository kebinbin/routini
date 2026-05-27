import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { highlightSnippets } from "./plugins/highlight-snippets";

export default defineConfig({
  plugins: [react(), tailwindcss(), highlightSnippets()],
});
