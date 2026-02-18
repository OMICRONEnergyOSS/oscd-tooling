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

export function runBinaryAndExit(command: string, args: string[] = []): void {
  const result = runBinary(command, args);

  if (result.error) {
    console.error('Failed to spawn', command, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
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
