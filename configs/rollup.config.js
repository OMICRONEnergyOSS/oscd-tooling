// rollup base config exporter (factory)
import path from 'path';

export default function baseConfig(opts = {}) {
  const input = opts.input || 'src/index.ts';
  const output = opts.output || { file: 'dist/index.js', format: 'es' };
  return {
    input,
    output,
    plugins: [
      // placeholder for common plugins like node-resolve, terser, typescript etc.
    ]
  };
}
