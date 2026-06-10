import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";
import { analyze } from "./analyze.js";
import { clean } from "./clean.js";

const tscBin = resolvePackageBin("typescript", "tsc");

export interface BuildOptions {
  clean?: boolean;
  analyze?: boolean;
}

export async function build(options: BuildOptions = {}) {
  if (options.clean){
    clean();
  }
  if (options.analyze){
    analyze();
  }
  runNodeScriptAndExit(tscBin, [], "Dev Build");
}
