import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";

const ncuBin = resolvePackageBin("npm-check-updates", "ncu");

export async function updates() {
  runNodeScriptAndExit(ncuBin, ["--interactive"], "Check dependency updates");
}
