import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";
import { build, BuildOptions } from "./build.js";

const concurrentlyBin = resolvePackageBin("concurrently", "concurrently");
const tscBin = resolvePackageBin("typescript", "tsc");
const wdsBin = resolvePackageBin("@web/dev-server", "wds");

function nodeCommand(bin: string, args: string[] = []): string {
  return [process.execPath, bin, ...args].map(arg => JSON.stringify(arg)).join(" ");
}

export interface StartOptions extends BuildOptions {
  build?: boolean;
}
export async function start({build: buildOption, ...rest}: StartOptions = {}) {
  if (buildOption){
    build(rest);
  }
  runNodeScriptAndExit(concurrentlyBin, [
    "-k",
    "-r",
    `"${nodeCommand(tscBin, ["--watch", "--preserveWatchOutput"])}"`,
    `"${nodeCommand(wdsBin, ["--node-resolve", "--root-dir", "./", "--open", "./demo/"])}"`,
  ], "Development Server");
}
