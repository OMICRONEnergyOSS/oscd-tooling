import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";

const rimrafBin = resolvePackageBin("rimraf", "rimraf");

export async function clean() { 
  runNodeScriptAndExit(rimrafBin, [
    "--glob",
    "'dist/!(__snapshots__)'",
  ], "Clean (dist)"); 
}
