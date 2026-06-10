#!/usr/bin/env node
import { Command } from "commander";
import { lint } from "./commands/lint.js";
import { testCmd } from "./commands/test.js";
import { bundle } from "./commands/bundle.js";
import { checkup } from "./commands/checkup.js";
import { versionInfo } from "./core/versionInfo.js";
import { commitlintCommand } from "./commands/commitlint.js";
import { gitHooksInstall } from "./commands/gitHooks.js";
import { showBannerOnce } from "./core/banner.js";
import { build } from "./commands/build.js";
import { start } from "./commands/start.js";
import { startBundle } from "./commands/start-bundle.js";
import { clean } from "./commands/clean.js";
import { deploy } from "./commands/deploy.js";
import { installPlaywright } from "./commands/install-playwright.js";
import { updates } from "./commands/updates.js";
import { analyze } from "./commands/analyze.js";
import { lintStaged } from "./commands/lint-staged.js";

export async function main(argv: string[]) {
  if (process.stdout.isTTY) {
    showBannerOnce();
  }

  const program = new Command();
  program
    .name("oscd")
    .description("OMICRON centralized dev tooling")
    .version("0.1.0");

  program
    .command("analyze")
    .description("Run CEM analysis to update custom-elements.json")
    .action(async () => {
      await analyze();
    });

  program
    .command("lint [files...]")
    .description("Run linter")
    .option("--format", "Automatically fix lint and formatting issues")
    .action(async (files, opts) => {
      await lint(opts, files);
    });

  program
    .command("lint-staged")
    .description("Run lint fixes and checks on staged JS/TS files")
    .action(async () => {
      await lintStaged();
    });

  program
    .command("test")
    .description("Run tests")
    .option("--watch", "Run unit tests in Watch mode")
    .option("--visual", "Run Visual Regression Tests")
    .option("--update", "Update Visual Regression test baseline images")
    .action(async (opts) => {
      await testCmd(opts);
    });

  program
    .command("start")
    .description("Run development Environment")
    .option("--no-build", "Do not trigger a build (no clean, no cem analysis)")
    .option("--analyze", "Run CEM analysis before starting")
    .option("--no-clean", "Do not clean the dist folder before build")
    .action(async (opts) => {
      await start(opts);
    });

  program
    .command("start-bundle")
    .description("Run bundled version locally")
    .option("--no-build", "Do not trigger a build (no clean, no cem analysis)")
    .option("--analyze", "Run CEM analysis before bundling")
    .option("--no-clean", "Do not clean the dist folder before build")
    .action(async (opts) => {
      await startBundle(opts);
    });

  program
    .command("build")
    .description("Run build")
    .option("--analyze", "Run CEM analysis before building")
    .option("--no-clean", "Do not clean the dist folder before build")
    .action(async (opts) => {
      await build(opts);
    });

  program
    .command("clean")
    .description("Delete all files in the ./dist folder (except the __snapshot__ folder)")
    .action(async () => {
      await clean();
    });

  program
    .command("bundle")
    .description("Build Bundle with Rollup")
    .option("--analyze", "Run CEM analysis before bundling")
    .option("--no-clean", "Do not clean the dist folder before build")
    .action(async (opts) => {
      await bundle(opts);
    });

  program
    .command("checkup")
    .description("Run health checks and drift detection")
    .option("--fix", "Attempt to auto-fix issues (install hooks, add scripts)")
    .action(async (opts) => {
      await checkup(opts);
    });

  program
    .command("versions")
    .description("Show toolchain versions")
    .action(async () => {
      await versionInfo();
    });

  program
    .command("updates")
    .description("Interactively check dependency updates")
    .action(async () => {
      await updates();
    });

  // commitlint related
  program
    .command("commitlint")
    .description("Run commitlint (used by hooks)")
    .option("--edit <file>", "Path to commit message file")
    .action(async (opts) => {
      await commitlintCommand(opts);
    });

  program
    .command("install-hooks")
    .description("Install native git hooks for the consumer repository")
    .option("--force", "Override existing core.hooksPath")
    .action(async (opts) => {
      await gitHooksInstall(opts);
    });

  program
    .command("install-playwright")
    .description("Install Playwright browsers and system dependencies required by tests")
    .action(async () => {
      await installPlaywright();
    });

  program
    .command("deploy")
    .description("Build bundle with rollup and deploy with gh-pages")
    .option("--branch", "Branch gh-pages should deploy to")
    .action(async (opts) => {
      await deploy(opts);
    });

  await program.parseAsync(argv, { from: "user" });
}
