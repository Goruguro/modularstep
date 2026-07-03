/**
 * Deployment script for ModularStep.com
 * Packages the site into a single compressed tarball and deploys it to the Paris VCN server.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const sshKey = 'C:\\Users\\Administrator\\.ssh\\paris_yeni';
const serverIp = '89.168.52.188';
const serverUser = 'ubuntu';
const remotePath = '/www/wwwroot/modularstep.com';
const localTar = 'dist.tar.gz';

console.log('[*] Starting deployment of ModularStep.com...');

try {
    // Step 1: Compress local dist folder
    console.log('[*] Compressing local dist folder...');
    if (fs.existsSync(localTar)) {
        fs.unlinkSync(localTar);
    }
    execSync(`tar -czf ${localTar} -C dist .`);
    console.log('[+] Compression successful. Created dist.tar.gz');

    // Step 2: Upload tarball via SCP
    console.log(`[*] Transferring ${localTar} to remote server ${serverIp}...`);
    execSync(`scp -i ${sshKey} ${localTar} ${serverUser}@${serverIp}:${remotePath}/`);
    console.log('[+] File transfer successful.');

    // Step 3: Extract and clean up remote files via SSH
    console.log('[*] Extracting package on remote server...');
    const remoteCommands = [
        // Ensure remote dist folder exists
        `mkdir -p ${remotePath}/dist`,
        // Extract to remote dist folder
        `tar -xzf ${remotePath}/${localTar} -C ${remotePath}/dist`,
        // Remove uploaded tarball on server
        `rm ${remotePath}/${localTar}`
    ].join(' && ');

    execSync(`ssh -i ${sshKey} ${serverUser}@${serverIp} "${remoteCommands}"`);
    console.log('[+] Remote extraction complete.');

    // Step 4: Cleanup local tarball
    if (fs.existsSync(localTar)) {
        fs.unlinkSync(localTar);
    }
    console.log('[+] Local cleanup complete.');
    console.log('[===] Deployment finished successfully! [===]');
} catch (error) {
    console.error('[-] Deployment failed with error:', error.message);
    process.exit(1);
}
