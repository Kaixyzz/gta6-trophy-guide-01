const CHECKLIST_KEY = 'leonida-legend-checklist-v1';
const SPOILER_KEY = 'leonida-legend-spoiler-v1';

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty-state');
const searchEl = document.getElementById('search');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const gradeCountsEl = document.getElementById('grade-counts');
const spoilerToggle = document.getElementById('spoiler-toggle');
const statusLine = document.getElementById('status-line');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const resetBtn = document.getElementById('reset-btn');
const modal = document.getElementById('guide-modal');

let trophies = [];
let earned = new Set();
let activeKind = 'all';
let activeTrophy = null;

function loadEarned() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) earned = new Set(parsed.filter((id) => typeof id === 'string'));
  } catch {
    earned = new Set();
  }
}

function saveEarned() {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...earned].sort()));
}

function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

function applySpoiler(on) {
  document.body.classList.toggle('spoiler-safe', on);
  spoilerToggle.checked = on;
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  if (kind === 'story') return 'Story';
  if (kind === 'activities') return 'Activities';
  if (kind === 'collectibles') return 'Collectibles';
  return kind;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function matchesFilter(trophy) {
  const q = searchEl.value.trim().toLowerCase();
  if (q && !trophy.name.toLowerCase().includes(q) && !trophy.description.toLowerCase().includes(q)) return false;
  if (activeKind === 'earned') return earned.has(trophy.id);
  if (activeKind === 'todo') return !earned.has(trophy.id);
  if (activeKind === 'missable') return trophy.missable;
  if (activeKind === 'all') return true;
  return trophy.kind === activeKind;
}

function render() {
  const visible = trophies.filter(matchesFilter);
  emptyEl.hidden = visible.length > 0;
  listEl.innerHTML = visible.map((t) => {
    const isEarned = earned.has(t.id);
    const guideHtml = t.guideStatus === 'from-description'
      ? `<span class="from-desc">Strategy from the description:</span> ${escapeHtml(t.guide.replace(/^Strategy from the description:\s*/, ''))}`
      : escapeHtml(t.guide);
    const tags = [
      `<span class="tag">${kindLabel(t.kind)}</span>`,
      t.hidden ? '<span class="tag hidden-tag">Hidden</span>' : '',
      t.missable ? '<span class="tag missable-tag">Missable</span>' : '',
    ].join('');
    return `<article class="trophy-card${isEarned ? ' earned' : ''}" data-id="${t.id}" tabindex="0">
      <div class="trophy-top">
        <span class="grade-badge grade-${t.grade}">${gradeLabel(t.grade)}</span>
        ${tags}
      </div>
      <h3 class="trophy-name">${escapeHtml(t.name)}</h3>
      <p class="trophy-desc">${escapeHtml(t.description)}</p>
      <p class="trophy-guide">${guideHtml}</p>
      <div class="earned-row">
        <input type="checkbox" id="earned-${t.id}" data-earned="${t.id}" ${isEarned ? 'checked' : ''} aria-label="Mark ${escapeHtml(t.name)} as earned">
        <label for="earned-${t.id}">Earned</label>
      </div>
    </article>`;
  }).join('');

  const total = trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} of ${total} earned · ${pct}%`;

  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) counts[t.grade] += 1;
  gradeCountsEl.textContent = `1 platinum · 2 gold · 6 silver · 46 bronze — ${counts.platinum} platinum, ${counts.gold} gold, ${counts.silver} silver, ${counts.bronze} bronze in this guide.`;
}

function setStatus(message) {
  statusLine.textContent = message;
  window.clearTimeout(setStatus._timer);
  setStatus._timer = window.setTimeout(() => { statusLine.textContent = ''; }, 4000);
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  saveEarned();
  render();
}

function openModal(id) {
  const t = trophies.find((x) => x.id === id);
  if (!t) return;
  activeTrophy = t;
  document.getElementById('modal-grade').textContent = gradeLabel(t.grade);
  document.getElementById('modal-title').textContent = t.name;
  document.getElementById('modal-description').textContent = t.description;
  document.getElementById('modal-tags').innerHTML = [
    `<span class="tag">${kindLabel(t.kind)}</span>`,
    t.hidden ? '<span class="tag hidden-tag">Hidden</span>' : '',
    t.missable ? '<span class="tag missable-tag">Missable</span>' : '',
  ].join('');
  document.getElementById('modal-guide').textContent = t.guide;
  document.getElementById('modal-status').textContent = t.guideStatus === 'from-description'
    ? 'Strategy from the description — the exact unlock method is still unconfirmed.'
    : '';
  document.getElementById('modal-toggle').textContent = earned.has(t.id) ? 'Mark as not earned' : 'Mark as earned';
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  activeTrophy = null;
}

listEl.addEventListener('click', (event) => {
  const checkbox = event.target.closest('[data-earned]');
  if (checkbox) {
    toggleEarned(checkbox.getAttribute('data-earned'));
    return;
  }
  const card = event.target.closest('.trophy-card');
  if (card) openModal(card.getAttribute('data-id'));
});

listEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const card = event.target.closest('.trophy-card');
  if (card) openModal(card.getAttribute('data-id'));
});

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeKind = btn.getAttribute('data-kind');
    render();
  });
});

searchEl.addEventListener('input', render);
spoilerToggle.addEventListener('change', () => applySpoiler(spoilerToggle.checked));

exportBtn.addEventListener('click', () => {
  const payload = { app: 'leonida-legend', exportedAt: new Date().toISOString(), earned: [...earned].sort() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-legend-checklist.json';
  a.click();
  URL.revokeObjectURL(url);
  setStatus(`Exported ${earned.size} earned trophies.`);
});

importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', async () => {
  const file = importFile.files && importFile.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) throw new Error('bad file');
    const known = new Set(trophies.map((t) => t.id));
    const valid = ids.filter((id) => known.has(id));
    earned = new Set(valid);
    saveEarned();
    render();
    setStatus(`Imported ${valid.length} earned trophies.`);
  } catch {
    setStatus('Import failed: that file is not a Leonida Legend checklist.');
  } finally {
    importFile.value = '';
  }
});

resetBtn.addEventListener('click', () => {
  if (!window.confirm('Clear your whole checklist?')) return;
  earned = new Set();
  saveEarned();
  render();
  setStatus('Checklist cleared.');
});

document.getElementById('modal-close').addEventListener('click', closeModal);
modal.querySelector('[data-close]').addEventListener('click', closeModal);
document.getElementById('modal-toggle').addEventListener('click', () => {
  if (!activeTrophy) return;
  toggleEarned(activeTrophy.id);
  openModal(activeTrophy.id);
  document.getElementById('modal-toggle').textContent = earned.has(activeTrophy.id) ? 'Mark as not earned' : 'Mark as earned';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

async function init() {
  loadEarned();
  applySpoiler(loadSpoiler());
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('could not load trophy data');
  trophies = await response.json();
  render();
}

init().catch((error) => {
  listEl.innerHTML = `<p class="empty-state">Could not load the trophy list: ${escapeHtml(error.message)}</p>`;
  emptyEl.hidden = true;
});
