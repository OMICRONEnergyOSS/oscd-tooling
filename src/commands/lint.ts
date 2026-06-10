import { runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";

const eslintBin = resolvePackageBin("eslint", "eslint");

export interface LintOptions {
  format?: boolean;
}

export async function lint(options: LintOptions = {}, files: string[] = []) {
  const config = resolveToolConfig("eslint.config.js");
  runNodeScriptAndExit(eslintBin, [
    ...(files.length ? files : ["."]),
    "--config",
    config,
    ...(!files.length ? ["--ext", ".ts,.js,.tsx,.jsx"] : []),
    ...(options.format ? ["--fix"] : []),
  ]);
}
