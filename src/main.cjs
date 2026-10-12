const { app, BrowserWindow, session } = require('electron');
const path = require('path');
app.setName('Trilogy Revision');
const smokeTest = process.argv.includes('--smoke-test');
async function createWindow() {
  const window = new BrowserWindow({
    width: 1280, height: 860, minWidth: 840, minHeight: 640,
    show: !smokeTest, backgroundColor: '#f7f8f5', title: 'Trilogy Revision',
    webPreferences: {
      nodeIntegration: false, contextIsolation: true, sandbox: true,
      ...(smokeTest ? { partition: 'trilogy-smoke-test' } : {})
    }
  });
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  window.setMenuBarVisibility(false);
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  await window.loadFile(path.join(__dirname, 'index.html'));
  if (smokeTest) {
    const result = await window.webContents.executeJavaScript(`(() => {
      if (document.querySelectorAll('.topic-card').length !== 4) throw new Error('Topics did not load');
      document.querySelector('#start-review').click();
      if (!document.querySelector('#card-question').textContent.includes('eukaryotic')) throw new Error('Question did not load');
      document.querySelector('#show-answer').click();
      if (!document.querySelector('#card-answer').textContent.includes('nucleus')) throw new Error('Answer did not load');
      document.querySelector('[data-rating="good"]').click();
      const data = JSON.parse(localStorage.getItem('trilogy-revision-v1'));
      if (data.history.length !== 1 || data.progress['4.1-01'].phase !== 'learning') throw new Error('Rating was not saved');
      return true;
    })()`);
    if (result !== true) throw new Error('Desktop smoke test did not complete');
    console.log('PASS: packaged desktop loads cards, reveals answers and saves a scheduled review.');
    app.exit(0);
  }
}
if (smokeTest) setTimeout(() => app.exit(2), 30000).unref();
app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  await createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow().catch(console.error); });
}).catch(error => { console.error(error); app.exit(1); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
