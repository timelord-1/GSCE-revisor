const test=require('node:test');const assert=require('node:assert/strict');const deck=require('../src/deck.js');
test('24 topics assigned to the correct six papers with unique stable cards',()=>{
 assert.equal(deck.topics.length,24);assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
 for(const [subject,counts] of [['Biology',[4,3]],['Chemistry',[5,5]],['Physics',[4,3]]]){
  for(let paper=1;paper<=2;paper++)assert.equal(deck.topics.filter(t=>t.subject===subject&&t.paper===paper).length,counts[paper-1]);
 }
 for(const c of deck.cards){assert.ok(deck.topics.some(t=>t.id===c.topic));assert.ok(c.question.length>10);assert.ok(c.answer.length>=1);assert.ok(c.answer.every(a=>a.trim().length>0));assert.ok(['all','higher'].includes(c.tier));}
});
test('all topics have useful content and Higher cards are labelled',()=>{
 for(const t of deck.topics)assert.ok(deck.cards.filter(c=>c.topic===t.id).length>=10,t.name);
 for(const term of ['Fleming','momentum','glucagon','Le Chatelier','bond energies','motor effect']) {
  const matches=deck.cards.filter(c=>c.question.toLowerCase().includes(term.toLowerCase()));assert.ok(matches.length,term);assert.ok(matches.every(c=>c.tier==='higher'),term);
 }
});
test('separate-science question topics are excluded',()=>{
 const questions=deck.cards.map(c=>c.question).join('\n');
 for(const term of ['space physics','titration','monoclonal','Haber process','nanoparticle','transition metal','nuclear fission','nuclear fusion','plant hormone','specific latent heat of pressure','transformer equation','generator effect','moment of a force'])assert.ok(!questions.toLowerCase().includes(term.toLowerCase()),term);
});
test('practical coverage spans all required practical activity areas',()=>{
 const practical=deck.cards.filter(c=>c.kind==='practical').map(c=>c.question).join(' ');
 for(const term of ['onion','osmosis','food','amylase','photosynthesis','reaction time','quadrats','soluble salt','electrolysis','temperature changes','reaction rate','chromatography','water sample','specific heat capacity','resistance','I–V','density','extension','acceleration','ripple tank','infrared'])assert.ok(practical.includes(term),term);
});
test('circuit-symbol cards have existing local SVG diagrams without active content',()=>{
 const fs=require('fs');const path=require('path');
 const diagrams=deck.cards.filter(c=>c.questionImage);assert.equal(diagrams.length,14);
 for(const c of diagrams){
  assert.equal(c.topic,'6.2');assert.equal(c.tier,'all');assert.ok(c.imageAlt.length>15);
  assert.match(c.questionImage,/^assets\/circuits\/[a-z-]+\.svg$/);
  const svg=fs.readFileSync(path.join(__dirname,'../src',c.questionImage),'utf8');
  assert.ok(svg.startsWith('<svg'));assert.ok(!/<script|onload|https?:\/\/(?!www.w3.org\/2000\/svg)/.test(svg));
 }
});
