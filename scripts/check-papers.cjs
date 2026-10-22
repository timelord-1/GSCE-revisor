const fs=require('node:fs');const path=require('node:path');const {verifyBytes}=require('../src/paper-files.cjs');const catalog=require('../src/papers-data');
try { for(const document of catalog.documents) verifyBytes(document,fs.readFileSync(path.join(__dirname,'../src/assets/past-papers',document.filename))); console.log(`PASS: all ${catalog.documents.length} official PDFs match AQA's published hashes and sizes.`); }
catch(error) { console.error('Past papers are missing or invalid. Run npm run papers:download.\n'+error.message);process.exitCode=1; }
