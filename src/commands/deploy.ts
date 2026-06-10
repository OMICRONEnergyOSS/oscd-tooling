import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin } from "../core/resolver.js";

const ghPagesBin = resolvePackageBin("gh-pages", "gh-pages");

interface DeployOptions {
  branch?: string;
}

export async function deploy(options: DeployOptions = {}) {
  const branch = options.branch ?? "deploy";
  runNodeScriptAndExit(ghPagesBin, [
    "--dist",
    "dist",
    "branch",
    branch,
  ], "Deploy to GH"); 
}
