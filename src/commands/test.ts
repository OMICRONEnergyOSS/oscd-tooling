import { runBinaryAndExit } from "../core/runBinary.js";
import { resolveToolConfig } from "../core/resolver.js";

export async function testCmd() {
  const cfg = resolveToolConfig("vitest.config.js");
  runBinaryAndExit("vitest", ["run", "--config", cfg]);
}
