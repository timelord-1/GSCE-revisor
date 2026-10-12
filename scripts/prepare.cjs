const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');
const result = spawnSync(process.execPath, [require.resolve('electron/install.js')], {
  stdio: 'inherit',
  env: { ...process.env, NODE_USE_ENV_PROXY: process.env.NODE_USE_ENV_PROXY ?? '1', electron_config_cache: path.join(os.tmpdir(), 'trilogy-build-cache', 'electron') }
});
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status ?? 1);
