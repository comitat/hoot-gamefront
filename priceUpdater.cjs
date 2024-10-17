const { spawn } = require('child_process');

const process = spawn('node', ['ace', 'price:updater'], {
  stdio: 'inherit', // This will directly pipe stdout and stderr to the current process
});

process.on('close', (code) => {
  console.log(`price:updater exited with code ${code}`);
});
