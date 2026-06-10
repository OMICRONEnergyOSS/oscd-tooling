import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";

const playwrightBin = resolvePackageBin("playwright", "playwright");

export async function installPlaywright() {
  runNodeScriptAndExit(playwrightBin, ["install", "--with-deps"], "Install Playwright browsers");
}
