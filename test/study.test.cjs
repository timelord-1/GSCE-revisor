const test=require('node:test'),assert=require('node:assert/strict'),Study=require('../src/study'),deck=require('../src/deck');
const known=new Set(deck.cards.map(c=>c.id));
test('custom decks round-trip with stable card IDs; legacy backups remain supported',()=>{
 assert.deepEqual(Study.validateDecks(undefined,known),[]);
 const value=[{id:'deck-test',name:' Mixed ',cardIds:['4.1-01','6.2-01','4.1-01']}];
 const valid=Study.validateDecks(value,known);assert.deepEqual(valid[0],{id:'deck-test',name:'Mixed',cardIds:['4.1-01','6.2-01']});
 assert.deepEqual(Study.validateDecks(JSON.parse(JSON.stringify(valid)),known),valid);
 for(const change of [{name:''},{name:'a'.repeat(81)},{cardIds:[]},{cardIds:['unknown']},{id:'<script>'}])assert.throws(()=>Study.validateDecks([{...value[0],...change}],known));
 assert.throws(()=>Study.validateDecks([value[0],value[0]],known));
});
test('application opt-in and tier filters combine without altering source cards',()=>{
 const cards=[{id:'a',tier:'all',kind:'recall'},{id:'b',tier:'higher',kind:'recall'},{id:'c',tier:'all',kind:'application'},{id:'d',tier:'higher',kind:'application'}];
 assert.deepEqual(Study.visible(cards,{tier:'foundation'}).map(c=>c.id),['a']);
 assert.deepEqual(Study.visible(cards,{tier:'higher'}).map(c=>c.id),['a','b']);
 assert.deepEqual(Study.visible(cards,{tier:'foundation',applicationQuestions:true}).map(c=>c.id),['a','c']);
 assert.equal(Study.visible(cards,{tier:'higher',applicationQuestions:true}).length,4);assert.equal(cards.length,4);
});
test('new application scenarios cite Combined content and analysed exam questions',()=>{
 const manifest=require('../docs/pdf-analysis.json');assert.equal(manifest.length,25);assert.equal(manifest.reduce((s,f)=>s+f.pages,0),952);
 assert.ok(manifest.every(f=>f.accessible&&f.analysis==='analysed-text-and-context'&&f.pageStatus.every(p=>p.rendered)));
 const cards=deck.cards.filter(c=>c.examSource);assert.equal(cards.length,24);
 for(const card of cards){assert.equal(card.kind,'application');assert.ok(manifest.some(f=>f.path.includes(card.examSource.paper)&&f.path.includes(`JUN${String(card.examSource.year).slice(-2)}`)));}
});
