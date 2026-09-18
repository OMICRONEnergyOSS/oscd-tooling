import path from "node:path";
import chalk from "chalk";
import { runBinary, runBinaryAndExit, runNodeScriptAndExit } from "../core/runBinary.js";
import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";

const ncuBin = resolvePackageBin("npm-check-updates", "ncu");

export interface UpdatesOptions {
  /**
   * Apply the allowed upgrades to package.json and run `npm install`,
   * non-interactively. Without this, `updates` runs `ncu --interactive` so a
   * developer can still pick and choose among the upgrades the policy allows.
   */
  write?: boolean;
}

export async function updates(options: UpdatesOptions = {}) {
  // A project-local `ncurc.config.js` (repo root) always wins over the shared
  // default in `configs/`, same as the other tool configs `oscd` resolves.
  const configPath = resolveToolConfig("ncurc.config.js");
  const configArgs = [
    "--configFilePath",
    path.dirname(configPath),
    "--configFileName",
    path.basename(configPath),
  ];

  if (!options.write) {
    runNodeScriptAndExit(
      ncuBin,
      [...configArgs, "--interactive"],
      "Check dependency updates",
    );
    return;
  }

  console.log(chalk.blue("Applying allowed dependency upgrades..."));
  const ncuResult = runBinary(process.execPath, [
    ncuBin,
    ...configArgs,
    "--upgrade",
  ]);
  if (ncuResult.error || ncuResult.status !== 0) {
    console.error(chalk.red("Failed to upgrade dependencies."));
    process.exit(ncuResult.status ?? 1);
  }

  runBinaryAndExit("npm", ["install"], "Install updated dependencies");
}
