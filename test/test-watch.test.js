import assert from "node:assert/strict";
import childProcess from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import process from "node:process";
import { testCmd } from "../dist/commands/test.js";
import { resolvePackageBin, resolveToolConfig } from "../dist/core/resolver.js";
import { nodeCommand } from "../dist/core/runBinary.js";

const tscBin = resolvePackageBin("typescript", "tsc");
const wtrBin = resolvePackageBin("@web/test-runner", "wtr");
const concurrentlyBin = resolvePackageBin("concurrently", "concurrently");
const config = resolveToolConfig("web-test-runner.config.js");

async function captureCommands(t, options) {
  const calls = [];
  t.mock.method(childProcess, "spawnSync", (command, args) => {
    calls.push([command, ...args]);
    return { status: 0 };
  });
  syncBuiltinESMExports();
  t.after(() => {
    t.mock.restoreAll();
    syncBuiltinESMExports();
  });
  await testCmd(options);
  return calls;
}

test("unit watch builds first, then starts both watchers with coupled shutdown", async t => {
  const calls = await captureCommands(t, { watch: true });
  assert.deepEqual(calls, [
    [process.execPath, tscBin],
    [
      process.execPath, concurrentlyBin, "-k", "-r",
      nodeCommand(tscBin, ["--watch", "--preserveWatchOutput"]),
      nodeCommand(wtrBin, ["--config", config, "--group", "unit", "--coverage", "--watch"]),
    ],
  ]);
});

test("normal unit tests still build once and run directly", async t => {
  assert.deepEqual(await captureCommands(t, {}), [
    [process.execPath, tscBin],
    [process.execPath, wtrBin, "--config", config, "--group", "unit", "--coverage"],
  ]);
});

test("visual tests retain their existing non-watch behavior", async t => {
  assert.deepEqual(await captureCommands(t, { visual: true, watch: true }), [
    [process.execPath, tscBin],
    [process.execPath, wtrBin, "--config", config, "--group", "visual", "--coverage"],
  ]);
});

test("visual baseline updates retain their existing behavior", async t => {
  assert.deepEqual(await captureCommands(t, { update: true, watch: true }), [
    [process.execPath, tscBin],
    [
      process.execPath, wtrBin, "--config", config, "--group", "visual",
      "--coverage", "--update-visual-baseline",
    ],
  ]);
});

test("the compiler watch command rebuilds JavaScript after a source edit", { timeout: 20000 }, async t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "oscd-test-watch-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  fs.writeFileSync(path.join(cwd, "tsconfig.json"), JSON.stringify({
    compilerOptions: { outDir: "dist", types: [] },
    include: ["example.ts"],
  }));
  const source = path.join(cwd, "example.ts");
  const output = path.join(cwd, "dist/example.js");
  fs.writeFileSync(source, 'export const value = "before";');

  const compiler = childProcess.spawn(process.execPath, [
    tscBin, "--watch", "--preserveWatchOutput",
  ], { cwd, stdio: ["ignore", "pipe", "pipe"] });
  let diagnostics = "";
  compiler.stdout.on("data", data => { diagnostics += data; });
  compiler.stderr.on("data", data => { diagnostics += data; });
  const closed = once(compiler, "close");
  t.after(async () => {
    compiler.kill();
    await closed;
  });

  async function waitForOutput(value) {
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      assert.equal(compiler.exitCode, null, diagnostics);
      if (fs.existsSync(output) && fs.readFileSync(output, "utf8").includes(value)) {
        return;
      }
      await setTimeout(50);
    }
    assert.fail(`Compiler did not emit ${value}:\n${diagnostics}`);
  }

  await waitForOutput("before");
  fs.writeFileSync(source, 'export const value = "after";');
  await waitForOutput("after");
});
