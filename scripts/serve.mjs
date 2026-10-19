import { spawn } from 'node:child_process';
import { python } from './python.mjs';

const server = spawn(python, ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'inherit' });
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
