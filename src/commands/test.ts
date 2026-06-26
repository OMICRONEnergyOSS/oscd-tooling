import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";
import { build } from "./build.js";

const wtrBin = resolvePackageBin("@web/test-runner", "wtr");
const config = resolveToolConfig("web-test-runner.config.js");

export interface TestOptions {
  watch?: boolean;
  update?: boolean;
  visual?: boolean;
}

export async function testCmd(options: TestOptions= {}) {
  build();
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
    runNodeScriptAndExit(wtrBin, [
      "--config",
      config,
      "--group",
      "unit",
      "--coverage",
      ...(options.watch ? ["--watch"]:[])
    ], `Unit Testing`);
  }
}
