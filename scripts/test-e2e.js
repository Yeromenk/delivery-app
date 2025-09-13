const { spawn } = require('child_process');
const path = require('path');

let frontendProcess;
let backendProcess;

function startBackend() {
    return new Promise((resolve, reject) => {
        console.log('Starting backend server...');
        backendProcess = spawn('npm', ['run', 'dev'], {
            cwd: path.join(__dirname, '..', 'back-end'),
            stdio: 'pipe'
        });

        backendProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Backend:', output);
            if (output.includes('Server is running on port 5000')) {
                setTimeout(resolve, 2000); // Wait 2 seconds for stability
            }
        });

        backendProcess.stderr.on('data', (data) => {
            console.error('Backend error:', data.toString());
        });

        backendProcess.on('error', reject);
    });
}

function startFrontend() {
    return new Promise((resolve, reject) => {
        console.log('Starting frontend server...');
        frontendProcess = spawn('npm', ['run', 'dev'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });

        frontendProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Frontend:', output);
            if (output.includes('Local:') && output.includes('5173')) {
                setTimeout(resolve, 3000); // Wait 3 seconds for stability
            }
        });

        frontendProcess.stderr.on('data', (data) => {
            console.error('Frontend error:', data.toString());
        });

        frontendProcess.on('error', reject);
    });
}

function runCypress() {
    return new Promise((resolve, reject) => {
        console.log('Running Cypress tests...');
        const cypress = spawn('npx', ['cypress', 'run'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });

        cypress.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Cypress exited with code ${code}`));
            }
        });

        cypress.on('error', reject);
    });
}

function cleanup() {
    console.log('Cleaning up...');
    if (frontendProcess) frontendProcess.kill();
    if (backendProcess) backendProcess.kill();
}

async function main() {
    try {
        await startBackend();
        await startFrontend();
        await runCypress();
        console.log('E2E tests completed successfully!');
    } catch (error) {
        console.error('E2E tests failed:', error.message);
        process.exit(1);
    } finally {
        cleanup();
        process.exit(0);
    }
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main();
