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
 const cards=deck.cards.filter(c=>c.examSource?.qualification==='8461'||c.examSource?.qualification==='8462'||c.examSource?.qualification==='8463');assert.equal(cards.length,24);
 for(const card of cards){assert.equal(card.kind,'application');assert.ok(manifest.some(f=>f.path.includes(card.examSource.paper)&&f.path.includes(`JUN${String(card.examSource.year).slice(-2)}`)));}
});
test('application-only mode excludes every core/practical card and migrates legacy settings',()=>{
 assert.equal(Study.mode({applicationQuestions:true}),'all');assert.equal(Study.mode({applicationQuestions:false}),'core');
 for(const tier of ['higher','foundation']) {
  const cards=Study.visible(deck.cards,{tier,studyMode:'application'});assert.ok(cards.length);assert.ok(cards.every(c=>c.kind==='application'));
  if(tier==='foundation')assert.ok(cards.every(c=>c.tier!=='higher'));
 }
});
test('personal cards and edits validate, round-trip, and never mutate the built-in library',()=>{
 const original=JSON.stringify(deck);const card={id:'custom-test',topic:'4.1',question:' My own question? ',answer:[' Point one '],tier:'all',kind:'application'};
 const fields={question:'Personal edit?',answer:['An edited answer.'],tier:'all',kind:'recall'};
 const valid=Study.validateCards([card],{'4.1-01':fields},deck);
 assert.ok(valid.knownIds.has('custom-test'));assert.equal(valid.customCards[0].question,'My own question?');
 const pool=Study.resolveCards(deck,valid.customCards,valid.cardEdits);assert.equal(pool[0].question,'Personal edit?');assert.ok(pool[0].userEdited);assert.ok(pool.at(-1).userCreated);assert.equal(JSON.stringify(deck),original);
 const restored=Study.validateCards(JSON.parse(JSON.stringify(valid.customCards)),JSON.parse(JSON.stringify(valid.cardEdits)),deck);assert.deepEqual(restored.customCards,valid.customCards);
 for(const bad of [{id:'4.1-01'},{id:'__proto__'},{topic:'triple'},{answer:[]},{question:''},{kind:'practical'},{tier:'invalid'},{question:'x'.repeat(2001)}])assert.throws(()=>Study.validateCards([{...card,...bad}],{},deck));
 assert.throws(()=>Study.validateCards([card,card],{},deck));assert.throws(()=>Study.validateCards([],{unknown:fields},deck));
 const scheduler=require('../src/scheduler');const progress={'custom-test':scheduler.schedule(null,'good',1000)};
 assert.deepEqual(scheduler.validateBackup({format:'trilogy-revision',version:1,progress,history:[]},valid.knownIds).progress['custom-test'],progress['custom-test']);
});
test('plan limits share history across selections, honour local study dates, and retain goals after target dates',()=>{
 const now=new Date(2026,9,13,12).getTime(),today=Study.dayKey(now),day=new Date(now).getDay();
 const plan={weekdays:[day],newLimit:3,reviewLimit:5,startDate:today,targetDate:today};
 const custom={id:'deck-plan',name:'Plan',cardIds:['4.1-01','6.2-01'],plan};
 assert.deepEqual(Study.validateDecks([custom],known)[0],custom);
 const history=[{id:'4.1-01',at:now,fresh:true},{id:'4.1-01',at:now,fresh:false},{id:'unrelated',at:now,fresh:true},{id:'6.2-01',at:now-86400000,fresh:true}];
 const status=Study.allowance(custom,history,now,20,2);assert.equal(status.reviewsDone,2);assert.equal(status.freshDone,1);assert.equal(status.newRemaining,2);assert.equal(status.reviewsRemaining,3);
 assert.equal(Study.allowance(custom,history,now,2,2).newRemaining,0);
 assert.equal(Study.allowance({...custom,plan:{...plan,reviewLimit:2}},history,now,20,2).allowed,false);
 assert.equal(Study.allowance({...custom,plan:{...plan,weekdays:[(day+1)%7]}},history,now,20,2).allowed,false);
 assert.equal(Study.allowance({...custom,plan:{...plan,startDate:'2026-10-14',targetDate:''}},history,now,20,2).allowed,false);
 assert.equal(Study.allowance({...custom,plan:{...plan,startDate:'2026-10-10',targetDate:'2026-10-11'}},history,now,20,2).allowed,true);
 for(const bad of [{weekdays:[]},{weekdays:[7]},{weekdays:[day,day]},{newLimit:-1},{reviewLimit:0},{startDate:'2026-02-30'},{targetDate:'2026-10-01'}])assert.throws(()=>Study.validatePlan({...plan,...bad}));
});
