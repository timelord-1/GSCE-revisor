'use strict';
const Study = (() => {
  const MODES = ['core','all','application'];
  function mode(settings = {}) { return MODES.includes(settings.studyMode) ? settings.studyMode : settings.applicationQuestions === true ? 'all' : 'core'; }
  function dayKey(timestamp) { const d = new Date(timestamp); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
  function validatePlan(value) {
    if (value === undefined || value === null) return null;
    if (!value || !Array.isArray(value.weekdays) || !value.weekdays.length || value.weekdays.length > 7 || value.weekdays.some(n => !Number.isInteger(n) || n < 0 || n > 6) || new Set(value.weekdays).size !== value.weekdays.length) throw new Error('Choose at least one valid study day.');
    if (!Number.isInteger(value.newLimit) || value.newLimit < 0 || value.newLimit > 200 || !Number.isInteger(value.reviewLimit) || value.reviewLimit < 1 || value.reviewLimit > 1000) throw new Error('Plan limits: 0–200 new cards and 1–1000 reviews per day.');
    if (!validDate(value.startDate) || (value.targetDate && !validDate(value.targetDate)) || (value.targetDate && value.targetDate < value.startDate)) throw new Error('Choose valid dates; the target date cannot be before the start.');
    return { weekdays:[...value.weekdays],newLimit:value.newLimit,reviewLimit:value.reviewLimit,startDate:value.startDate,targetDate:value.targetDate || '' };
  }
  function validateDecks(value, knownIds) {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.length > 100) throw new Error('Invalid custom deck list.');
    const ids = new Set();
    return value.map(deck => {
      if (!deck || typeof deck.id !== 'string' || !/^deck-[a-z0-9-]{1,80}$/.test(deck.id) || ids.has(deck.id)) throw new Error('Invalid custom deck ID.');
      ids.add(deck.id);
      if (typeof deck.name !== 'string' || !deck.name.trim() || deck.name.trim().length > 80) throw new Error('Custom deck names must contain 1–80 characters.');
      if (!Array.isArray(deck.cardIds) || !deck.cardIds.length || deck.cardIds.length > knownIds.size || deck.cardIds.some(id => !knownIds.has(id))) throw new Error('Custom deck contains unknown or missing cards.');
      const result = { id:deck.id,name:deck.name.trim(),cardIds:[...new Set(deck.cardIds)] };
      const plan = validatePlan(deck.plan); if (plan) result.plan = plan;
      return result;
    });
  }
  function cardFields(card) {
    if (!card || typeof card.question !== 'string' || !card.question.trim() || card.question.trim().length > 2000) throw new Error('Question must contain 1–2000 characters.');
    if (!Array.isArray(card.answer) || !card.answer.length || card.answer.length > 30 || card.answer.some(a => typeof a !== 'string' || !a.trim() || a.trim().length > 2000)) throw new Error('Add 1–30 answer points, at most 2000 characters each.');
    if (!['all','higher'].includes(card.tier) || !['recall','application','practical'].includes(card.kind)) throw new Error('Choose a valid tier and question type.');
    return {question:card.question.trim(),answer:card.answer.map(a => a.trim()),tier:card.tier,kind:card.kind};
  }
  function validateCards(custom = [], edits = {}, deck) {
    if (!Array.isArray(custom) || custom.length > 5000 || !edits || typeof edits !== 'object' || Array.isArray(edits)) throw new Error('Invalid personal card data.');
    const builtin = new Set(deck.cards.map(c => c.id)), knownIds = new Set(builtin), topics = new Set(deck.topics.map(t => t.id));
    const customCards = custom.map(c => {
      if (!c || typeof c.id !== 'string' || !/^custom-[a-z0-9-]{1,80}$/.test(c.id) || knownIds.has(c.id) || !topics.has(c.topic) || !['recall','application'].includes(c.kind)) throw new Error('Personal card has an invalid ID, topic or type.');
      knownIds.add(c.id);
      return {id:c.id,topic:c.topic,...cardFields(c),specRefs:[],userCreated:true};
    });
    const cardEdits = Object.create(null);
    for (const [id,edit] of Object.entries(edits)) {
      if (!builtin.has(id)) throw new Error('An edited card is not in the built-in library.');
      cardEdits[id] = cardFields(edit);
    }
    return {customCards,cardEdits,knownIds};
  }
  function resolveCards(deck, customCards = [], cardEdits = {}) { return [...deck.cards.map(c => cardEdits[c.id] ? {...c,...cardEdits[c.id],userEdited:true} : c),...customCards]; }
  function visible(cards, settings) { const kind = mode(settings); return cards.filter(c => (settings.tier === 'higher' || c.tier !== 'higher') && (kind === 'all' || (kind === 'application' ? c.kind === 'application' : c.kind !== 'application'))); }
  function allowance(deck, history, now, globalLimit, globalIntroduced) {
    const result = {allowed:true,newRemaining:Math.max(0,globalLimit-globalIntroduced),reviewsRemaining:Infinity,reviewsDone:0,freshDone:0,message:''};
    if (!deck?.plan) return result;
    const plan = deck.plan, ids = new Set(deck.cardIds), today = dayKey(now);
    const reviews = history.filter(h => ids.has(h.id) && dayKey(h.at) === today);
    result.reviewsDone = reviews.length; result.freshDone = reviews.filter(h => h.fresh).length;
    result.newRemaining = Math.min(result.newRemaining,Math.max(0,plan.newLimit-result.freshDone));
    result.reviewsRemaining = Math.max(0,plan.reviewLimit-result.reviewsDone);
    if (today < plan.startDate) { result.allowed = false; result.message = `This plan starts on ${plan.startDate}.`; }
    else if (!plan.weekdays.includes(new Date(now).getDay())) { result.allowed = false; result.message = 'Today is not a selected study day.'; }
    else if (!result.reviewsRemaining) { result.allowed = false; result.message = 'Daily review limit reached.'; }
    if (!result.allowed) result.newRemaining = 0;
    return result;
  }
  return {mode,dayKey,validatePlan,validateDecks,validateCards,resolveCards,visible,allowance};
})();
if (typeof module !== 'undefined') module.exports = Study;
