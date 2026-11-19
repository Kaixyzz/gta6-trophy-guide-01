// Leonida Legend — offline GTA 6 trophy tracker.
// Loads data/trophies.json, renders the checklist, and keeps earned trophies
// in localStorage. No network requests beyond the app's own files.
const STORE_KEY = 'leonida-legend-progress-v1';
const $ = (id) => document.getElementById(id);

const listEl = $('trophyList');
const searchEl = $('search');
const kindEl = $('kindFilter');
const gradeEl = $('gradeFilter');
const stateEl = $('stateFilter');
const spoilerEl = $('spoilerToggle');
const progressFill = $('progressFill');
const progressText = $('progressText');
const gradeCountsEl = $('gradeCounts');
const countLine = $('countLine');
const emptyNote = $('emptyNote');
const savedNote = $('savedNote');
const missableCard = $('missableCard');

let data = null;
let earned = new Set();
let openId = null;

function loadStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
    if (Array.isArray(raw)) earned = new Set(raw.filter((n) => typeof n === 'number'));
  } catch {
    earned = new Set();
  }
}

function saveStored(note) {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  if (note) {
    savedNote.textContent = note;
    setTimeout(() => { savedNote.textContent = ''; }, 2500);
  }
}

function isStory(t) { return t.kind === 'story' || t.grade === 'platinum'; }

function hiddenBySpoiler(t) {
  return spoilerEl.checked && isStory(t) && !earned.has(t.id);
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (stateEl.value === 'earned' && !earned.has(t.id)) return false;
  if (stateEl.value === 'todo' && earned.has(t.id)) return false;
  return true;
}

function gradeWord(g) { return g[0].toUpperCase() + g.slice(1); }

function renderProgress() {
  const total = data.trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} of ${total} earned — ${pct}% to the platinum`;
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = data.trophies.filter((t) => t.grade === g).length;
    const got = data.trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `${gradeWord(g)} ${got}/${all}`;
  });
  gradeCountsEl.textContent = counts.join(' · ');
}

function renderList() {
  const shown = data.trophies.filter(matches);
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveStored('Saved in this browser.');
      renderProgress();
      renderList();
      if (openId === t.id) fillDetail(t);
    });
    const body = document.createElement('div');
    body.className = 'trophy-body';
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    name.textContent = hiddenBySpoiler(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
    name.addEventListener('click', () => openDetail(t));
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = hiddenBySpoiler(t) ? 'Story details hidden by the spoiler setting.' : t.description;
    const guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = hiddenBySpoiler(t) ? '' : t.guide;
    body.append(name, desc);
    if (!hiddenBySpoiler(t)) body.append(guide);
    const badges = document.createElement('div');
    badges.className = 'badges';
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `badge ${t.grade}`;
    gradeBadge.textContent = gradeWord(t.grade);
    badges.append(gradeBadge);
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind';
    kindBadge.textContent = t.kind;
    badges.append(kindBadge);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'badge missable';
      m.textContent = '⚠ Possibly missable';
      badges.append(m);
    }
    body.append(badges);
    if (!hiddenBySpoiler(t)) {
      const src = document.createElement('p');
      src.className = 'sources-link';
      src.textContent = 'Sources: ';
      t.sources.forEach((s, i) => {
        if (i > 0) src.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = s.name.split(' — ')[0];
        src.append(a);
      });
      body.append(src);
    }
    li.append(box, body);
    listEl.append(li);
  }
  countLine.textContent = `Showing ${shown.length} of ${data.trophies.length} trophies`;
  emptyNote.hidden = shown.length !== 0;
}

function renderMissable() {
  const m = data.trophies.find((t) => t.missable);
  missableCard.replaceChildren();
  const h = document.createElement('h3');
  h.textContent = `⚠ ${m.name} — ${gradeWord(m.grade)}`;
  const d = document.createElement('p');
  d.textContent = m.description;
  const g = document.createElement('p');
  g.textContent = m.guide;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = earned.has(m.id) ? '✓ Earned — nice save' : 'Open the full guide';
  btn.addEventListener('click', () => openDetail(m));
  missableCard.append(h, d, g, btn);
}

function renderAll() {
  renderProgress();
  renderList();
  renderMissable();
}

function fillDetail(t) {
  $('detailGrade').textContent = `${gradeWord(t.grade)} trophy · ${t.kind}`;
  $('detailTitle').textContent = t.name;
  $('detailDesc').textContent = t.description;
  $('detailKind').textContent = t.missable
    ? 'Possibly missable — do it in Chapter 1, before it can disappear.'
    : 'Available in free-roam after the story unless the guide says otherwise.';
  $('detailGuide').textContent = t.guide;
  const ul = $('detailSources');
  ul.replaceChildren();
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
  const box = $('detailEarned');
  box.checked = earned.has(t.id);
  box.onchange = () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    saveStored('Saved in this browser.');
    renderAll();
  };
}

function openDetail(t) {
  openId = t.id;
  fillDetail(t);
  $('detail').hidden = false;
}

function closeDetail() {
  openId = null;
  $('detail').hidden = true;
}

function showView(view) {
  for (const v of ['checklist', 'roadmap', 'missable']) {
    $(`view-${v}`).hidden = v !== view;
  }
  document.querySelectorAll('.tab').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
}

function applyQuery() {
  const params = new URLSearchParams(location.search);
  const view = params.get('view');
  if (view === 'roadmap' || view === 'missable') showView(view);
  const kind = params.get('kind');
  if (kind && [...kindEl.options].some((o) => o.value === kind)) kindEl.value = kind;
  const grade = params.get('grade');
  if (grade && [...gradeEl.options].some((o) => o.value === grade)) gradeEl.value = grade;
  const open = Number(params.get('open'));
  if (open) {
    const t = data.trophies.find((x) => x.id === open);
    if (t) openDetail(t);
  }
}

async function init() {
  const res = await fetch('data/trophies.json');
  data = await res.json();
  loadStored();
  document.querySelectorAll('.tab').forEach((b) => {
    b.addEventListener('click', () => showView(b.dataset.view));
  });
  for (const el of [searchEl, kindEl, gradeEl, stateEl]) {
    el.addEventListener('input', renderList);
    el.addEventListener('change', renderList);
  }
  spoilerEl.addEventListener('change', renderList);
  $('detailClose').addEventListener('click', closeDetail);
  $('detail').addEventListener('click', (e) => { if (e.target.id === 'detail') closeDetail(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
  $('exportBtn').addEventListener('click', () => {
    const payload = { game: data.game, exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    a.download = 'gta6-trophy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
    savedNote.textContent = 'Exported — keep the file to import it back later.';
  });
  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error('bad file');
      const valid = new Set(data.trophies.map((t) => t.id));
      const next = ids.filter((n) => valid.has(n));
      earned = new Set(next);
      saveStored(`Imported ${next.length} earned trophies.`);
      renderAll();
    } catch {
      savedNote.textContent = 'That file could not be imported — it is not a progress export from this guide.';
    }
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (confirm('Clear all earned trophies in this browser?')) {
      earned = new Set();
      saveStored('Progress cleared.');
      renderAll();
    }
  });
  renderAll();
  applyQuery();
}

init();
