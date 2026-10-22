const fs = require('node:fs/promises');
const path = require('node:path');
const https = require('node:https');
const http = require('node:http');
const {verifyBytes} = require('../src/paper-files.cjs');
const catalog = require('../src/papers-data.js');
const root = path.join(__dirname,'../src/assets/past-papers');
if (http.setGlobalProxyFromEnv) http.setGlobalProxyFromEnv();
function download(document) {
  const url = new URL(document.url);
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || url.pathname !== `/files/p28bar15/green/${document.sha1}.pdf`) return Promise.reject(new Error('Invalid AQA source URL.'));
  return new Promise((resolve,reject) => {
    const request = https.get(url,response => {
      if (response.statusCode !== 200) { response.resume(); reject(new Error(`AQA returned HTTP ${response.statusCode}: ${document.filename}`)); return; }
      const chunks = []; let size = 0;
      response.on('data',chunk => { size += chunk.length; if (size > document.bytes) response.destroy(new Error('Unexpected PDF size.')); else chunks.push(chunk); });
      response.on('end',() => { try { resolve(verifyBytes(document,Buffer.concat(chunks))); } catch(error) { reject(error); } });
      response.on('error',reject);
    });
    request.setTimeout(60000,() => request.destroy(new Error('AQA PDF download timed out.'))); request.on('error',reject);
  });
}
async function main() {
  await fs.mkdir(root,{recursive:true}); let position = 0, cached = 0, downloaded = 0; const failures = [];
  async function worker() {
    while (position < catalog.documents.length) {
      const document = catalog.documents[position++], destination = path.join(root,document.filename);
      try { verifyBytes(document,await fs.readFile(destination)); cached++; continue; } catch { /* Replace missing or corrupt generated assets. */ }
      try { const content = await download(document); await fs.writeFile(`${destination}.download`,content); await fs.rename(`${destination}.download`,destination); downloaded++; console.log(`Verified ${document.filename}`); }
      catch(error) { failures.push(error.message); await fs.rm(`${destination}.download`,{force:true}); }
    }
  }
  await Promise.all(Array.from({length:6},worker));
  console.log(`${cached} cached, ${downloaded} downloaded, ${failures.length} failed; ${catalog.documents.length} required.`);
  if (failures.length) throw new Error(failures.join('\n'));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
