import { nodeCommand, runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";
import { build } from "./build.js";

const wtrBin = resolvePackageBin("@web/test-runner", "wtr");
const tscBin = resolvePackageBin("typescript", "tsc");
const concurrentlyBin = resolvePackageBin("concurrently", "concurrently");
const config = resolveToolConfig("web-test-runner.config.js");

export interface TestOptions {
  watch?: boolean;
  update?: boolean;
  visual?: boolean;
}

export async function testCmd(options: TestOptions= {}) {
  await build();
  if (options.visual || options.update){

    runNodeScriptAndExit(wtrBin, [
      "--config",
      config,
      "--group",
      "visual",
      "--coverage",
      ...(options.update ? ["--update-visual-baseline"]:[])
    ], `Visual Regression Testing ${options.update ? "(updating baseline)":""}`);
  }else {
    const args = [
      "--config",
      config,
      "--group",
      "unit",
      "--coverage",
      ...(options.watch ? ["--watch"]:[])
    ];
    if (options.watch) {
      runNodeScriptAndExit(concurrentlyBin, [
        "-k",
        "-r",
        nodeCommand(tscBin, ["--watch", "--preserveWatchOutput"]),
        nodeCommand(wtrBin, args),
      ], "Unit Testing (watch)");
    } else {
      runNodeScriptAndExit(wtrBin, args, "Unit Testing");
    }
  }
}
