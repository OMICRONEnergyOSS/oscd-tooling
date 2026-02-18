import { runBinaryAndExit } from "../core/runBinary.js";
import { resolveToolConfig } from "../core/resolver.js";

export async function build() {
  const cfg = resolveToolConfig("rollup.config.js");
  runBinaryAndExit("rollup", ["--config", cfg]);
}
