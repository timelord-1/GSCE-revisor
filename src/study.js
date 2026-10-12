'use strict';
const Study = (() => {
  function validateDecks(value, knownIds) {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.length > 100) throw new Error('Invalid custom deck list.');
    const ids = new Set();
    return value.map(deck => {
      if (!deck || typeof deck.id !== 'string' || !/^deck-[a-z0-9-]{1,80}$/.test(deck.id) || ids.has(deck.id)) throw new Error('Invalid custom deck ID.');
      ids.add(deck.id);
      if (typeof deck.name !== 'string' || !deck.name.trim() || deck.name.trim().length > 80) throw new Error('Custom deck names must contain 1–80 characters.');
      if (!Array.isArray(deck.cardIds) || !deck.cardIds.length || deck.cardIds.length > knownIds.size || deck.cardIds.some(id => !knownIds.has(id))) throw new Error('Custom deck contains unknown or missing cards.');
      return { id:deck.id, name:deck.name.trim(), cardIds:[...new Set(deck.cardIds)] };
    });
  }
  function visible(cards, settings) { return cards.filter(c => (settings.tier === 'higher' || c.tier !== 'higher') && (settings.applicationQuestions === true || c.kind !== 'application')); }
  return { validateDecks, visible };
})();
if (typeof module !== 'undefined') module.exports = Study;
