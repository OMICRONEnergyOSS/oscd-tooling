import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";
import { nodeCommand, runNodeScriptAndExit } from "../core/runBinary.js";
import { bundle } from "./bundle.js";
import { StartOptions } from "./start.js";

const concurrentlyBin = resolvePackageBin("concurrently", "concurrently");
const rollupBin = resolvePackageBin("rollup", "rollup");
const wdsBin = resolvePackageBin("@web/dev-server", "wds");

export async function startBundle({build: buildOption, ...rest}: StartOptions = {}) {
  const rollupConfig = resolveToolConfig("rollup.config.js");
  if (buildOption){
    bundle(rest);
  }
  runNodeScriptAndExit(concurrentlyBin, [
    "-k",
    "-r",
    nodeCommand(rollupBin, ["-c", rollupConfig, "--watch"]),
    nodeCommand(wdsBin, ["--root-dir", "./dist", "--watch", "--open", "./demo/"]),
  ], "Bundled Serve");
}
