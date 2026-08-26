#!/usr/bin/env node

/**
 * NLAMS - Unified Full-Stack Prototype Launcher
 * Starts both FastAPI Backend (port 8000) and Vite Frontend (port 5173) concurrently.
 */

const { spawn } = require('child_process');
const path = require('path');

// ANSI Color codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const MAGENTA = '\x1b[35m';

console.log(`${BOLD}${YELLOW}
===================================================================
 🇮🇳  NLAMS - National Land Acquisition & Management System
     8 Core Working Prototype Launcher (SIH / DoLR)
===================================================================${RESET}
`);

console.log(`${BOLD}${CYAN}🚀 Initializing Backend & Frontend services...${RESET}\n`);

const ROOT_DIR = __dirname;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

// 1. Launch FastAPI Backend
console.log(`${CYAN}[BACKEND]${RESET} Starting FastAPI backend on http://localhost:8000 ...`);
const backendProcess = spawn(
  'python',
  ['-m', 'uvicorn', 'backend.main:app', '--reload', '--port', '8000', '--host', '127.0.0.1'],
  {
    cwd: ROOT_DIR,
    shell: true,
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
  }
);

backendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line.trim()) {
      console.log(`${CYAN}[BACKEND]${RESET} ${line}`);
    }
  });
});

backendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line.trim()) {
      console.log(`${CYAN}[BACKEND]${RESET} ${line}`);
    }
  });
});

backendProcess.on('error', (err) => {
  console.error(`${RED}[BACKEND ERROR]${RESET} Failed to start backend: ${err.message}`);
});

// 2. Launch Vite Frontend
console.log(`${GREEN}[FRONTEND]${RESET} Starting Vite frontend on http://localhost:5173 ...\n`);
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: FRONTEND_DIR,
  shell: true,
  env: { ...process.env }
});

frontendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line.trim()) {
      console.log(`${GREEN}[FRONTEND]${RESET} ${line}`);
    }
  });
});

frontendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    if (line.trim()) {
      console.log(`${GREEN}[FRONTEND]${RESET} ${line}`);
    }
  });
});

frontendProcess.on('error', (err) => {
  console.error(`${RED}[FRONTEND ERROR]${RESET} Failed to start frontend: ${err.message}`);
});

// Helpful summary after brief startup
setTimeout(() => {
  console.log(`
${BOLD}${GREEN}✔ NLAMS Services are up and running!${RESET}
-------------------------------------------------------------------
  🌐 ${BOLD}Frontend App:${RESET}    ${GREEN}http://localhost:5173${RESET}
  ⚙️  ${BOLD}Backend API:${RESET}     ${CYAN}http://localhost:8000${RESET}
  📖 ${BOLD}Swagger Docs:${RESET}    ${CYAN}http://localhost:8000/docs${RESET}
-------------------------------------------------------------------
  ${YELLOW}Press Ctrl + C in this terminal to stop both servers.${RESET}
`);
}, 3000);

// Graceful Shutdown Handlers
function cleanup() {
  console.log(`\n${YELLOW}[NLAMS] Shutting down Backend and Frontend processes...${RESET}`);

  if (backendProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', backendProcess.pid.toString(), '/f', '/t'], { shell: true });
      } else {
        backendProcess.kill('SIGTERM');
      }
    } catch (e) {}
  }

  if (frontendProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', frontendProcess.pid.toString(), '/f', '/t'], { shell: true });
      } else {
        frontendProcess.kill('SIGTERM');
      }
    } catch (e) {}
  }

  setTimeout(() => {
    console.log(`${GREEN}[NLAMS] Shutdown complete. Goodbye!${RESET}\n`);
    process.exit(0);
  }, 1000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {});
