const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const deck=require('../src/deck'),catalog=require('../src/papers-data'),Study=require('../src/study');
const report=require('../docs/application-expansion.json');
const cards=deck.cards.filter(c=>c.examSource?.qualification==='8464');
test('Combined-paper expansion adds distinct applications across all topics without changing earlier cards',()=>{
 assert.equal(cards.length,48);assert.equal(deck.cards.length,689);
 const previous=deck.cards.filter(c=>!cards.includes(c));assert.equal(previous.length,report.baselineCardCount);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(previous)).digest('hex'),report.baselineCardsSha256);
 assert.equal(new Set(cards.map(c=>c.question.toLowerCase())).size,48);
 assert.deepEqual(cards.map(c=>c.id),report.newCardIds);
 for(const card of cards){assert.equal(card.kind,'application');assert.ok(!previous.some(c=>c.question.toLowerCase()===card.question.toLowerCase()));assert.ok(card.answer.join(' ').split(/\s+/).length<=95);}
 for(const t of deck.topics)assert.ok(cards.some(c=>c.topic===t.id),t.id);
 for(const subject of ['Biology','Chemistry','Physics'])for(const paper of [1,2])assert.equal(cards.filter(c=>deck.topics.some(t=>t.id===c.topic&&t.subject===subject&&t.paper===paper)).length,8);
 for(const tier of ['foundation','higher']){const shown=Study.visible(deck.cards,{tier,studyMode:'application'});for(const card of cards)assert.equal(shown.some(c=>c.id===card.id),tier==='higher'||card.tier==='all');}
});
test('Every new source resolves to verified Combined PDFs and reviewed question/answer pages',()=>{
 assert.equal(report.totalFiles,72);assert.equal(report.totalPages,1915);assert.equal(report.failures,0);assert.equal(report.documents.length,72);
 assert.equal(report.batches.length,3);assert.ok(report.batches.every(b=>b.documents.length===4&&b.cards.length===16));
 assert.equal(report.documents.filter(d=>d.reviewStatus==='reviewed-selected-questions').length,12);
 for(const d of catalog.documents){const r=report.documents.find(r=>r.id===d.id);assert.ok(r,d.id);assert.equal(r.sha1,d.sha1);assert.equal(r.bytes,d.bytes);assert.equal(r.status,'verified');assert.equal(r.renderedPages,r.pages);assert.ok(r.textCharacters>0);assert.match(r.sha256,/^[0-9a-f]{64}$/);}
 for(const card of cards){const s=card.examSource,t=deck.topics.find(t=>t.id===card.topic);assert.match(s.question,/^\d{2}\.\d+$/);
  for(const [key,kind,pages] of [['questionPaperId','question',s.questionPages],['markSchemeId','mark-scheme',s.markSchemePages]]){const d=catalog.documents.find(d=>d.id===s[key]),r=report.documents.find(r=>r.id===s[key]);assert.ok(d);assert.equal(d.kind,kind);assert.equal(d.year,s.year);assert.equal(d.subject,t.subject);assert.equal(d.paper,t.paper);assert.equal(r.reviewStatus,'reviewed-selected-questions');assert.ok(r.questions.includes(s.question));assert.ok(pages.length);assert.ok(pages.every(p=>Number.isInteger(p)&&p>=1&&p<=r.pages));}
 }
 for(const id of ['b1-03-2','b2-06-4','c1-05-4','c1-05-5','c2-04-5','c2-05-6','c2-06-3','p2-03-5','p2-04-3'])assert.equal(cards.find(c=>c.id.endsWith(id)).tier,'higher',id);
});
