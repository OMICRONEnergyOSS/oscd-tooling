#!/usr/bin/env node
import { Command } from "commander";
import { lint } from "./commands/lint.js";
import { testCmd } from "./commands/test.js";
import { build } from "./commands/build.js";
import { doctor } from "./commands/doctor.js";
import { versionInfo } from "./core/versionInfo.js";
import { commitlintCommand } from "./commands/commitlint.js";
import { gitHooksInstall } from "./commands/gitHooks.js";
import { showBannerOnce } from "./core/banner.js";

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
    .command("lint")
    .description("Run linter")
    .action(async () => {
      await lint();
    });

  program
    .command("test")
    .description("Run tests")
    .action(async () => {
      await testCmd();
    });

  program
    .command("build")
    .description("Run build")
    .action(async () => {
      await build();
    });

  program
    .command("doctor")
    .description("Run health checks and drift detection")
    .option("--fix", "Attempt to auto-fix issues (install hooks, add scripts)")
    .action(async (opts) => {
      await doctor(opts);
    });

  program
    .command("versions")
    .description("Show toolchain versions")
    .action(async () => {
      await versionInfo();
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

  // allow legacy flags
  if (argv.includes("--doctor")) {
    // legacy compatibility: treat --doctor as 'doctor'
    await doctor();
    return;
  }

  await program.parseAsync(argv, { from: "user" });
}
