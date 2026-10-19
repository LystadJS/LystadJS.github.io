import { spawnSync } from 'node:child_process';

// PYTHON may point to an authoring virtual environment on either platform.
export const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

export function runPython(args) {
  const result = spawnSync(python, args, { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}
