// src/core/tooling.ts

import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

const require = createRequire(import.meta.url);

function resolvePackageJsonPath(pkg: string): string {
  try {
    return require.resolve(`${pkg}/package.json`);
  } catch (error) {
    const entry = require.resolve(pkg);
    let current = path.dirname(entry);

    while (current !== path.dirname(current)) {
      const packageJsonPath = path.join(current, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        return packageJsonPath;
      }
      current = path.dirname(current);
    }

    throw error;
  }
}

export function resolvePackagePath(pkg: string, relativePath: string): string {
  const packageJson = resolvePackageJsonPath(pkg);
  return path.join(path.dirname(packageJson), relativePath);
}

export function resolvePackageBin(pkg: string, binName: string): string {
  const packageJsonPath = resolvePackageJsonPath(pkg);
  const packageJson = require(packageJsonPath);
  const bin =
    typeof packageJson.bin === "string"
      ? packageJson.bin
      : packageJson.bin?.[binName];

  if (!bin) {
    throw new Error(`Could not find bin "${binName}" for package "${pkg}".`);
  }

  return path.join(path.dirname(packageJsonPath), bin);
}

export function resolveToolExecutable(pkg: string, entry: string): string {
  const url = import.meta.resolve(`${pkg}/${entry}`);
  return fileURLToPath(url);
}

/**
 * Resolves the config file a tool should be invoked with.
 *
 * A project-local file named `relativePath` (at the project's `cwd`) always
 * takes precedence over oscd-tooling's own default — the shared configs in
 * `configs/` are merely defaults, not a hard requirement. This lets a project
 * fully own a tool's config (e.g. a multi-entry `rollup.config.js`) while
 * still using the `oscd` CLI for everything else.
 *
 * A project can also *extend* rather than replace a default by importing it
 * from `@omicronenergy/oscd-tooling/configs/<name>` in its own local config
 * file (all files under `configs/` are published for this purpose).
 */
export function resolveToolConfig(relativePath: string): string {
  const localPath = path.join(process.cwd(), relativePath);
  if (fs.existsSync(localPath)) {
    console.log(chalk.dim(`Using project-local config: ${relativePath}`));
    return localPath;
  }

  const url = new URL(`../../configs/${relativePath}`, import.meta.url);
  return fileURLToPath(url);
}
