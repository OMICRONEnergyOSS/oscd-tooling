import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";
import { clean } from "./clean.js";
import { analyze } from "./analyze.js";
import { BuildOptions } from "./build.js";

const rollupBin = resolvePackageBin("rollup", "rollup");

export interface BundleOptions extends BuildOptions {
  watch?: boolean;
}

export async function bundle(options: BundleOptions = {}) {
  const cfg = resolveToolConfig("rollup.config.js");
  if (options.clean) {
    clean();
  }
  if (options.analyze) {
    analyze();
  }
  runNodeScriptAndExit(rollupBin, [
    "--config", 
    cfg, 
    ...(options.watch ? ['--watch']:[])
  ]);
}
