import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceEntry = join(__dirname, "../src/index.ts");
const rteMentionInWorkspace = fs.existsSync(sourceEntry);
const aliases = {};

if (rteMentionInWorkspace) {
  aliases["squire-rte-mention"] = sourceEntry;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases,
  },
});
