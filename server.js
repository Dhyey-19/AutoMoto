const { spawn } = require('child_process');

console.log('Starting AutoMoto Monolith Orchestrator...');
console.log(`Azure provided PORT: ${process.env.PORT}`);

const env = { ...process.env };

// 1. Start the Express Backend
console.log('Spawning backend process on internal port 5000...');
const backend = spawn('npm', ['start', '--prefix', 'backend'], { 
  stdio: 'inherit', 
  shell: true,
  env 
});

backend.on('error', (err) => {
  console.error('Failed to start backend process:', err);
});

backend.on('exit', (code) => {
  console.error(`[FATAL] Backend exited with code ${code}`);
  process.exit(code || 1);
});

// 2. Start the Next.js Frontend
console.log('Spawning frontend process on main PORT...');
const frontend = spawn('npm', ['start', '--prefix', 'frontend'], { 
  stdio: 'inherit', 
  shell: true,
  env 
});

frontend.on('error', (err) => {
  console.error('Failed to start frontend process:', err);
});

frontend.on('exit', (code) => {
  console.error(`[FATAL] Frontend exited with code ${code}`);
  process.exit(code || 1);
});
