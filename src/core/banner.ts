import chalk from "chalk";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let hasShownBanner = false;

function getCliVersion(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // dist/core/banner.js → go up to package.json
  const pkgPath = path.resolve(__dirname, "../../package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

export function showBannerOnce() {
  if (hasShownBanner) {
    return;
  }
  if (!process.stdout.isTTY) {
    return;
  }

  hasShownBanner = true;

  const version = getCliVersion();
  const nodeVersion = process.version;

  const title = chalk.cyan.bold("OpenSCD CLI");
  const subtitle = chalk.dim("— OpenSCD Plugin Toolkit");
  const meta = chalk.gray(`v${version} • Node ${nodeVersion}`);
  const divider = chalk.gray("─".repeat(30));

  console.log(`
${title} ${subtitle}
${meta}
${divider}
`);
}
