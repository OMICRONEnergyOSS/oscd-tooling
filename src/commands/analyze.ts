import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";

const cemBin = resolvePackageBin("@custom-elements-manifest/analyzer", "cem");

export async function analyze() {
  runNodeScriptAndExit(cemBin, [
    "analyze", "--litelement", "--exclude", "demo/*", "--exclude", "dist/* ", "--exclude", "*.spec.ts", "--exclude", "*.test.ts", "--exclude", "coverage/*",
  ],
  "Web Component Analyser");
}
