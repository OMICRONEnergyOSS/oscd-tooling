import { spawnSync } from 'node:child_process';

function runAndCapture(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', env: process.env, shell: process.platform === 'win32' });
  if (r.error) return `${cmd} not available`;
  return r.stdout?.trim() || r.stderr?.trim() || 'unknown';
}

export async function versionInfo() {
  console.log('Tool versions:');
  console.log('node:', process.version);
  console.log('eslint:', runAndCapture('eslint', ['--version']));
  console.log('rollup:', runAndCapture('rollup', ['--version']));
  console.log('vitest:', runAndCapture('vitest', ['--version']));
  console.log('typescript:', runAndCapture('tsc', ['--version']));
}
