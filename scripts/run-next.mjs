#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const command = process.argv[2] || 'build';
const incomingArgs = process.argv.slice(3);

// Deployments to Vercel always set VERCEL=1
const isVercel = Boolean(process.env.VERCEL);
const explicitlyRequestedTurbo =
  process.env.TURBO === '1' ||
  process.env.TURBOPACK === '1' ||
  incomingArgs.includes('--turbo') ||
  incomingArgs.includes('--turbopack');
const explicitlyRequestedWebpack =
  incomingArgs.includes('--webpack') || process.env.WEBPACK === '1';

// Use Turbopack when deployed to Vercel or when explicitly requested.
// Use webpack in this Android/PRoot environment where Turbopack's native Rust
// resolver fails on symlinks with "Invalid symlink".
const useTurbopack =
  (isVercel || explicitlyRequestedTurbo) && !explicitlyRequestedWebpack;

const finalArgs = [command];

if (!useTurbopack && (command === 'build' || command === 'dev')) {
  if (!incomingArgs.includes('--webpack')) {
    finalArgs.push('--webpack');
  }
}

finalArgs.push(...incomingArgs);

const child = spawn(process.execPath, [nextBin, ...finalArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
