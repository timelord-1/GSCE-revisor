const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');
const platform = process.argv[2] || 'win';
if (!['win', 'linux'].includes(platform)) { console.error('Choose win or linux.'); process.exit(1); }
const target = platform === 'linux' ? ['--linux', 'deb'] : ['--win', 'portable'];
const check=spawnSync(process.execPath,[path.join(__dirname,'check-papers.cjs')],{stdio:'inherit'});
if(check.status!==0)process.exit(check.status??1);
const cache = path.join(os.tmpdir(), 'trilogy-build-cache');
const result = spawnSync(process.execPath, [require.resolve('electron-builder/out/cli/cli.js'), ...target, '--x64', '--publish', 'never', `--config.electronDownload.cache=${path.join(cache, 'electron')}`], {
  stdio: 'inherit',
  env: { ...process.env, XDG_CACHE_HOME: cache, ELECTRON_CACHE: path.join(cache, 'electron'), ELECTRON_BUILDER_CACHE: path.join(cache, 'builder') }
});
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status ?? 1);
