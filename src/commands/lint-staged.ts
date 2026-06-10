import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";

const lintStagedBin = resolvePackageBin("lint-staged", "lint-staged");
const config = resolveToolConfig("lint-staged.config.js");

export async function lintStaged() {
  runNodeScriptAndExit(lintStagedBin, ["--config", config], "Lint staged files");
}
