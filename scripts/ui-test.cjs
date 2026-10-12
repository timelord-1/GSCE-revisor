const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
(async () => {
 const server=spawn(process.execPath,[path.join(__dirname,'serve.cjs')],{stdio:'pipe'});
 let browser;
 try {
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Server exited '+code)));});
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173');
  assert.equal(await page.locator('.topic-card').count(),4);
  await page.screenshot({path:'/tmp/trilogy-dashboard.png',fullPage:true});
  for(const [subject,counts] of [['Biology',[4,3]],['Chemistry',[5,5]],['Physics',[4,3]]]){
   await page.locator(`[data-subject="${subject}"]`).click();
   for(let paper=1;paper<=2;paper++){await page.locator(`[data-paper="${paper}"]`).click();assert.equal(await page.locator('.topic-card').count(),counts[paper-1]);}
  }
  await page.locator('#tier').selectOption('foundation');
  await page.locator('#topic-grid [data-topic="6.7"]').click();
  await page.locator('#search').fill('motor effect');
  assert.equal(await page.locator('.search-card').count(),0);
  await page.locator('#tier').selectOption('higher');
  assert.equal(await page.locator('.search-card').count(),1);
  await page.locator('#search').fill('');
  await page.locator('[data-subject="Biology"]').click();await page.locator('[data-paper="1"]').click();
  await page.locator('#topic-grid [data-topic="4.1"]').click();
  await page.locator('#start-review').click();
  assert.match(await page.locator('#card-question').innerText(),/eukaryotic/);
  assert.equal(await page.locator('#card-answer').count(),0);
  await page.keyboard.press('Space');
  assert.match(await page.locator('#card-answer').innerText(),/nucleus/);
  await page.screenshot({path:'/tmp/trilogy-flashcard.png',fullPage:true});
  await page.keyboard.press('3');
  let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('trilogy-revision-v1')));
  assert.equal(saved.progress['4.1-01'].phase,'learning');assert.equal(saved.history.length,1);
  await page.locator('#undo-review').click();
  saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('trilogy-revision-v1')));assert.equal(saved.history.length,0);assert.equal(Object.keys(saved.progress).length,0);
  await page.locator('[data-rating="easy"]').click();
  saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('trilogy-revision-v1')));assert.equal(saved.progress['4.1-01'].interval,4);
  await page.reload();
  assert.equal(await page.locator('#today-stat').innerText(),'1');
  await page.locator('#start-practice').click();await page.locator('#show-answer').click();await page.locator('#next-practice').click();
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('trilogy-revision-v1')).progress),saved.progress);
  await page.locator('#end-session').click();
  await page.locator('#settings').click();
  const downloadEvent=page.waitForEvent('download');await page.locator('#export-backup').click();const download=await downloadEvent;
  const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(exported.history.length,1);
  await page.locator('#reset-progress').click();await page.locator('#reset-confirm').fill('RESET');await page.locator('#confirm-reset').click();
  assert.equal(await page.locator('#today-stat').innerText(),'0');
  await page.locator('#settings').click();
  await page.locator('#backup-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
  await page.locator('#confirm-import').click();assert.equal(await page.locator('#today-stat').innerText(),'1');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('trilogy-revision-v1')).progress),saved.progress);
  await page.locator('#settings').click();await page.locator('#new-limit').fill('0');await page.locator('#save-settings').click();await page.locator('#close-dialog').click();
  await page.locator('#start-review').click();assert.match(await page.locator('#study-panel').innerText(),/Caught up for now/);
  await page.locator('#finish-session').click();
  await page.locator('#search').fill('osmosis');assert.ok(await page.locator('.search-card').count()>0);
  await page.locator('.search-card').first().click();assert.ok(await page.locator('.browse-answer').count());await page.locator('#close-dialog').click();
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/trilogy-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  assert.deepEqual(errors,[]);
  console.log('PASS: six papers, tier filtering, question/answer, ratings, undo, persistence, practice, export/import, daily limit, search, responsive layout. No browser exceptions.');
 } finally {if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
