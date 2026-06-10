import { resolvePackageBin, resolveToolConfig } from "../core/resolver.js";
import { runNodeScriptAndExit } from "../core/runBinary.js";

interface CommitlintOptions {
  edit?: string;
}

const commitlintPath = resolvePackageBin("@commitlint/cli", "commitlint");
const configPath = resolveToolConfig("commitlint.config.js");

export async function commitlintCommand(opts: CommitlintOptions = {}) {
  const edit = opts && opts.edit;
  const args = ["--config", configPath];
  if (edit) {
    args.push("--edit", edit);
  } else {
    args.push("--from", "HEAD~1"); // fallback: lint last commit message
  }
  runNodeScriptAndExit(commitlintPath, args);
}
