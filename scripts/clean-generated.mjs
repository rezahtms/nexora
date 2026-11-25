import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function cleanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return cleanDirectory(path);
    if (!entry.name.endsWith(".ts")) return;
    const source = await readFile(path, "utf8");
    const cleaned = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*(?:\r?\n|$)/gm, "");
    await writeFile(path, cleaned.replace(/\n{3,}/g, "\n\n"));
  }));
}

await cleanDirectory("lib/api/generated");
