const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
function verifyBytes(document, bytes) {
  if (bytes.length !== document.bytes || bytes.subarray(0,5).toString() !== '%PDF-' || !bytes.subarray(-4096).includes(Buffer.from('%%EOF')) || crypto.createHash('sha1').update(bytes).digest('hex') !== document.sha1) throw new Error(`PDF verification failed: ${document.filename}`);
  return bytes;
}
function createPaperStore({root,cacheRoot,catalog}) {
  const documents = new Map(catalog.documents.map(d => [d.id,d]));
  function get(id) {
    const document = typeof id === 'string' && documents.get(id);
    if (!document || !/^AQA-8464[BCP][12][FH]-(QP|MS)-JUN\d{2}\.PDF$/.test(document.filename)) throw new Error('Unknown past paper.');
    return document;
  }
  async function bytes(id) { const document = get(id); return verifyBytes(document,await fs.readFile(path.join(root,document.filename))); }
  async function prepare(id) {
    const document = get(id), destination = path.join(cacheRoot,document.filename);
    try { verifyBytes(document,await fs.readFile(destination)); return destination; } catch(error) { if (error.code !== 'ENOENT' && error.code && error.code !== 'EISDIR') throw error; }
    const content = await bytes(id); await fs.mkdir(cacheRoot,{recursive:true});
    const temporary = `${destination}.${crypto.randomUUID()}.tmp`;
    try { await fs.writeFile(temporary,content,{flag:'wx'}); await fs.rename(temporary,destination); }
    finally { await fs.rm(temporary,{force:true}); }
    return destination;
  }
  async function saveTo(id,destination) { await fs.writeFile(destination,await bytes(id)); }
  return {get,bytes,prepare,saveTo};
}
module.exports = {verifyBytes,createPaperStore};
