import fs from "node:fs";
import path from "node:path";
import { gitHooksCheckHealth, gitHooksInstall } from "./gitHooks.js";
import chalk from "chalk";

/*
 * This command is meant to be a "health check" for the consumer project. It can check for common misconfigurations and optionally fix them.
 * For example, it can check if the consumer has the expected scripts in package.json, if they have any local dependencies that should be hoisted to the tooling package, if git hooks are configured correctly, etc.
 * The idea is to help maintain a consistent setup across consumer projects and reduce friction in onboarding new projects.
 */

interface CheckupOptions {
  fix?: boolean;
}

/*
 * Obviously this list in incomplete - its a start.
 */
const packageJSonExpectedScripts = ["lint", "test", "build"];

/*
 * Consider this a "proof of concept" list. The basic idea is to warn the developer about deps they no longer need to maintain in their project!
 */
const unwantedDeps = [
  "eslint",
  "typescript",
  "rollup",
  "vitest",
  "@commitlint/cli",
  "@commitlint/config-conventional",
];

export async function checkup(opts: CheckupOptions = {}) {
  const fix = !!(opts && opts.fix);
  console.log(chalk.blue("Check-Up is running checks..."));
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error(
      chalk.red(
        `Error: No package.json at ${pkgPath}. Check-Up requires a package.json to validate scripts and dependencies.`,
      ),
    );
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  for (const s of packageJSonExpectedScripts) {
    if (!pkg.scripts || !pkg.scripts[s]) {
      console.warn(chalk.yellow(`Missing script: ${s}`));
      if (fix) {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts[s] = `oscd ${s}`;
        console.log(chalk.green(`Added script "${s}": "oscd ${s}"`));
      }
    }
  }

  for (const d of unwantedDeps) {
    if (
      (pkg.devDependencies && pkg.devDependencies[d]) ||
      (pkg.dependencies && pkg.dependencies[d])
    ) {
      console.log(
        `${chalk.yellow("Found local dependency:")} "${chalk.cyan(d)}". ${!fix ? chalk.dim("Consider relying on @omicronenergy/oscd-tooling for this tool.") : ""}`,
      );
      if (fix) {
        if (pkg.devDependencies && pkg.devDependencies[d]) {
          delete pkg.devDependencies[d];
        }
        if (pkg.dependencies && pkg.dependencies[d]) {
          delete pkg.dependencies[d];
        }
        console.log(
          chalk.green(`Removed local dependency ${d} from package.json`),
        );
      }
    }
  }

  if (fix) {
    // write back package.json if we modified it
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log(
      chalk.red.bold(
        "Updated package.json. Please review changes before committing!!!",
      ),
    );
  }

  // Check hooks
  const gitHooksHealthy = gitHooksCheckHealth();
  if (!gitHooksHealthy) {
    if (fix) {
      gitHooksInstall();
    }
  }

  console.log(chalk.green("Check-up checks complete."));
}
