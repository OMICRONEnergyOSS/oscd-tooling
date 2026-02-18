// src/core/tooling.ts

import { fileURLToPath } from "node:url";

export function resolveToolExecutable(pkg: string, entry: string): string {
  const url = import.meta.resolve(`${pkg}/${entry}`);
  return fileURLToPath(url);
}

export function resolveToolConfig(relativePath: string): string {
  const url = new URL(`../../configs/${relativePath}`, import.meta.url);
  return fileURLToPath(url);
}
