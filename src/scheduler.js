/* Anki-inspired SM-2 scheduling; intentionally not a reimplementation of Anki/FSRS. */
(function (root) {
  const MINUTE = 60000, DAY = 86400000;
  function initial() { return { phase: 'new', step: 0, interval: 0, ease: 2.5, due: 0, reviews: 0, lapses: 0 }; }
  function schedule(previous, rating, now = Date.now()) {
    if (!['again', 'hard', 'good', 'easy'].includes(rating)) throw new Error('Unknown rating');
    const s = { ...initial(), ...previous };
    s.reviews += 1;
    let delay;
    if (s.phase !== 'review') {
      if (rating === 'again') { s.phase = 'learning'; s.step = 0; delay = MINUTE; }
      if (rating === 'hard') { s.phase = 'learning'; delay = s.step === 0 ? 6 * MINUTE : 10 * MINUTE; }
      if (rating === 'good') {
        if (s.step === 0) { s.phase = 'learning'; s.step = 1; delay = 10 * MINUTE; }
        else { s.phase = 'review'; s.interval = Math.max(1, s.interval); delay = s.interval * DAY; }
      }
      if (rating === 'easy') { s.phase = 'review'; s.interval = Math.max(4, Math.ceil(s.interval * 1.3)); delay = s.interval * DAY; }
    } else {
      if (rating === 'again') {
        s.lapses += 1; s.ease = Math.max(1.3, s.ease - 0.2);
        s.interval = Math.max(1, Math.round(s.interval * 0.5)); s.phase = 'learning'; s.step = 0; delay = MINUTE;
      } else {
        let multiplier;
        if (rating === 'hard') { s.ease = Math.max(1.3, s.ease - 0.15); multiplier = 1.2; }
        if (rating === 'good') multiplier = s.ease;
        if (rating === 'easy') { s.ease += 0.15; multiplier = s.ease * 1.3; }
        s.interval = Math.min(36500, Math.max(s.interval + 1, Math.round(s.interval * multiplier)));
        delay = s.interval * DAY;
      }
    }
    s.due = now + delay;
    return s;
  }
  function label(milliseconds) {
    if (milliseconds < 60 * MINUTE) return `${Math.max(1, Math.round(milliseconds / MINUTE))} min`;
    if (milliseconds < DAY) return `${Math.round(milliseconds / (60 * MINUTE))} hr`;
    const days = Math.round(milliseconds / DAY);
    return days === 1 ? '1 day' : `${days} days`;
  }
  function eligible(cards, states, now, newLimit = 20, introducedToday = 0) {
    const due = cards.filter(c => states[c.id] && states[c.id].due <= now)
      .sort((a, b) => states[a.id].due - states[b.id].due);
    const fresh = cards.filter(c => !states[c.id]).slice(0, Math.max(0, newLimit - introducedToday));
    return [...due, ...fresh];
  }
  function validateBackup(value, knownIds) {
    if (!value || value.format !== 'trilogy-revision' || value.version !== 1 || !value.progress || !Array.isArray(value.history)) throw new Error('This is not a Trilogy Revision backup.');
    const states = Object.create(null);
    for (const [id, s] of Object.entries(value.progress)) {
      if (!knownIds.has(id)) throw new Error(`Unknown card in backup: ${id}`);
      if (!s || !['learning', 'review'].includes(s.phase) || !Number.isFinite(s.due) || s.due < 0 ||
          !Number.isFinite(s.ease) || s.ease < 1.3 || s.ease > 100 ||
          !Number.isInteger(s.interval) || s.interval < 0 || s.interval > 36500 ||
          ![0, 1].includes(s.step) || !Number.isInteger(s.reviews) || s.reviews < 1 ||
          !Number.isInteger(s.lapses) || s.lapses < 0) throw new Error('Invalid scheduling data in backup.');
      states[id] = { phase: s.phase, due: s.due, ease: s.ease, interval: s.interval, step: s.step, reviews: s.reviews, lapses: s.lapses };
    }
    const history = value.history.map(h => {
      if (!h || !knownIds.has(h.id) || !['again', 'hard', 'good', 'easy'].includes(h.rating) ||
          !Number.isFinite(h.at) || h.at < 0 || typeof h.fresh !== 'boolean') throw new Error('Invalid review history in backup.');
      return { id: h.id, rating: h.rating, at: h.at, fresh: h.fresh };
    });
    return { progress: states, history };
  }
  const api = { MINUTE, DAY, initial, schedule, label, eligible, validateBackup };
  if (typeof module !== 'undefined') module.exports = api;
  else root.Scheduler = api;
})(typeof window !== 'undefined' ? window : globalThis);
