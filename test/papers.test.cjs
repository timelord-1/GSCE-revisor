const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const catalog=require('../src/papers-data'),{verifyBytes,createPaperStore}=require('../src/paper-files.cjs');
test('official catalog contains complete question/mark-scheme pairs for all six papers, both tiers and three years',()=>{
 assert.equal(catalog.qualification,'8464');assert.equal(catalog.documents.length,72);assert.equal(new Set(catalog.documents.map(d=>d.id)).size,72);
 for(const subject of ['Biology','Chemistry','Physics'])for(const paper of [1,2])for(const tier of ['foundation','higher'])for(const year of [2023,2024,2025]) {
  const pair=catalog.documents.filter(d=>d.subject===subject&&d.paper===paper&&d.tier===tier&&d.year===year);
  assert.equal(pair.length,2);assert.deepEqual(pair.map(d=>d.kind).sort(),['mark-scheme','question']);
  for(const d of pair) {assert.match(d.filename,/^AQA-8464[BCP][12][FH]-(QP|MS)-JUN(23|24|25)\.PDF$/);assert.equal(d.url,`https://cdn.sanity.io/files/p28bar15/green/${d.sha1}.pdf`);assert.match(d.sha1,/^[a-f0-9]{40}$/);assert.ok(d.bytes>10000);assert.ok(d.sourceTitle.includes(subject));}
 }
});
test('offline PDF store rejects arbitrary paths and tampering, repairs corrupt cache and saves exact bytes',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'trilogy-papers-test-'));const root=path.join(directory,'bundled'),cacheRoot=path.join(directory,'cache');await fs.mkdir(root);
 const bytes=Buffer.from('%PDF-1.4\nunit test content\n%%EOF\n'),document={id:'known',filename:'AQA-8464B1H-QP-JUN25.PDF',bytes:bytes.length,sha1:crypto.createHash('sha1').update(bytes).digest('hex')};
 const store=createPaperStore({root,cacheRoot,catalog:{documents:[document]}});
 try {
  for(const id of ['../../outside.pdf','file:///etc/passwd',null,{},'unknown'])assert.throws(()=>store.get(id));
  assert.throws(()=>verifyBytes(document,Buffer.from('not a PDF')));
  await fs.writeFile(path.join(root,document.filename),bytes);const file=await store.prepare('known');assert.deepEqual(await fs.readFile(file),bytes);
  await fs.writeFile(file,'corrupt cache');assert.equal(await store.prepare('known'),file);assert.deepEqual(await fs.readFile(file),bytes);
  const exported=path.join(directory,'saved.pdf');await store.saveTo('known',exported);assert.deepEqual(await fs.readFile(exported),bytes);
  await fs.writeFile(path.join(root,document.filename),Buffer.alloc(bytes.length));await assert.rejects(()=>store.bytes('known'),/verification failed/);
  await fs.rm(file);await assert.rejects(()=>store.prepare('known'),/verification failed/);await assert.rejects(()=>fs.stat(file),/ENOENT/);
 }finally{await fs.rm(directory,{recursive:true,force:true});}
});
