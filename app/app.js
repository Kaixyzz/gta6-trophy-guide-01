// Leonida Legend — offline GTA VI trophy checklist.
// Loads app/data/trophies.json, renders the 55 trophies, and keeps the
// checklist in localStorage. No network requests besides the local files.
const CHECKLIST_KEY = 'leonida-legend-checklist-v1';
const SPOILER_KEY = 'leonida-legend-spoilers-v1';

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty-state');
const searchEl = document.getElementById('search');
const spoilerToggle = document.getElementById('spoiler-toggle');
const earnedOnlyEl = document.getElementById('earned-only');
const progressFill = document.getElementById('progress-fill');
const progressCount = document.getElementById('progress-count');
const progressPercent = document.getElementById('progress-percent');
const gradeChipsEl = document.getElementById('grade-chips');
const ioMessage = document.getElementById('io-message');

let trophies = [];
let earned = new Set();
let activeFilter = 'all';

function loadEarned() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...earned].sort()));
}

function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) === 'hidden';
}

function applySpoilers() {
  const hidden = spoilerToggle.checked;
  document.body.classList.toggle('spoilers-hidden', hidden);
  localStorage.setItem(SPOILER_KEY, hidden ? 'hidden' : 'shown');
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return kind === 'story' ? 'Story' : kind === 'activities' ? 'Activities' : 'Collectibles';
}

function trophyCard(t) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
  li.id = 'trophy-' + t.id;
  li.dataset.kind = t.kind;
  li.dataset.missable = t.missable ? 'true' : 'false';

  const head = document.createElement('div');
  head.className = 'trophy-head';

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'trophy-check';
  check.checked = earned.has(t.id);
  check.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  check.addEventListener('change', () => {
    if (check.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveEarned();
    li.classList.toggle('earned', check.checked);
    renderProgress();
    if (earnedOnlyEl.checked) renderList();
  });

  const titleWrap = document.createElement('div');
  titleWrap.className = 'trophy-title';
  const h3 = document.createElement('h3');
  h3.textContent = t.name;
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = 'badge badge-' + t.grade;
  gradeBadge.textContent = gradeLabel(t.grade);
  meta.appendChild(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge badge-kind';
  kindBadge.textContent = kindLabel(t.kind);
  meta.appendChild(kindBadge);
  if (t.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge badge-hidden';
    hiddenBadge.textContent = 'Hidden';
    meta.appendChild(hiddenBadge);
  }
  if (t.missable) {
    const missBadge = document.createElement('span');
    missBadge.className = 'badge badge-missable';
    missBadge.textContent = 'Missable';
    meta.appendChild(missBadge);
  }
  titleWrap.appendChild(h3);
  titleWrap.appendChild(meta);

  head.appendChild(check);
  head.appendChild(titleWrap);
  li.appendChild(head);

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = '\u201C' + t.description + '\u201D';
  li.appendChild(desc);

  const guide = document.createElement('p');
  guide.className = 'trophy-guide';
  const label = document.createElement('span');
  label.className = t.unconfirmed ? 'strategy-label' : 'guide-label';
  label.textContent = t.unconfirmed ? 'Strategy from the description: ' : 'How to get it: ';
  guide.appendChild(label);
  guide.appendChild(document.createTextNode(t.guide));
  li.appendChild(guide);

  const sources = document.createElement('p');
  sources.className = 'trophy-sources';
  sources.textContent = 'Sources: ' + t.sources.join(', ') + '.';
  li.appendChild(sources);

  return li;
}

function matchesFilters(t) {
  if (activeFilter === 'missable' && !t.missable) return false;
  if (activeFilter !== 'all' && activeFilter !== 'missable' && t.kind !== activeFilter) return false;
  if (earnedOnlyEl.checked && !earned.has(t.id)) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderList() {
  listEl.textContent = '';
  const shown = trophies.filter(matchesFilters);
  for (const t of shown) listEl.appendChild(trophyCard(t));
  emptyEl.hidden = shown.length !== 0;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressCount.textContent = done + ' / ' + total;
  progressPercent.textContent = pct + '%';
  progressFill.style.width = pct + '%';

  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  gradeChipsEl.textContent = '';
  for (const grade of grades) {
    const inGrade = trophies.filter((t) => t.grade === grade);
    const doneInGrade = inGrade.filter((t) => earned.has(t.id)).length;
    const chip = document.createElement('span');
    chip.className = 'grade-chip grade-' + grade;
    const b = document.createElement('b');
    b.textContent = gradeLabel(grade);
    chip.appendChild(b);
    chip.appendChild(document.createTextNode(doneInGrade + ' / ' + inGrade.length));
    gradeChipsEl.appendChild(chip);
  }
}

function renderAll() {
  renderProgress();
  renderList();
}

function showMessage(text) {
  ioMessage.textContent = text;
  window.setTimeout(() => { ioMessage.textContent = ''; }, 4000);
}

function exportChecklist() {
  const payload = {
    app: 'leonida-legend',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-checklist.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showMessage('Checklist exported (' + payload.earned.length + ' earned).');
}

function importChecklist(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error('bad file');
      const known = new Set(trophies.map((t) => t.id));
      const valid = ids.filter((id) => known.has(id));
      earned = new Set(valid);
      saveEarned();
      renderAll();
      showMessage('Imported ' + valid.length + ' earned trophies.');
    } catch {
      showMessage('That file could not be imported. It must be a Leonida Legend checklist export.');
    }
  };
  reader.readAsText(file);
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  if (filter && ['all', 'story', 'activities', 'collectibles', 'missable'].includes(filter)) {
    activeFilter = filter;
    document.querySelectorAll('#filters .filter').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderList();
    document.getElementById('trophy-list').scrollIntoView();
  }
  const view = params.get('view');
  if (view === 'roadmap') {
    document.getElementById('roadmap').scrollIntoView();
  }
  const trophyId = params.get('trophy');
  if (trophyId) {
    const el = document.getElementById('trophy-' + trophyId);
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.style.outline = '2px solid var(--teal)';
      el.style.outlineOffset = '3px';
    }
  }
}

async function init() {
  earned = loadEarned();
  spoilerToggle.checked = loadSpoilersHidden();
  applySpoilers();

  const response = await fetch('data/trophies.json');
  trophies = await response.json();
  renderAll();

  document.querySelectorAll('#filters .filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('#filters .filter').forEach((b) => b.classList.toggle('active', b === btn));
      renderList();
    });
  });
  searchEl.addEventListener('input', renderList);
  earnedOnlyEl.addEventListener('change', renderList);
  spoilerToggle.addEventListener('change', applySpoilers);

  document.getElementById('export-btn').addEventListener('click', exportChecklist);
  const importFile = document.getElementById('import-file');
  document.getElementById('import-btn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    if (importFile.files && importFile.files[0]) importChecklist(importFile.files[0]);
    importFile.value = '';
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (window.confirm('Reset the whole checklist? This clears every earned trophy.')) {
      earned = new Set();
      saveEarned();
      renderAll();
      showMessage('Checklist reset.');
    }
  });

  applyUrlParams();
}

init();
