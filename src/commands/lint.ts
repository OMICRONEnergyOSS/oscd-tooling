import { runBinaryAndExit } from "../core/runBinary.js";
import { resolveToolConfig } from "../core/resolver.js";

export async function lint() {
  const config = resolveToolConfig("eslint.config.js");
  runBinaryAndExit("eslint", [
    ".",
    "--config",
    config,
    "--ext",
    ".ts,.js,.tsx,.jsx",
  ]);
}
