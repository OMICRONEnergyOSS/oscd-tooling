import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import process from "node:process";
import { test } from "node:test";
import policy from "../configs/ncurc.config.js";
import { resolvePackageBin } from "../dist/core/resolver.js";

const require = createRequire(import.meta.url);
const expectedVersion = "1.59.1";

test("repository update scripts require interactive selection and reject Playwright", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const args = pkg.scripts.updates.split(" ");
  assert.equal(args[0], "ncu");
  assert.ok(args.includes("--interactive"));
  assert.equal(args[args.indexOf("--reject") + 1], "playwright");
  assert.equal(args[args.indexOf("--configFilePath") + 1], "./configs");
  assert.equal(args[args.indexOf("--configFileName") + 1], "ncurc.config.js");
  assert.equal(pkg.scripts.update, "npm run updates && npm install");
});

test("the manifest, lockfile, installer, and WTR use the pinned Playwright version", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const lock = JSON.parse(fs.readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
  const launcherRequire = createRequire(require.resolve("@web/test-runner-playwright"));
  const installerRequire = createRequire(resolvePackageBin("playwright", "playwright"));

  assert.equal(pkg.dependencies.playwright, expectedVersion);
  assert.equal(lock.packages[""].dependencies.playwright, expectedVersion);
  assert.equal(lock.packages["node_modules/playwright"].version, expectedVersion);
  assert.equal(lock.packages["node_modules/playwright-core"].version, expectedVersion);
  assert.equal(installerRequire("playwright/package.json").version, expectedVersion);
  assert.equal(launcherRequire("playwright/package.json").version, expectedVersion);
});

test("the default update policy excludes Playwright", () => {
  assert.ok(policy.reject.includes("playwright"));
  const result = spawnSync(process.execPath, [
    resolvePackageBin("npm-check-updates", "ncu"),
    "--configFilePath", "configs",
    "--configFileName", "ncurc.config.js",
    "--filter", "playwright",
    "--jsonUpgraded",
  ], { encoding: "utf8" });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {});
});
