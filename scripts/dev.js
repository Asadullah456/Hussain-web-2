import 'dotenv/config';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    const available = await new Promise((resolve, reject) => {
      const probe = net.createServer();
      probe.once('error', (error) => error.code === 'EADDRINUSE' ? resolve(false) : reject(error));
      probe.listen(port, () => probe.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error(`No available API port found starting at ${startPort}.`);
}

const apiPort = await findAvailablePort(Number(process.env.PORT) || 5001);
const childEnv = { ...process.env, PORT: String(apiPort) };
const children = [
  spawn(process.execPath, [path.join(root, 'server', 'index.js')], { cwd: root, stdio: 'inherit', env: childEnv }),
  spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')], { cwd: root, stdio: 'inherit', env: childEnv }),
];
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = code;
}

for (const child of children) {
  child.on('error', (error) => {
    console.error('Unable to start a development process:', error);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) stop(code ?? (signal ? 1 : 0));
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
