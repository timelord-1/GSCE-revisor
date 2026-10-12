'use strict';
const $ = selector => document.querySelector(selector);
const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const KEY = 'trilogy-revision-v1';
const knownIds = new Set(DECK.cards.map(c => c.id));
const subjects = {
  Biology: { symbol:'♧', color:'#216653', pale:'#e6eee8' },
  Chemistry: { symbol:'⚗', color:'#8b6637', pale:'#f2ecdf' },
  Physics: { symbol:'↯', color:'#456987', pale:'#e8eef5' }
};
let state = { progress: {}, history: [], settings: { tier:'higher', newLimit:20, applicationQuestions:false }, customDecks:[] };
let loadError = false;
try {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    const valid = Scheduler.validateBackup({ ...parsed, format:'trilogy-revision', version:1 }, knownIds);
    state = { ...valid, customDecks:Study.validateDecks(parsed.customDecks, knownIds), settings: {
      tier: parsed.settings?.tier === 'foundation' ? 'foundation' : 'higher',
      applicationQuestions: parsed.settings?.applicationQuestions === true,
      newLimit: Number.isInteger(parsed.settings?.newLimit) && parsed.settings.newLimit >= 0 && parsed.settings.newLimit <= 200 ? parsed.settings.newLimit : 20
    } };
  }
} catch { loadError = true; }
let subject = 'Biology', paper = 1, selectedTopic = null, session = null, current = null, revealed = false, undo = null;
let selectedCustom = null;
function customDeck() { return state.customDecks.find(d => d.id === selectedCustom); }
let toastTimer;
function notify(message) { $('#toast').textContent = message; $('#toast').style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').style.display = 'none', 5500); }
function save() {
  if (loadError) { notify('Stored progress could not be read. Export a backup of this session before closing; storage has not been overwritten.'); return; }
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { notify('Progress could not be saved. Export a backup before closing the app.'); }
}
function dateKey(timestamp) { const d = new Date(timestamp); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function todayHistory() { const today = dateKey(Date.now()); return state.history.filter(h => dateKey(h.at) === today); }
function introducedToday() { return todayHistory().filter(h => h.fresh).length; }
function tierCards(cards) { return Study.visible(cards, state.settings); }
function paperTopics() { if (customDeck()) { const cards = paperCards(); return DECK.topics.filter(t => cards.some(c => c.topic === t.id)); } return DECK.topics.filter(t => t.subject === subject && t.paper === paper); }
function paperCards() { if (customDeck()) { const ids = new Set(customDeck().cardIds); return tierCards(DECK.cards.filter(c => ids.has(c.id))); } const ids = new Set(paperTopics().map(t => t.id)); return tierCards(DECK.cards.filter(c => ids.has(c.topic))); }
function scopedCards() { return selectedTopic ? paperCards().filter(c => c.topic === selectedTopic) : paperCards(); }
function dueCount(cards) { return cards.filter(c => state.progress[c.id] && state.progress[c.id].due <= Date.now()).length; }
function freshCount(cards) { return cards.filter(c => !state.progress[c.id]).length; }
function startedCount(cards) { return cards.length - freshCount(cards); }
function availableCards() { return Scheduler.eligible(scopedCards(), state.progress, Date.now(), state.settings.newLimit, introducedToday()); }
function topicOf(card) { return DECK.topics.find(t => t.id === card.topic); }
function selectView(nextSubject, nextPaper, topic = null) {
  selectedCustom = null; subject = nextSubject; paper = nextPaper; selectedTopic = topic; session = null; current = null; undo = null; $('#search').value = ''; render();
}
function render() {
  $('#custom-nav').innerHTML = state.customDecks.map(d => `<button class="topic-link ${d.id === selectedCustom ? 'selected' : ''}" data-custom="${d.id}">${esc(d.name)}</button>`).join('');
  $('.paper-switch').hidden = Boolean(customDeck());
  document.documentElement.style.setProperty('--subject', subjects[subject].color);
  document.documentElement.style.setProperty('--subject-pale', subjects[subject].pale);
  $('#tier').value = state.settings.tier;
  $('#subject-nav').innerHTML = Object.entries(subjects).map(([name, data]) => `<button class="subject-button ${name === subject && !customDeck() ? 'selected' : ''}" data-subject="${name}" aria-pressed="${name === subject && !customDeck()}"><span class="subject-symbol">${data.symbol}</span>${name}<span class="arrow">›</span></button>`).join('');
  $('#topic-nav').innerHTML = paperTopics().map(t => `<button class="topic-link ${t.id === selectedTopic ? 'selected' : ''}" data-topic="${t.id}" aria-pressed="${t.id === selectedTopic}"><span class="topic-dot"></span>${esc(t.name)}</button>`).join('');
  document.querySelectorAll('[data-paper]').forEach(button => { const active = Number(button.dataset.paper) === paper; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', active); });
  const topic = DECK.topics.find(t => t.id === selectedTopic);
  $('#breadcrumb').textContent = `${subject.toUpperCase()} / PAPER ${paper}${topic ? ` / ${topic.ref}` : ''}`;
  if (topic) $('#page-title').textContent = topic.name;
  else $('#page-title').innerHTML = 'A little every day.<br>A lot more remembered.';
  $('#page-subtitle').textContent = topic ? `AQA Trilogy · ${state.settings.tier === 'higher' ? 'Higher' : 'Foundation'} tier · ${scopedCards().length} flashcards` : `${subject}, Paper ${paper}. Build your confidence, one flashcard at a time.`;
  $('.edition strong').textContent = `0${Object.keys(subjects).indexOf(subject) * 2 + paper} / 06`;
  $('#paper-badge').textContent = `${subject.toUpperCase()} · PAPER ${paper}`;
  if (customDeck()) { $('#breadcrumb').textContent = 'CUSTOM STUDY'; $('#page-title').textContent = customDeck().name; $('#page-subtitle').textContent = `${scopedCards().length} cards · Shared progress · Current tier and Settings filters apply`; $('#paper-badge').textContent = 'CUSTOM DECK'; $('.edition strong').textContent = 'YOUR MIX'; }
  updateStats(); renderStudy(); renderBrowse();
}
function updateStats() {
  const cards = scopedCards();
  $('#due-stat').textContent = dueCount(cards);
  $('#new-stat').textContent = freshCount(cards);
  $('#today-stat').textContent = todayHistory().length;
  $('#coverage-stat').textContent = cards.length ? `${Math.round(startedCount(cards) / cards.length * 100)}%` : '0%';
}
function renderStudy() {
  const panel = $('#study-panel');
  if (session && current) { renderCard(); return; }
  if (session) { renderComplete(); return; }
  const cards = scopedCards(), eligible = availableCards();
  panel.innerHTML = `<div class="study-intro"><div class="copy"><span class="pill">✧ SMARTER SPACED REPETITION</span><h2>${eligible.length ? 'Ready for your next small win?' : 'Make a little time for science.'}</h2><p>Recall the answer, then rate how well you remembered it. The cards you find difficult return sooner; the ones you know get more space.</p><button class="primary" id="start-review">Review ${selectedTopic ? 'topic' : customDeck() ? 'deck' : 'paper'} <span>→</span></button><button class="secondary" id="start-practice">Practice all</button><p class="keyboard-hint">${dueCount(cards)} due · ${Math.min(freshCount(cards), Math.max(0, state.settings.newLimit - introducedToday()))} new available today · ${state.settings.newLimit} new cards/day across all subjects</p></div><div class="study-art" aria-hidden="true"><div class="mini-card back"></div><div class="mini-card front">${subjects[subject].symbol}<small>YOU'VE GOT THIS</small></div></div></div>`;
  $('#start-review').addEventListener('click', () => startSession('review'));
  $('#start-practice').addEventListener('click', () => startSession('practice'));
}
function startSession(mode) {
  session = { mode, answered:0, practiceCards: mode === 'practice' ? [...scopedCards()] : [], position:0 };
  undo = null; pickNext();
  $('#study-panel').scrollIntoView({ behavior:'auto', block:'start' });
}
function pickNext() {
  revealed = false;
  current = session.mode === 'practice' ? session.practiceCards[session.position] : availableCards()[0];
  renderStudy(); updateStats(); renderBrowse();
}
function renderCard() {
  const topic = topicOf(current), progress = state.progress[current.id];
  const phase = progress?.phase || 'new';
  const isPractice = session.mode === 'practice';
  $('#study-panel').innerHTML = `<div class="review-shell"><div class="review-top"><button id="end-session">← Back to topics</button><span class="review-counter">${isPractice ? `Practice · ${session.position + 1} / ${session.practiceCards.length}` : `${session.answered} reviewed · ${phase === 'new' ? 'New card' : phase === 'learning' ? 'Learning' : 'Due review'}`}</span><button id="undo-review" ${undo && !isPractice ? '' : 'disabled'}>Undo last rating</button></div><div class="question-card"><div class="question-meta"><span>${esc(topic.name)} · AQA ${current.specRefs.join(' / ')}</span>${current.kind === 'application' ? '<span class="tag">Application</span>' : ''}${current.tier === 'higher' ? '<span class="tag">Higher only</span>' : ''}${current.kind === 'practical' ? `<span class="tag">Required practical ${current.practical}</span>` : ''}${isPractice ? '<span class="tag">No scheduling changes</span>' : ''}</div><h2 id="card-question">${esc(current.question)}</h2>${current.questionImage ? `<img class="circuit-diagram" src="${esc(current.questionImage)}" alt="${esc(current.imageAlt)}">` : ''}${revealed ? `<div class="answer" id="card-answer"><div class="answer-heading">KEY MARKING POINTS</div><ul>${current.answer.map(a => `<li>${esc(a)}</li>`).join('')}</ul><p class="answer-note">Use the points that answer the question. Include units and working for calculations; exact exam marks depend on the question.</p></div>` : ''}</div><div class="review-controls">${!revealed ? '<button class="primary" id="show-answer">Show answer <span>↓</span></button><p class="keyboard-hint">Try to recall it first · Press Space to reveal</p>' : isPractice ? '<button class="primary" id="next-practice">Next card →</button><p class="keyboard-hint">Practice does not change review intervals · Press Space to continue</p>' : `<div class="ratings">${['again','hard','good','easy'].map((rating, i) => { const next = Scheduler.schedule(progress, rating); return `<button class="rating" data-rating="${rating}">${rating[0].toUpperCase()+rating.slice(1)}<small>${Scheduler.label(next.due - Date.now())} · ${i+1}</small></button>`; }).join('')}</div><p class="keyboard-hint">Space: Good & next · Again: forgot · Hard: recalled with difficulty · Good: recalled correctly · Easy: effortless</p>`}</div></div>`;
  $('#end-session').addEventListener('click', () => { session = null; current = null; renderStudy(); });
  $('#undo-review').addEventListener('click', undoRating);
  if (!revealed) $('#show-answer').addEventListener('click', reveal);
  else if (isPractice) $('#next-practice').addEventListener('click', nextPractice);
  else document.querySelectorAll('[data-rating]').forEach(button => button.addEventListener('click', () => rate(button.dataset.rating)));
}
function reveal() { if (current) { revealed = true; renderCard(); } }
function nextPractice() { if (!session || !revealed) return; session.position++; session.answered++; pickNext(); }
function rate(rating) {
  if (!session || session.mode !== 'review' || !current || !revealed) return;
  const card = current, previous = state.progress[card.id];
  undo = { card, previous: previous ? { ...previous } : null, historyLength: state.history.length, answered:session.answered };
  const now = Date.now();
  state.progress[card.id] = Scheduler.schedule(previous, rating, now);
  state.history.push({ id:card.id, rating, at:now, fresh:!previous });
  session.answered++; save(); pickNext();
}
function undoRating() {
  if (!undo || !session || session.mode !== 'review') return;
  if (undo.previous) state.progress[undo.card.id] = undo.previous;
  else delete state.progress[undo.card.id];
  state.history.length = undo.historyLength; session.answered = undo.answered;
  current = undo.card; revealed = true; undo = null; save(); renderStudy(); updateStats(); renderBrowse();
  notify('Last rating undone.');
}
function renderComplete() {
  const isPractice = session.mode === 'practice';
  const remaining = scopedCards().filter(c => state.progress[c.id]?.due > Date.now());
  const nextDue = remaining.length ? Math.min(...remaining.map(c => state.progress[c.id].due)) : null;
  const text = isPractice ? 'You have worked through every card in this selection. Your review schedule is unchanged.' :
    `You reviewed ${session.answered} ${session.answered === 1 ? 'card' : 'cards'} this session. ${nextDue ? `The next scheduled card in this selection returns in ${Scheduler.label(nextDue - Date.now())}.` : ''} ${freshCount(scopedCards()) && introducedToday() >= state.settings.newLimit ? 'Your daily new-card limit has been reached; practice is still available.' : ''}`;
  $('#study-panel').innerHTML = `<div class="empty"><div class="empty-symbol">✓</div><h2>${isPractice ? 'Practice complete.' : 'Caught up for now.'}</h2><p>${esc(text)}</p><button class="primary" id="finish-session">Back to topics</button><button class="secondary" id="continue-practice">Practice all cards</button>${!isPractice ? `<button class="secondary" id="check-due">Check due cards</button><button class="secondary" id="undo-review" ${undo ? '' : 'disabled'}>Undo last rating</button>` : ''}</div>`;
  $('#finish-session').addEventListener('click', () => { session = null; renderStudy(); });
  $('#continue-practice').addEventListener('click', () => startSession('practice'));
  if (!isPractice) { $('#check-due').addEventListener('click', pickNext); $('#undo-review').addEventListener('click', undoRating); }
}
function renderBrowse() {
  const search = $('#search').value.trim().toLowerCase();
  const topics = paperTopics().filter(t => !search || t.name.toLowerCase().includes(search));
  $('#topic-grid').innerHTML = topics.map(t => {
    const cards = paperCards().filter(c => c.topic === t.id);
    const started = startedCount(cards), percent = cards.length ? Math.round(started/cards.length*100) : 0;
    return `<button class="topic-card" data-topic="${t.id}"><div class="topic-card-top"><span class="topic-number">${t.ref.split('.')[1].padStart(2,'0')}</span><span class="topic-ref">AQA ${t.ref} <span>↗</span></span></div><h3>${esc(t.name)}</h3><div class="topic-meta"><span>${cards.length} cards</span><span class="due">${dueCount(cards)} due</span><span>${cards.filter(c => c.kind === 'practical').length} practical cards</span></div><div class="progress-line"><progress max="100" value="${percent}" aria-label="${esc(t.name)} cards introduced"></progress></div><div class="progress-text"><span>${started} / ${cards.length} introduced</span><span>${percent}%</span></div></button>`;
  }).join('');
  $('#topics-subtitle').textContent = `${customDeck() ? 'Custom deck' : `Paper ${paper}`} · ${state.settings.tier === 'higher' ? 'Higher includes Foundation content' : 'Foundation content only'}`;
  $('#search-results').innerHTML = '';
  if (search) {
    const matches = paperCards().filter(c => `${c.question} ${c.imageAlt || ''} ${c.answer.join(' ')}`.toLowerCase().includes(search));
    $('#search-results').innerHTML = `<p class="progress-count">${matches.length} matching flashcards in this ${customDeck() ? 'deck' : 'paper'}</p>${matches.slice(0,100).map(c => `<button class="search-card" data-card="${c.id}">${esc(c.question)}<small>${esc(topicOf(c).name)}${c.tier === 'higher' ? ' · Higher only' : ''}</small></button>`).join('')}${matches.length > 100 ? '<p>Showing the first 100 matches. Refine your search to see more.</p>' : ''}`;
  }
}
function openDialog(html) { $('#dialog-body').innerHTML = html; if (!$('#dialog').open) $('#dialog').showModal(); }
function showScope() {
  openDialog(`<span class="pill">AQA TRILOGY · 8464</span><h2>Focused on Combined Science.</h2><p>${DECK.cards.length} original cards across 24 topics, organised into Biology, Chemistry and Physics, then Paper 1 and Paper 2. Higher-only cards are hidden in Foundation mode.</p><h3>What belongs here</h3><p>Biology Paper 1: 4.1–4.4; Paper 2: 4.5–4.7.<br>Chemistry Paper 1: 5.1–5.5; Paper 2: 5.6–5.10.<br>Physics Paper 1: 6.1–6.4; Paper 2: 6.5–6.7.</p><h3>No separate-science extras</h3><p>No space physics, monoclonal antibodies, plant hormones, detailed eye/brain topics, titrations, transition-metal properties, nanoparticle properties, fuel cells, separate organic reaction topics, moments, pressure calculations, generators or transformer turns-ratio calculations.</p><h3>Use it alongside your course</h3><p>Answers are independently authored, concise marking points, not official AQA mark schemes. This is a revision deck, not a replacement for the specification, worked exam papers or supervised practical work. A flashcard cannot guarantee a particular mark.</p><p class="notice">Audited against the full specification embedded in your saved AQA webpage on ${DECK.specification.auditedOn}. Each card cites precise sections; all ${DECK.specification.sections.length} subject-content sections have mapped cards, and all 21 required practical activities are represented. Also checked against the supplied 8464 specification PDF. All 25 reference PDFs were extracted; separate-science-only material was excluded. One copyright photograph was absent from the source Biology paper and was not used. The Higher-tier transformer power equation is included because the supplied AQA specification requires it.</p><p>Official reference: AQA GCSE Combined Science: Trilogy, qualification 8464. The source snapshot, audit corrections, section-to-card map and recursive 25-PDF analysis record are documented in the repository. Cards follow the main paper/topic split; exam questions can also draw on underlying concepts and practical skills across topics.</p>`);
}
function showHelp() {
  openDialog(`<span class="pill">SCIENCE, MADE STICK.</span><h2>Your memory, on a schedule.</h2><p>Choose a subject, paper and topic. Try answering without looking; reveal the marking points, then honestly rate your recall.</p><ul><li><strong>Again:</strong> repeat after 1 minute.</li><li><strong>Hard:</strong> repeat sooner; difficulty lowers future growth.</li><li><strong>Good:</strong> new cards progress through a 10-minute learning step, then a 1-day review. Later reviews grow by the ease factor.</li><li><strong>Easy:</strong> a new card graduates to a 4-day review; later intervals grow more quickly.</li></ul><p>This is Anki-inspired SM-2 scheduling, not Anki or its FSRS algorithm. Due reviews come first. The default limit is 20 new cards per day across all subjects; change it in Settings.</p><h3>Keep control of your progress</h3><p>Practice all lets you revise without changing schedules. Undo reverses your last rating. Progress stays on this device; export a backup before reinstalling, moving computers or clearing browser storage.</p><p>Keyboard: Space reveals, then rates Good and advances; 1/2/3/4 rate Again/Hard/Good/Easy. In practice, Space advances after revealing.</p>`);
}
function showSettings() {
  openDialog(`<span class="pill">YOUR STUDY ROUTINE</span><h2>Settings & backups</h2><div class="settings-row"><label for="new-limit">New cards per day (all subjects)</label><input id="new-limit" type="number" min="0" max="200" value="${state.settings.newLimit}"><button class="primary" id="save-settings">Save</button></div><p>0 pauses new cards while keeping due reviews available. Existing intervals are unchanged.</p><label class="application-setting"><input id="application-questions" type="checkbox" ${state.settings.applicationQuestions ? 'checked' : ''}> Include application questions</label><p>Enable scenario, calculation and data questions in study and search. This option is controlled only here.</p><h3>Take your progress with you</h3><p>Backups include card schedules, review history, settings and custom decks. Import replaces the progress on this device after confirmation.</p><div class="backup-buttons"><button class="secondary" id="export-backup">Export backup</button><button class="secondary" id="import-backup">Import backup</button><input type="file" id="backup-file" accept="application/json,.json" class="hidden"></div><h3>Start over</h3><p>This permanently clears study progress on this device. Export a backup first.</p><button class="danger" id="reset-progress">Reset progress…</button>`);
  $('#save-settings').addEventListener('click', () => {
    const limit = Number($('#new-limit').value);
    if (!Number.isInteger(limit) || limit < 0 || limit > 200) { notify('Enter a whole number from 0 to 200.'); return; }
    state.settings.newLimit = limit; state.settings.applicationQuestions = $('#application-questions').checked; session = null; current = null; undo = null; save(); render(); notify('Study settings saved.');
  });
  $('#export-backup').addEventListener('click', () => {
    const data = { format:'trilogy-revision', version:1, exportedAt:new Date().toISOString(), ...state };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `trilogy-progress-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('#import-backup').addEventListener('click', () => $('#backup-file').click());
  $('#backup-file').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('Backup is too large (maximum 20 MB).');
      const data = JSON.parse(await file.text());
      const valid = Scheduler.validateBackup(data, knownIds);
      const customDecks = Study.validateDecks(data.customDecks, knownIds);
      const settings = { ...state.settings, applicationQuestions:data.settings?.applicationQuestions === true };
      if (data.settings?.tier === 'foundation' || data.settings?.tier === 'higher') settings.tier = data.settings.tier;
      if (Number.isInteger(data.settings?.newLimit) && data.settings.newLimit >= 0 && data.settings.newLimit <= 200) settings.newLimit = data.settings.newLimit;
      openDialog(`<h2>Replace your progress?</h2><p>This backup contains ${Object.keys(valid.progress).length} scheduled cards and ${valid.history.length} reviews. Your current progress will be replaced.</p><button class="primary" id="confirm-import">Import this backup</button>`);
      $('#confirm-import').addEventListener('click', () => { state = { ...valid, settings, customDecks }; selectedCustom = null; loadError = false; session = null; current = null; undo = null; save(); $('#dialog').close(); render(); notify('Progress restored from backup.'); });
    } catch (error) { notify(`Could not import: ${error.message}`); }
  });
  $('#reset-progress').addEventListener('click', () => {
    openDialog('<h2>Reset all study progress?</h2><p>Type RESET to confirm. This clears every schedule and review on this device.</p><div class="settings-row"><input id="reset-confirm" aria-label="Type RESET to confirm" type="text"><button class="danger" id="confirm-reset">Clear progress</button></div>');
    $('#confirm-reset').addEventListener('click', () => {
      if ($('#reset-confirm').value !== 'RESET') { notify('Type RESET to confirm.'); return; }
      state.progress = {}; state.history = []; loadError = false; session = null; current = null; undo = null; save(); $('#dialog').close(); render(); notify('Progress reset.');
    });
  });
}
$('#subject-nav').addEventListener('click', event => { const b = event.target.closest('[data-subject]'); if (b) selectView(b.dataset.subject, paper); });
document.querySelectorAll('[data-paper]').forEach(button => button.addEventListener('click', () => selectView(subject, Number(button.dataset.paper))));
function selectTopic(event) { const b = event.target.closest('[data-topic]'); if (!b) return; if (customDeck()) { selectedTopic = b.dataset.topic; session = null; current = null; undo = null; render(); } else selectView(subject, paper, b.dataset.topic); }
$('#topic-nav').addEventListener('click', selectTopic); $('#topic-grid').addEventListener('click', selectTopic);
$('#search').addEventListener('input', renderBrowse);
$('#search-results').addEventListener('click', event => {
  const b = event.target.closest('[data-card]'); if (!b) return;
  const c = DECK.cards.find(card => card.id === b.dataset.card);
  openDialog(`<span class="pill">${esc(topicOf(c).name)} · ${c.tier === 'higher' ? 'Higher only' : 'Both tiers'}</span><p class="source-reference">AQA ${c.specRefs.join(' / ')}</p><h2>${esc(c.question)}</h2>${c.questionImage ? `<img class="circuit-diagram" src="${esc(c.questionImage)}" alt="${esc(c.imageAlt)}">` : ''}<div class="browse-answer"><ul>${c.answer.map(a => `<li>${esc(a)}</li>`).join('')}</ul><p>Browsing an answer does not change its review schedule.</p></div>`);
});
$('#tier').addEventListener('change', () => { state.settings.tier = $('#tier').value; save(); session = null; current = null; undo = null; render(); });
$('#home').addEventListener('click', () => selectView(subject, paper));
$('#help').addEventListener('click', showHelp); $('#scope').addEventListener('click', showScope); $('#settings').addEventListener('click', showSettings);
$('#close-dialog').addEventListener('click', () => $('#dialog').close());
$('#dialog').addEventListener('click', event => { if (event.target === $('#dialog')) { const r = $('#dialog').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('#dialog').close(); } });
document.addEventListener('keydown', event => {
  if (event.repeat || $('#dialog').open || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName) || !session || !current) return;
  if (event.code === 'Space') { event.preventDefault(); if (!revealed) reveal(); else if (session.mode === 'practice') nextPractice(); else rate('good'); }
  if (revealed && session.mode === 'review' && /^[1-4]$/.test(event.key)) { event.preventDefault(); rate(['again','hard','good','easy'][Number(event.key)-1]); }
});
setInterval(() => { updateStats(); if (!session) renderStudy(); else if (!current && session.mode === 'review' && availableCards().length) pickNext(); }, 15000);
$('#custom-study').addEventListener('click', showCustomDecks);
$('#custom-nav').addEventListener('click', event => { const b = event.target.closest('[data-custom]'); if (b) studyCustom(b.dataset.custom); });
render();
if (loadError) notify('Stored progress could not be read. It has been preserved; use Settings to import a valid backup or reset.');

function studyCustom(id) {
  selectedCustom = id; selectedTopic = null; session = null; current = null; undo = null; $('#search').value = ''; $('#dialog').close(); render();
}
function showCustomDecks() {
  openDialog(`<span class="pill">MAKE YOUR OWN MIX</span><h2>Custom study decks</h2><p>Choose AQA cards across subjects, papers and topics. Their progress is shared with your subject decks. Your tier and application-question setting apply when studying.</p><button class="primary" id="create-custom">Create deck</button><div class="custom-deck-list">${state.customDecks.map(d => `<div class="custom-deck-row"><strong>${esc(d.name)}</strong><small>${d.cardIds.length} selected cards</small><div><button class="secondary" data-study-deck="${d.id}">Study</button><button class="secondary" data-edit-deck="${d.id}">Edit</button><button class="danger" data-delete-deck="${d.id}">Delete</button></div></div>`).join('') || '<p>No saved decks yet.</p>'}</div>`);
  $('#create-custom').onclick = () => editCustom();
  document.querySelectorAll('[data-study-deck]').forEach(b => b.onclick = () => studyCustom(b.dataset.studyDeck));
  document.querySelectorAll('[data-edit-deck]').forEach(b => b.onclick = () => editCustom(b.dataset.editDeck));
  document.querySelectorAll('[data-delete-deck]').forEach(b => b.onclick = () => {
    const deck = state.customDecks.find(d => d.id === b.dataset.deleteDeck);
    openDialog(`<h2>Delete ${esc(deck.name)}?</h2><p>Your card progress will be kept.</p><button id="confirm-delete-deck" class="danger">Delete deck</button>`);
    $('#confirm-delete-deck').onclick = () => { state.customDecks = state.customDecks.filter(d => d.id !== deck.id); if (selectedCustom === deck.id) { selectedCustom = null; selectedTopic = null; session = null; current = null; undo = null; } save(); render(); showCustomDecks(); };
  });
}
function editCustom(id) {
  const existing = state.customDecks.find(d => d.id === id), chosen = new Set(existing?.cardIds || []);
  openDialog(`<h2>${existing ? 'Edit' : 'Create'} custom deck</h2><label>Deck name <input id="deck-name" maxlength="80" value="${esc(existing?.name || '')}"></label><div class="deck-filters"><label>Subject <select id="deck-subject"><option value="">All subjects</option>${Object.keys(subjects).map(s => `<option>${s}</option>`).join('')}</select></label><label>Paper <select id="deck-paper"><option value="">Both papers</option><option value="1">Paper 1</option><option value="2">Paper 2</option></select></label><label>Topic <select id="deck-topic"><option value="">All topics</option></select></label><label>Search <input id="deck-search" type="search"></label></div><p>Higher and application cards can be selected; your study settings decide which are available.</p><div class="backup-buttons"><button id="select-shown" class="secondary">Select shown</button><button id="clear-shown" class="secondary">Clear shown</button></div><p id="selected-count" role="status"></p><div id="deck-cards" class="deck-card-list"></div><button id="save-custom" class="primary">Save deck</button>`);
  let shown = [];
  function options() {
    const list = DECK.topics.filter(t => (!$('#deck-subject').value || t.subject === $('#deck-subject').value) && (!$('#deck-paper').value || t.paper === Number($('#deck-paper').value)));
    $('#deck-topic').innerHTML = '<option value="">All topics</option>' + list.map(t => `<option value="${t.id}">${esc(t.subject)} · ${t.ref} ${esc(t.name)}</option>`).join('');
  }
  function draw() {
    const query = $('#deck-search').value.trim().toLowerCase();
    shown = DECK.cards.filter(c => { const t = topicOf(c); return (!$('#deck-subject').value || t.subject === $('#deck-subject').value) && (!$('#deck-paper').value || t.paper === Number($('#deck-paper').value)) && (!$('#deck-topic').value || c.topic === $('#deck-topic').value) && (!query || `${c.question} ${c.answer.join(' ')}`.toLowerCase().includes(query)); });
    $('#selected-count').textContent = `${chosen.size} selected · ${shown.length} shown`;
    $('#deck-cards').innerHTML = shown.map(c => `<label class="deck-card-choice"><input type="checkbox" data-choose-card="${c.id}" ${chosen.has(c.id) ? 'checked' : ''}><span>${esc(c.question)}<small>${esc(topicOf(c).name)}${c.tier === 'higher' ? ' · Higher' : ''}${c.kind === 'application' ? ' · Application' : ''}</small></span></label>`).join('');
  }
  for (const selector of ['#deck-subject','#deck-paper']) $(selector).onchange = () => { options(); draw(); };
  $('#deck-topic').onchange = draw; $('#deck-search').oninput = draw;
  $('#deck-cards').onchange = e => { const b = e.target.closest('[data-choose-card]'); if (!b) return; if (b.checked) chosen.add(b.dataset.chooseCard); else chosen.delete(b.dataset.chooseCard); $('#selected-count').textContent = `${chosen.size} selected · ${shown.length} shown`; };
  $('#select-shown').onclick = () => { shown.forEach(c => chosen.add(c.id)); draw(); };
  $('#clear-shown').onclick = () => { shown.forEach(c => chosen.delete(c.id)); draw(); };
  $('#save-custom').onclick = () => {
    try {
      if (!existing && state.customDecks.length >= 100) throw new Error('Maximum 100 custom decks.');
      const deck = Study.validateDecks([{id:existing?.id || `deck-${crypto.randomUUID()}`, name:$('#deck-name').value, cardIds:[...chosen]}], knownIds)[0];
      if (existing) state.customDecks = state.customDecks.map(d => d.id === id ? deck : d); else state.customDecks.push(deck);
      save(); studyCustom(deck.id); notify('Custom deck saved.');
    } catch (error) { notify(error.message); }
  };
  options(); draw();
}
