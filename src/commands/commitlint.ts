import { resolveToolConfig, resolveToolExecutable } from "../core/resolver.js";
import { runBinaryAndExit } from "../core/runBinary.js";

interface CommitlintOptions {
  edit?: string;
}

const commitlintPath = resolveToolExecutable("@commitlint/cli", "cli.js");
const configPath = resolveToolConfig("commitlint.config.js");

export async function commitlintCommand(opts: CommitlintOptions = {}) {
  const edit = opts && opts.edit;
  const args = ["--config", configPath];
  if (edit) {
    args.push("--edit", edit);
  } else {
    args.push("--from", "HEAD~1"); // fallback: lint last commit message
  }
  runBinaryAndExit(commitlintPath, args);
}
