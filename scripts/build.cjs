const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');
const cache = path.join(os.tmpdir(), 'trilogy-build-cache');
const result = spawnSync(process.execPath, [require.resolve('electron-builder/out/cli/cli.js'), '--win', 'portable', '--x64', '--publish', 'never', `--config.electronDownload.cache=${path.join(cache, 'electron')}`], {
  stdio: 'inherit',
  env: { ...process.env, XDG_CACHE_HOME: cache, ELECTRON_CACHE: path.join(cache, 'electron'), ELECTRON_BUILDER_CACHE: path.join(cache, 'builder') }
});
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status ?? 1);
