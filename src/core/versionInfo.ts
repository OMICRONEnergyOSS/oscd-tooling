import fs from 'node:fs';
import { resolvePackagePath } from './resolver.js';

function packageVersion(pkg: string) {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(resolvePackagePath(pkg, 'package.json'), 'utf8'),
    );
    return packageJson.version ?? 'unknown';
  } catch {
    return 'not available';
  }
}

export async function versionInfo() {
  console.log('Tool versions:');
  console.log('node:', process.version);
  console.log('eslint:', packageVersion('eslint'));
  console.log('rollup:', packageVersion('rollup'));
  console.log('typescript:', packageVersion('typescript'));
  console.log('web-test-runner:', packageVersion('@web/test-runner'));
  console.log('web-test-runner-playwright:', packageVersion('@web/test-runner-playwright'));
  console.log('playwright:', packageVersion('playwright'));
}
