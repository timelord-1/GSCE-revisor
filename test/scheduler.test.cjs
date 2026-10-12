const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../src/scheduler.js');
const now = 1700000000000;
test('new card learns at 10 minutes, then graduates after a successful recall', () => {
 const first=S.schedule(undefined,'good',now); assert.equal(first.phase,'learning');assert.equal(first.due,now+10*S.MINUTE);
 const second=S.schedule(first,'good',first.due);assert.equal(second.phase,'review');assert.equal(second.interval,1);assert.equal(second.reviews,2);
});
test('Again relearns rather than leaving forgotten cards at long intervals',()=>{
 const old={...S.initial(),phase:'review',interval:20,reviews:8};const failed=S.schedule(old,'again',now);
 assert.equal(failed.phase,'learning');assert.equal(failed.due,now+S.MINUTE);assert.equal(failed.lapses,1);assert.equal(failed.interval,10);assert.equal(failed.ease,2.3);
 const again=S.schedule(failed,'good',failed.due);assert.equal(again.due,failed.due+10*S.MINUTE);
 const graduate=S.schedule(again,'good',again.due);assert.equal(graduate.interval,10);assert.equal(graduate.phase,'review');
});
test('review rating gives increasing Hard, Good and Easy intervals',()=>{
 const old={...S.initial(),phase:'review',interval:10,reviews:5};
 const h=S.schedule(old,'hard',now),g=S.schedule(old,'good',now),e=S.schedule(old,'easy',now);
 assert.equal(h.interval,12);assert.equal(g.interval,25);assert.ok(e.interval>g.interval);assert.ok(h.ease<old.ease);assert.ok(e.ease>old.ease);
 assert.equal(old.interval,10);
});
test('ease has a floor even after many failed reviews',()=>{
 let x={...S.initial(),phase:'review',interval:2};
 for(let i=0;i<20;i++){x=S.schedule({...x,phase:'review'},'again',now);}
 assert.equal(x.ease,1.3);
});
test('due reviews precede new cards and the daily cap excludes future reviews',()=>{
 const cards=[{id:'new1'},{id:'future'},{id:'due'},{id:'new2'}];
 const states={future:{due:now+1},due:{due:now-1}};
 assert.deepEqual(S.eligible(cards,states,now,2,1).map(c=>c.id),['due','new1']);
 assert.deepEqual(S.eligible(cards,states,now,2,2).map(c=>c.id),['due']);
 assert.deepEqual(S.eligible(cards,states,now,0,0).map(c=>c.id),['due']);
});
test('backup round-trips and rejects corrupt, unknown and hostile scheduling data',()=>{
 const value={format:'trilogy-revision',version:1,progress:{a:S.schedule(null,'good',now)},history:[{id:'a',at:now,rating:'good',fresh:true}]};
 assert.deepEqual(S.validateBackup(value,new Set(['a'])).progress.a,value.progress.a);
 assert.throws(()=>S.validateBackup({...value,version:2},new Set(['a'])));
 assert.throws(()=>S.validateBackup(value,new Set(['b'])));
 assert.throws(()=>S.validateBackup({...value,progress:{a:{...value.progress.a,due:NaN}}},new Set(['a'])));
 assert.throws(()=>S.validateBackup({...value,history:[{id:'a',at:now,rating:'bad',fresh:true}]},new Set(['a'])));
});
test('invalid ratings cannot silently alter progress',()=>assert.throws(()=>S.schedule(null,'invalid',now)));
