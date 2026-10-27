const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const {registerPaperWindows} = require('./paper-windows.cjs');
let mainWindow;
app.setName('Trilogy Revision');
const smokeTest = process.argv.includes('--smoke-test');
async function createWindow() {
  const window = new BrowserWindow({
    width: 1280, height: 860, minWidth: 840, minHeight: 640,
    show: !smokeTest, backgroundColor: '#f7f8f5', title: 'Trilogy Revision',
    webPreferences: {
      preload:path.join(__dirname,'preload.cjs'),
      nodeIntegration: false, contextIsolation: true, sandbox: true,
      ...(smokeTest ? { partition: 'trilogy-smoke-test' } : {})
    }
  });
  mainWindow = window;
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  window.setMenuBarVisibility(false);
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  await window.loadFile(path.join(__dirname, 'index.html'));
  if (smokeTest) {
    const result = await window.webContents.executeJavaScript(`(async () => {
      if (document.querySelectorAll('.topic-card').length !== 4) throw new Error('Topics did not load');
      document.querySelector('#start-review').click();
      if (!document.querySelector('#card-question').textContent.includes('eukaryotic')) throw new Error('Question did not load');
      document.querySelector('#show-answer').click();
      if (!document.querySelector('#card-answer').textContent.includes('nucleus')) throw new Error('Answer did not load');
      document.querySelector('[data-rating="good"]').click();
      const data = JSON.parse(localStorage.getItem('trilogy-revision-v1'));
      if (data.history.length !== 1 || data.progress['4.1-01'].phase !== 'learning') throw new Error('Rating was not saved');
      document.querySelector('#end-session').click();
      document.querySelector('#card-library').click();
      if (!document.querySelector('#library-count').textContent.includes(DECK.cards.length + ' matching cards')) throw new Error('Full library did not load');
      document.querySelector('#create-card').click();
      document.querySelector('#card-front').value = 'Smoke personal application question?';
      document.querySelector('#card-back').value = 'A personal answer point.';
      document.querySelector('#card-kind').value = 'application';
      document.querySelector('#save-card').click();
      document.querySelector('#close-dialog').click();
      document.querySelector('#settings').click();
      document.querySelector('#study-mode').value = 'application';
      document.querySelector('#save-settings').click();
      document.querySelector('#close-dialog').click();
      document.querySelector('#custom-study').click();
      document.querySelector('#create-plan').click();
      document.querySelector('#deck-name').value = 'Smoke study plan';
      document.querySelector('#deck-search').value = 'Smoke personal application';
      document.querySelector('#deck-search').dispatchEvent(new Event('input'));
      document.querySelector('#select-shown').click();
      document.querySelector('#plan-reviews').value = '1';
      document.querySelector('#save-custom').click();
      document.querySelector('#start-review').click();
      if (!document.querySelector('#card-question').textContent.includes('Smoke personal application')) throw new Error('Personal card not available in plan');
      document.dispatchEvent(new KeyboardEvent('keydown', {code:'Space',key:' ',bubbles:true}));
      document.dispatchEvent(new KeyboardEvent('keydown', {code:'Space',key:' ',bubbles:true}));
      const personal = JSON.parse(localStorage.getItem('trilogy-revision-v1'));
      if (personal.customCards.length !== 1 || !personal.progress[personal.customCards[0].id] || personal.customDecks[0].plan.reviewLimit !== 1) throw new Error('Personal card or plan not saved');
      if (!document.querySelector('#study-panel').textContent.includes('Daily review limit reached')) throw new Error('Plan limit did not apply');
      document.querySelector('#past-papers').click();
      if (document.querySelectorAll('.past-paper-row').length !== 3) throw new Error('Past-paper library failed');
      const paper = await window.trilogyPapers.open('8464b1h-qp-jun25');
      if (!paper.ok) throw new Error('Bundled PDF did not open');
      const denied = await window.trilogyPapers.open('../../outside.pdf');
      if (denied.ok) throw new Error('Unknown PDF request was accepted');
      return true;
    })()`);
    if (result !== true) throw new Error('Desktop smoke test did not complete');
    console.log('PASS: packaged desktop loads cards, browses the full library, creates a personal application card and schedules it within a saved study plan.');
    app.exit(0);
  }
}
if (smokeTest) setTimeout(() => app.exit(2), 30000).unref();
app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  registerPaperWindows(()=>mainWindow,{smokeTest});
  await createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow().catch(console.error); });
}).catch(error => { console.error(error); app.exit(1); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
