import chalk from 'chalk';
import { spawnSync } from 'node:child_process';

export interface RunResult {
  status: number | null;
  error?: Error;
}

export function runBinary(command: string, args: string[] = []): RunResult {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
    shell: process.platform === 'win32'
  });

  return {
    status: result.status,
    error: result.error ?? undefined
  };
}

export function runBinaryAndExit(command: string, args: string[] = [], label?: string): void {
  if (label){
    console.log(chalk.blue(`Running ${label}...`));
  }
  const result = runBinary(command, args);

  if (result.error) {
    console.error('Failed to spawn', command, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    if (label){
      console.log(`${label} failed with return code ${result.status}`);
    }
    process.exit(result.status ?? 1);
  }
  if (label){
    console.log(chalk.green(`${label} completed successfully.`));
  }
}

export function runNodeScriptAndExit(script: string, args: string[] = [], label?: string): void {
  runBinaryAndExit(process.execPath, [script, ...args], label);
}

export function runBinaryCapture(
  command: string,
  args: string[] = []
): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: process.platform === 'win32',
    encoding: 'utf8'
  });

  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? ''
  };
}
