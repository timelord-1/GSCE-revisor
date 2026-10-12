const test=require('node:test');const assert=require('node:assert/strict');
const deck=require('../src/deck.js');const byId=new Map(deck.cards.map(c=>[c.id,c]));
test('every card cites valid audited sections and all subject sections are covered',()=>{
 const sections=new Map(deck.specification.sections.map(s=>[s.ref,s]));
 const allowed=new Set([...sections.keys(),...Array.from({length:21},(_,i)=>`10.2.${i+1}`)]);
 assert.equal(deck.specification.sections.length,225);
 assert.match(deck.specification.sourceSha256,/^[0-9a-f]{64}$/);
 for(const card of deck.cards){
  assert.ok(card.specRefs.length>0,card.id);
  assert.ok(card.specRefs.some(r=>r.startsWith(card.topic+'.')),card.id);
  for(const ref of card.specRefs)assert.ok(allowed.has(ref),`${card.id}: ${ref}`);
 }
 for(const section of sections.values()){
  const mapped=deck.cards.filter(c=>c.specRefs.includes(section.ref));assert.ok(mapped.length,section.ref);
  if(section.tierScope==='higher')assert.ok(mapped.every(c=>c.tier==='higher'),section.ref);
 }
});
test('all 21 required practicals have exact activity references',()=>{
 for(let n=1;n<=21;n++){
  const cards=deck.cards.filter(c=>c.practical===n);assert.ok(cards.length,`Practical ${n}`);
  assert.ok(cards.every(c=>c.kind==='practical'&&c.tier==='all'&&c.specRefs.includes(`10.2.${n}`)));
 }
 assert.ok(deck.cards.some(c=>c.practical===1&&c.question.includes('animal')));
 assert.ok(deck.cards.some(c=>c.practical===15&&c.question.includes('combinations')));
 assert.ok(deck.cards.some(c=>c.practical===4&&c.answer.join(' ').includes('30 seconds')));
});
test('mixed-section HT clauses do not leak into the corrected Foundation cards',()=>{
 for(const id of ['4.5-13','5.2-20','5.4-15','6.6-12'])assert.equal(byId.get(id).tier,'higher',id);
 assert.equal(byId.get('6.6-20').tier,'all','Gamma-ray production is not HT-only');
 const exclusions={
  '4.5-16':/oestrogen/i,
  '5.4-19':/gain electrons|lose electrons/i,
  '5.6-01':/mol\/s/i,
  '6.5-18':/circle|circular/i,
  '6.5-20':/area under|area between/i
 };
 for(const [id,pattern] of Object.entries(exclusions))assert.doesNotMatch(byId.get(id).answer.join(' '),pattern,id);
 const circular=deck.cards.filter(c=>c.question.includes('moving in a circle'));assert.ok(circular.length);assert.ok(circular.every(c=>c.tier==='higher'));
 const area=deck.cards.filter(c=>c.question.includes('graph to calculate displacement'));assert.ok(area.length);assert.ok(area.every(c=>c.tier==='higher'));
});
test('Combined transformer power balance is present without separate-science turns ratios or commutators',()=>{
 const cards=deck.cards.filter(c=>c.specRefs.includes('6.2.4.3')&&c.question.includes('transformer'));
 assert.ok(cards.some(c=>c.answer.join(' ').includes('VₚIₚ = VₛIₛ')));
 assert.ok(cards.filter(c=>c.question.includes('ideal transformer')).every(c=>c.tier==='higher'));
 assert.ok(cards.some(c=>c.answer.join(' ').includes('20 A')));
 const all=deck.cards.map(c=>c.question+' '+c.answer.join(' ')).join('\n');
 assert.doesNotMatch(all,/split[- ]ring|commutator|Nₚ\/Nₛ|turns[- ]ratio|nuclear fission|nuclear fusion|titration|monoclonal antibody|Haber process/i);
});
test('IDs from the released 500-card deck remain compatible with saved progress',()=>{
 const counts={'4.1':28,'4.2':28,'4.3':20,'4.4':20,'4.5':25,'4.6':31,'4.7':22,'5.1':21,'5.2':20,'5.3':15,'5.4':26,'5.5':12,'5.6':18,'5.7':12,'5.8':12,'5.9':16,'5.10':15,'6.1':20,'6.2':36,'6.3':14,'6.4':19,'6.5':35,'6.6':20,'6.7':15};
 for(const [topic,count] of Object.entries(counts))for(let n=1;n<=count;n++)assert.ok(byId.has(`${topic}-${String(n).padStart(2,'0')}`));
});
