const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const projects = [
  { number: 101, name: 'Student Portfolio Website', mode: 'hero', variant: 'portfolio', accent: '#1f4fd7' },
  { number: 102, name: 'Personal Blog Platform', mode: 'dashboard', variant: 'blog', accent: '#0f766e' },
  { number: 103, name: 'Online Notes Manager', mode: 'crud', variant: 'notes', accent: '#7c3aed' },
  { number: 104, name: 'To-Do App with Login', mode: 'crud', variant: 'todoLogin', accent: '#dc2626' },
  { number: 105, name: 'Contact Management System', mode: 'crud', variant: 'contacts', accent: '#2563eb' },
  { number: 106, name: 'Event Registration Website', mode: 'calendar', variant: 'event', accent: '#ea580c' },
  { number: 107, name: 'Simple E-Commerce Store (No Payment)', mode: 'store', variant: 'store', accent: '#059669' },
  { number: 108, name: 'Feedback Collection System', mode: 'dashboard', variant: 'feedback', accent: '#9333ea' },
  { number: 109, name: 'Online Quiz Application', mode: 'quiz', variant: 'quiz', accent: '#0f172a' },
  { number: 110, name: 'URL Shortener', mode: 'utility', variant: 'url', accent: '#2563eb' },
  { number: 111, name: 'Weather Forecast App', mode: 'utility', variant: 'weather', accent: '#0891b2' },
  { number: 112, name: 'Expense Tracker', mode: 'utility', variant: 'expense', accent: '#b45309' },
  { number: 113, name: 'Online Book Library', mode: 'hero', variant: 'library', accent: '#7c2d12' },
  { number: 114, name: 'Job Application Portal', mode: 'hero', variant: 'jobs', accent: '#0f766e' },
  { number: 115, name: 'Restaurant Menu Website', mode: 'hero', variant: 'menu', accent: '#be123c' },
  { number: 116, name: 'Online Voting System', mode: 'quiz', variant: 'vote', accent: '#4f46e5' },
  { number: 117, name: 'Digital Diary App', mode: 'crud', variant: 'diary', accent: '#db2777' },
  { number: 118, name: 'Online Complaint Registration System', mode: 'crud', variant: 'complaint', accent: '#dc2626' },
  { number: 119, name: 'Password Manager', mode: 'utility', variant: 'password', accent: '#111827' },
  { number: 120, name: 'Newsletter Subscription System', mode: 'utility', variant: 'newsletter', accent: '#7c3aed' },
  { number: 121, name: 'Course Enrollment Website', mode: 'hero', variant: 'course', accent: '#0f766e' },
  { number: 122, name: 'Online Polling App', mode: 'quiz', variant: 'poll', accent: '#1d4ed8' },
  { number: 123, name: 'Resume Builder Website', mode: 'dashboard', variant: 'resume', accent: '#334155' },
  { number: 124, name: 'Product Review Platform', mode: 'store', variant: 'reviews', accent: '#f97316' },
  { number: 125, name: 'Image Gallery Management System', mode: 'media', variant: 'gallery', accent: '#8b5cf6' },
  { number: 126, name: 'Online Appointment Booking', mode: 'calendar', variant: 'appointment', accent: '#047857' },
  { number: 127, name: 'Simple Chat Application', mode: 'board', variant: 'chat', accent: '#2563eb' },
  { number: 128, name: 'Task Management Tool', mode: 'kanban', variant: 'tasks', accent: '#0f172a' },
  { number: 129, name: 'Attendance Management System', mode: 'crud', variant: 'attendance', accent: '#7c3aed' },
  { number: 130, name: 'Online Feedback Analyzer', mode: 'dashboard', variant: 'analyzer', accent: '#b91c1c' },
  { number: 131, name: 'Personal Finance Tracker', mode: 'utility', variant: 'finance', accent: '#059669' },
  { number: 132, name: 'Online FAQ System', mode: 'utility', variant: 'faq', accent: '#6366f1' },
  { number: 133, name: 'Digital Certificate Generator', mode: 'dashboard', variant: 'certificate', accent: '#0f172a' },
  { number: 134, name: 'Online File Upload System', mode: 'media', variant: 'upload', accent: '#0891b2' },
  { number: 135, name: 'Static Blog with CMS Integration', mode: 'dashboard', variant: 'blogCMS', accent: '#7c3aed' },
  { number: 136, name: 'Student Result Management System', mode: 'crud', variant: 'results', accent: '#dc2626' },
  { number: 137, name: 'Online Survey Platform', mode: 'quiz', variant: 'survey', accent: '#0ea5e9' },
  { number: 138, name: 'Blood Donation Management System', mode: 'crud', variant: 'blood', accent: '#b91c1c' },
  { number: 139, name: 'College Club Management Website', mode: 'hero', variant: 'club', accent: '#8b5cf6' },
  { number: 140, name: 'Online Learning Resource Hub', mode: 'hero', variant: 'learning', accent: '#0f766e' },
  { number: 141, name: 'Online Address Book', mode: 'crud', variant: 'address', accent: '#2563eb' },
  { number: 142, name: 'Daily Planner App', mode: 'calendar', variant: 'planner', accent: '#f59e0b' },
  { number: 143, name: 'Online Discussion Forum', mode: 'board', variant: 'forum', accent: '#1d4ed8' },
  { number: 144, name: 'Virtual Notice Board', mode: 'board', variant: 'notice', accent: '#7c3aed' },
  { number: 145, name: 'Online Voting Poll Dashboard', mode: 'quiz', variant: 'pollDash', accent: '#0f766e' },
  { number: 146, name: 'Online Event Countdown App', mode: 'utility', variant: 'countdown', accent: '#ea580c' },
  { number: 147, name: 'Digital Clock + Alarm System', mode: 'utility', variant: 'clock', accent: '#111827' },
  { number: 148, name: 'Online Image Compressor', mode: 'media', variant: 'compressor', accent: '#2563eb' },
  { number: 149, name: 'Online PDF Merger Tool', mode: 'media', variant: 'pdfMerger', accent: '#dc2626' },
  { number: 150, name: 'Static Company Website with Admin Panel', mode: 'dashboard', variant: 'companyAdmin', accent: '#0f172a' },
];

const layoutTypes = ['split', 'bento', 'timeline', 'sidebar', 'stacked'];
const widgetTypes = ['palette', 'counter', 'checklist', 'timer', 'bookmarks'];

const generatedProjects = projects.map((project, index) => ({
  ...project,
  layout: layoutTypes[index % layoutTypes.length],
  widget: widgetTypes[index % widgetTypes.length],
  hue: (index * 29 + 20) % 360,
  accentSet: [
    project.accent,
    `hsl(${(index * 29 + 72) % 360} 78% 48%)`,
    `hsl(${(index * 29 + 144) % 360} 72% 42%)`
  ]
}));

const sharedCss = `:root {
  color-scheme: light;
  --bg: #0f172a;
  --panel: rgba(255, 255, 255, 0.9);
  --panel-strong: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.12);
  --shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
  --radius: 24px;
  --accent: #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.12);
}

* { box-sizing: border-box; }

html, body { margin: 0; min-height: 100%; }

body {
  font-family: Arial, Helvetica, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.9), transparent 42%),
    radial-gradient(circle at 90% 10%, rgba(255,255,255,0.7), transparent 28%),
    linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, white) 0%, #eef2ff 45%, #f8fafc 100%);
  color: var(--text);
}

body.night {
  --panel: rgba(15, 23, 42, 0.86);
  --text: #e2e8f0;
  --muted: #94a3b8;
  --border: rgba(148, 163, 184, 0.24);
  background:
    radial-gradient(circle at top left, rgba(30,41,59,0.8), transparent 42%),
    radial-gradient(circle at 90% 10%, rgba(15,23,42,0.8), transparent 28%),
    linear-gradient(135deg, #020617 0%, #0b1120 45%, #111827 100%);
}

.shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 44px;
}

.hero {
  background: linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,255,255,0.82));
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 32px;
  padding: 28px;
  display: grid;
  gap: 18px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin: 0;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 0.95;
}

.hero p {
  margin: 0;
  max-width: 70ch;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions button,
.panel button,
.panel a.button {
  border: 0;
  background: var(--accent);
  color: white;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.actions button.secondary,
.panel a.button.secondary {
  background: white;
  color: var(--text);
  border: 1px solid var(--border);
}

.grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.panel {
  background: var(--panel);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
}

.panel h2, .panel h3 { margin: 0 0 14px; }

.input-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 12px;
}

input, textarea, select {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 14px;
  font: inherit;
  background: white;
}

textarea { min-height: 120px; resize: vertical; }

.list, .cards {
  display: grid;
  gap: 12px;
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 14px 16px;
}

.muted { color: var(--muted); }
.row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.pill { padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 0.82rem; font-weight: 700; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
.stat { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 14px; }
.stat strong { display: block; font-size: 1.6rem; margin-bottom: 4px; }
.split { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr); gap: 18px; align-items: start; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 10px; border-bottom: 1px solid var(--border); text-align: left; }
.bar { height: 10px; border-radius: 999px; background: rgba(15,23,42,0.08); overflow: hidden; }
.bar > span { display: block; height: 100%; border-radius: inherit; background: var(--accent); }
.board-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.column { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 14px; }
.column h3 { margin-top: 0; }
.calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.day { min-height: 84px; background: white; border: 1px solid var(--border); border-radius: 16px; padding: 10px; font-size: 0.85rem; }
.day strong { display: block; margin-bottom: 6px; }
.notice { border-left: 6px solid var(--accent); background: white; border-radius: 16px; padding: 14px 16px; border: 1px solid var(--border); }
.mini { font-size: 0.85rem; color: var(--muted); }
.hidden { display: none !important; }

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.topbar .left,
.topbar .right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.chip {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 0.82rem;
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px var(--border);
  cursor: pointer;
}

.hero.layout-bento {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hero.layout-bento h1,
.hero.layout-bento p,
.hero.layout-bento .actions {
  grid-column: span 2;
}

.hero.layout-timeline {
  position: relative;
  padding-left: 34px;
}

.hero.layout-timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: linear-gradient(var(--accent), transparent);
}

.hero.layout-sidebar {
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: center;
}

.hero.layout-sidebar .eyebrow {
  grid-column: 1 / -1;
}

.hero.layout-stacked {
  background:
    linear-gradient(150deg, rgba(255,255,255,0.97), rgba(255,255,255,0.86)),
    repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(15, 23, 42, 0.03) 14px, rgba(15, 23, 42, 0.03) 16px);
}

.widget-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.widget-item {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px;
  background: white;
}

@media (max-width: 900px) {
  .split { grid-template-columns: 1fr; }
}
`;

const sharedJs = `(() => {
  const config = window.PROJECT_CONFIG;
  const app = document.getElementById('app');
  const stateKey = 'project-' + config.number + '-' + config.variant;

  function load(defaultValue) {
    try {
      const value = localStorage.getItem(stateKey);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function save(value) {
    localStorage.setItem(stateKey, JSON.stringify(value));
  }

  function html(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  function renderPage(content) {
    app.innerHTML = '<section class="panel">' + content + '</section>';
  }

  function initTopControls() {
    const themeToggle = document.getElementById('themeToggle');
    const accentButtons = document.querySelectorAll('[data-accent]');
    const currentTheme = localStorage.getItem(stateKey + '-theme') || 'light';
    const currentAccent = localStorage.getItem(stateKey + '-accent');

    if (currentTheme === 'night') {
      document.body.classList.add('night');
    }
    if (currentAccent) {
      document.body.style.setProperty('--accent', currentAccent);
      document.body.style.setProperty('--accent-soft', 'color-mix(in srgb, ' + currentAccent + ' 15%, white)');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('night');
      localStorage.setItem(stateKey + '-theme', document.body.classList.contains('night') ? 'night' : 'light');
    });

    const heroPrimary = document.getElementById('heroPrimary');
    const heroSecondary = document.getElementById('heroSecondary');
    if (heroPrimary) {
      heroPrimary.addEventListener('click', () => {
        const appHeading = document.querySelector('#app h2');
        if (appHeading) appHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (heroSecondary) {
      heroSecondary.addEventListener('click', () => {
        localStorage.setItem(stateKey + '-savedAt', new Date().toISOString());
      });
    }

    accentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const color = button.dataset.accent;
        document.body.style.setProperty('--accent', color);
        document.body.style.setProperty('--accent-soft', 'color-mix(in srgb, ' + color + ' 15%, white)');
        localStorage.setItem(stateKey + '-accent', color);
      });
    });
  }

  function renderWidgetZone() {
    const zone = document.getElementById('widgetZone');
    if (!zone) return;

    if (config.widget === 'palette') {
      zone.innerHTML = '<h3>Live Palette Lab</h3><p class="muted">Click a color to test the interface mood instantly.</p><div class="widget-grid">' +
        (config.accentSet || []).map((color) => '<button class="widget-item" data-accent="' + color + '" style="background:' + color + '; color:white">' + color + '</button>').join('') +
      '</div>';
      return;
    }

    if (config.widget === 'counter') {
      zone.innerHTML = '<h3>Visitor Counter Simulator</h3><p class="muted">A lightweight stats widget for dashboard pages.</p><div class="widget-grid"><div class="widget-item"><strong id="visitCount">0</strong><p class="mini">Visits today</p></div><button id="visitAdd" class="widget-item">Add Visitor</button><button id="visitReset" class="widget-item">Reset</button></div>';
      const key = stateKey + '-visits';
      let count = Number(localStorage.getItem(key) || '0');
      const countEl = document.getElementById('visitCount');
      const refresh = () => { countEl.textContent = String(count); };
      refresh();
      document.getElementById('visitAdd').addEventListener('click', () => { count += 1; localStorage.setItem(key, String(count)); refresh(); });
      document.getElementById('visitReset').addEventListener('click', () => { count = 0; localStorage.setItem(key, '0'); refresh(); });
      return;
    }

    if (config.widget === 'checklist') {
      const key = stateKey + '-checklist';
      const defaults = ['Create layout', 'Add colors', 'Test form actions'];
      const tasks = load(defaults.map((text, index) => ({ id: index + 1, text, done: false })));
      zone.innerHTML = '<h3>Build Checklist</h3><div id="checklist"></div>';
      const draw = () => {
        document.getElementById('checklist').innerHTML = tasks.map((task, index) => '<label class="widget-item" style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-task="' + index + '" ' + (task.done ? 'checked' : '') + '><span>' + html(task.text) + '</span></label>').join('');
        document.querySelectorAll('[data-task]').forEach((box) => {
          box.addEventListener('change', () => {
            tasks[Number(box.dataset.task)].done = box.checked;
            localStorage.setItem(key, JSON.stringify(tasks));
          });
        });
      };
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(tasks));
      draw();
      return;
    }

    if (config.widget === 'timer') {
      zone.innerHTML = '<h3>Quick Focus Timer</h3><p class="muted">Set minutes and start a small focus sprint.</p><div class="widget-grid"><input id="timerMinutes" type="number" min="1" value="15"><button id="timerStart">Start</button><div class="widget-item"><strong id="timerText">15:00</strong><p class="mini">Remaining</p></div></div>';
      let timer = null;
      const timerText = document.getElementById('timerText');
      document.getElementById('timerStart').addEventListener('click', () => {
        clearInterval(timer);
        let seconds = Number(document.getElementById('timerMinutes').value) * 60;
        timerText.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
        timer = setInterval(() => {
          seconds -= 1;
          if (seconds <= 0) {
            clearInterval(timer);
            timerText.textContent = 'Done';
            return;
          }
          timerText.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
        }, 1000);
      });
      return;
    }

    zone.innerHTML = '<h3>Quick Bookmarks</h3><p class="muted">Store useful links for this project page.</p><form id="bmForm" class="input-row"><input name="label" placeholder="Label" required><input name="url" placeholder="https://example.com" required><button type="submit">Add</button></form><div id="bmList" class="list"></div>';
    const key = stateKey + '-bookmarks';
    const bookmarks = load([]);
    const draw = () => {
      document.getElementById('bmList').innerHTML = bookmarks.map((item) => '<a class="widget-item" href="' + html(item.url) + '" target="_blank" rel="noreferrer"><strong>' + html(item.label) + '</strong><p class="mini">' + html(item.url) + '</p></a>').join('') || '<p class="mini">No bookmarks yet.</p>';
    };
    document.getElementById('bmForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      bookmarks.unshift({ label: data.get('label'), url: data.get('url') });
      localStorage.setItem(key, JSON.stringify(bookmarks));
      event.target.reset();
      draw();
    });
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        bookmarks.splice(0, bookmarks.length, ...parsed);
      } catch {
        // ignore malformed bookmark data
      }
    }
    draw();
  }

  function renderHero() {
    const features = (config.features || []).map((item) =>
      '<article class="card"><div class="pill">' + html(item.label) + '</div><h3>' + html(item.title) + '</h3><p class="muted">' + html(item.text) + '</p></article>'
    ).join('');

    renderPage(
      '<div class="split">' +
        '<div>' +
          '<div class="pill">Live showcase</div>' +
          '<h2>' + html(config.title) + '</h2>' +
          '<p class="muted">' + html(config.subtitle) + '</p>' +
          '<div class="actions"><button id="primaryBtn">' + html(config.primaryAction || 'Explore') + '</button><button class="secondary" id="secondaryBtn">' + html(config.secondaryAction || 'Save draft') + '</button></div>' +
          '<div class="cards" style="margin-top:16px">' + features + '</div>' +
        '</div>' +
        '<aside class="card"><h3>Quick form</h3><form id="quickForm" class="list"><input name="name" placeholder="Your name" required><input name="email" type="email" placeholder="Email address" required><textarea name="note" placeholder="Short message"></textarea><button type="submit">Submit</button></form><div id="heroMsg" class="mini" style="margin-top:12px"></div></aside>' +
      '</div>'
    );

    const heroMsg = document.getElementById('heroMsg');
    document.getElementById('quickForm').addEventListener('submit', (event) => {
      event.preventDefault();
      heroMsg.textContent = 'Saved locally for ' + config.title + ' at ' + new Date().toLocaleString();
      event.target.reset();
    });
    document.getElementById('primaryBtn').addEventListener('click', () => heroMsg.textContent = 'This section is ready for content, projects, or testimonials.');
    document.getElementById('secondaryBtn').addEventListener('click', () => heroMsg.textContent = 'Draft saved. You can keep editing in the site form.');
  }

  function renderCrud() {
    const fields = config.fields || [
      { name: 'title', label: 'Title' },
      { name: 'detail', label: 'Details' }
    ];
    const stored = load(config.seedItems || []);
    let items = Array.isArray(stored) ? stored : [];

    function draw(filterText = '') {
      const filtered = items.filter((item) => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()));
      const form = fields.map((field) => '<input name="' + field.name + '" placeholder="' + html(field.label) + '" required>').join('');
      const list = filtered.map((item) =>
        '<article class="card"><div class="row"><strong>' + html(item[fields[0].name] || item.title || 'Item') + '</strong><span class="pill">' + html(config.variant) + '</span></div><p class="muted">' + html(fields.slice(1).map((field) => item[field.name]).filter(Boolean).join(' • ') || item.detail || 'Saved locally') + '</p><div class="row"><button data-remove="' + item.id + '">Delete</button></div></article>'
      ).join('') || '<p class="muted">No entries yet. Add the first record below.</p>';

      renderPage(
        '<div class="split">' +
          '<div>' +
            '<div class="stats"><div class="stat"><strong>' + items.length + '</strong><span>Total records</span></div><div class="stat"><strong>' + filtered.length + '</strong><span>Visible now</span></div></div>' +
            '<div class="panel" style="margin-top:16px;background:transparent;padding:0;border:0;box-shadow:none">' +
              '<div class="input-row"><input id="searchBox" placeholder="Search ' + html(config.variant) + '"></div>' +
              '<div class="list" id="crudList">' + list + '</div>' +
            '</div>' +
          '</div>' +
          '<aside class="card"><h3>Add new entry</h3><form id="crudForm" class="list">' + form + '<button type="submit">Save record</button></form><p id="crudMsg" class="mini"></p></aside>' +
        '</div>'
      );

      const searchBox = document.getElementById('searchBox');
      const crudList = document.getElementById('crudList');
      const crudMsg = document.getElementById('crudMsg');

      searchBox.addEventListener('input', () => draw(searchBox.value));
      document.getElementById('crudForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const entry = { id: uid() };
        fields.forEach((field) => { entry[field.name] = data.get(field.name); });
        items = [entry, ...items];
        save(items);
        crudMsg.textContent = 'Saved successfully.';
        draw(searchBox.value);
      });

      crudList.querySelectorAll('[data-remove]').forEach((button) => {
        button.addEventListener('click', () => {
          items = items.filter((item) => item.id !== button.dataset.remove);
          save(items);
          draw(searchBox.value);
        });
      });
    }

    if (!items.length && config.seedItems && config.seedItems.length) {
      items = config.seedItems.map((item, index) => ({ id: String(index + 1), ...item }));
      save(items);
    }

    draw();
  }

  function renderQuiz() {
    const mode = config.variant;
    const questions = config.questions || [
      { question: 'Which feature is most important?', options: ['Speed', 'Design', 'Reliability', 'Ease of use'], answer: 1 },
      { question: 'What should the dashboard focus on?', options: ['Insights', 'Controls', 'Content', 'Reports'], answer: 0 },
      { question: 'What is the default action?', options: ['Create', 'Delete', 'Share', 'Search'], answer: 3 }
    ];

    if (mode === 'vote' || mode === 'poll' || mode === 'pollDash' || mode === 'survey') {
      const votes = load(questions[0].options.map(() => 0));
      const total = votes.reduce((sum, value) => sum + value, 0) || 1;
      renderPage(
        '<h2>' + html(config.title) + '</h2><p class="muted">Tap one option to vote and see the live results update immediately.</p>' +
        '<div class="cards" id="pollCards">' + questions[0].options.map((option, index) => '<article class="card"><div class="row"><strong>' + html(option) + '</strong><button data-vote="' + index + '">Vote</button></div><div class="bar" style="margin-top:10px"><span style="width:' + Math.max(8, (votes[index] / total) * 100) + '%"></span></div><p class="mini">' + votes[index] + ' vote(s)</p></article>').join('') + '</div>'
      );
      document.querySelectorAll('[data-vote]').forEach((button) => {
        button.addEventListener('click', () => {
          const next = [...votes];
          next[Number(button.dataset.vote)] += 1;
          save(next);
          renderQuiz();
        });
      });
      return;
    }

    renderPage(
      '<h2>' + html(config.title) + '</h2><p class="muted">Answer the quiz and see your score immediately.</p>' +
      '<form id="quizForm" class="list">' + questions.map((item, index) => '<article class="card"><strong>' + (index + 1) + '. ' + html(item.question) + '</strong><div class="list" style="margin-top:12px">' + item.options.map((option, choiceIndex) => '<label class="card" style="display:flex;gap:10px;align-items:center"><input type="radio" name="q' + index + '" value="' + choiceIndex + '" required> ' + html(option) + '</label>').join('') + '</div></article>').join('') + '<button type="submit">Check score</button></form><div id="quizResult" class="mini" style="margin-top:12px"></div>'
    );

    document.getElementById('quizForm').addEventListener('submit', (event) => {
      event.preventDefault();
      let score = 0;
      questions.forEach((item, index) => {
        const selected = event.target.elements['q' + index].value;
        if (Number(selected) === item.answer) score += 1;
      });
      document.getElementById('quizResult').textContent = 'Score: ' + score + ' / ' + questions.length;
    });
  }

  function renderUtility() {
    const variant = config.variant;
    if (variant === 'url') {
      const items = load([]);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="urlForm" class="list"><input name="url" placeholder="Paste long URL" required><button type="submit">Shorten URL</button></form><p id="urlMessage" class="mini"></p></div><div><div class="list" id="urlList"></div></div></div>');
      const list = document.getElementById('urlList');
      function draw() {
        list.innerHTML = items.map((item) => '<article class="card"><strong>' + html(item.short) + '</strong><p class="muted">' + html(item.url) + '</p><div class="row"><a class="button" href="' + html(item.url) + '" target="_blank" rel="noreferrer">Open</a><button data-copy="' + html(item.short) + '">Copy</button></div></article>').join('') || '<p class="muted">No links yet.</p>';
        list.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
          await navigator.clipboard.writeText(button.dataset.copy);
        }));
      }
      document.getElementById('urlForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const url = event.target.url.value.trim();
        const short = 'go/' + uid();
        items = [{ url, short }, ...items];
        save(items);
        event.target.reset();
        document.getElementById('urlMessage').textContent = 'Short link created locally.';
        draw();
      });
      draw();
      return;
    }

    if (variant === 'weather') {
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="weatherForm" class="list"><input name="city" placeholder="Search city" value="London" required><button type="submit">Fetch forecast</button></form><div id="weatherResult" style="margin-top:12px"></div></div><div class="card"><h3>Demo cities</h3><p class="muted">This app uses the free Open-Meteo API with no key.</p><div class="cards" id="cityCards"></div></div></div>');
      const cityCards = document.getElementById('cityCards');
      const weatherResult = document.getElementById('weatherResult');
      const demoCities = ['London', 'Delhi', 'Tokyo', 'New York'];
      cityCards.innerHTML = demoCities.map((city) => '<button data-city="' + city + '">' + city + '</button>').join('');
      async function fetchWeather(city) {
        weatherResult.innerHTML = '<p class="muted">Loading forecast for ' + html(city) + '...</p>';
        try {
          const geo = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city)).then((response) => response.json());
          const place = geo.results && geo.results[0];
          if (!place) throw new Error('City not found');
          const forecast = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + place.latitude + '&longitude=' + place.longitude + '&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto').then((response) => response.json());
          weatherResult.innerHTML = '<article class="card"><strong>' + html(place.name) + '</strong><p class="muted">' + html(place.country) + '</p><div class="stats"><div class="stat"><strong>' + forecast.current.temperature_2m + '°</strong><span>Current</span></div><div class="stat"><strong>' + forecast.current.wind_speed_10m + '</strong><span>Wind</span></div><div class="stat"><strong>' + forecast.daily.temperature_2m_max[0] + '°</strong><span>High</span></div></div></article>';
        } catch (error) {
          weatherResult.innerHTML = '<p class="muted">Unable to fetch live weather: ' + html(error.message) + '</p>';
        }
      }
      document.getElementById('weatherForm').addEventListener('submit', (event) => {
        event.preventDefault();
        fetchWeather(event.target.city.value.trim());
      });
      cityCards.querySelectorAll('[data-city]').forEach((button) => button.addEventListener('click', () => fetchWeather(button.dataset.city)));
      fetchWeather('London');
      return;
    }

    if (variant === 'expense' || variant === 'finance') {
      const transactions = load([]);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="moneyForm" class="list"><input name="label" placeholder="Item / category" required><div class="input-row"><input name="amount" type="number" step="0.01" placeholder="Amount" required><select name="type"><option value="income">Income</option><option value="expense">Expense</option></select></div><button type="submit">Add entry</button></form></div><div class="list" id="moneyList"></div></div>');
      function draw() {
        const balance = transactions.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);
        document.getElementById('moneyList').innerHTML = '<div class="stats"><div class="stat"><strong>' + balance.toFixed(2) + '</strong><span>Balance</span></div><div class="stat"><strong>' + transactions.filter((item) => item.type === 'income').length + '</strong><span>Income items</span></div><div class="stat"><strong>' + transactions.filter((item) => item.type === 'expense').length + '</strong><span>Expense items</span></div></div>' + transactions.map((item) => '<article class="card"><div class="row"><strong>' + html(item.label) + '</strong><span class="pill">' + html(item.type) + '</span></div><p class="muted">' + item.amount.toFixed(2) + '</p></article>').join('');
      }
      document.getElementById('moneyForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        transactions.unshift({ label: data.get('label'), amount: Number(data.get('amount')), type: data.get('type') });
        save(transactions);
        event.target.reset();
        draw();
      });
      draw();
      return;
    }

    if (variant === 'password') {
      const vault = load([]);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="pwdForm" class="list"><input name="label" placeholder="Account label" required><div class="input-row"><input name="length" type="number" min="8" max="32" value="16"><select name="strength"><option value="balanced">Balanced</option><option value="strong">Strong</option><option value="secure">Secure</option></select></div><button type="submit">Generate password</button></form><p id="pwdPreview" class="mini"></p></div><div class="list" id="vaultList"></div></div>');
      function makePassword(length, mode) {
        const sets = {
          balanced: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',
          strong: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*',
          secure: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}',
        };
        const chars = sets[mode] || sets.balanced;
        let value = '';
        for (let index = 0; index < length; index += 1) value += chars[Math.floor(Math.random() * chars.length)];
        return value;
      }
      function draw(password = '') {
        document.getElementById('vaultList').innerHTML = vault.map((item) => '<article class="card"><div class="row"><strong>' + html(item.label) + '</strong><button data-copy="' + html(item.password) + '">Copy</button></div><p class="muted">' + html(item.password) + '</p></article>').join('') || '<p class="muted">No passwords saved yet.</p>';
        document.getElementById('pwdPreview').textContent = password ? 'Generated password: ' + password : '';
        document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => navigator.clipboard.writeText(button.dataset.copy)));
      }
      document.getElementById('pwdForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const password = makePassword(Number(data.get('length')), data.get('strength'));
        vault.unshift({ label: data.get('label'), password });
        save(vault);
        event.target.reset();
        draw(password);
      });
      draw();
      return;
    }

    if (variant === 'newsletter' || variant === 'faq' || variant === 'countdown' || variant === 'clock') {
      if (variant === 'newsletter') {
        const subscribers = load([]);
        renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="newsletterForm" class="list"><input name="email" type="email" placeholder="Email address" required><button type="submit">Subscribe</button></form><p id="newsletterMsg" class="mini"></p></div><div class="list" id="subscribers"></div></div>');
        function draw() {
          document.getElementById('subscribers').innerHTML = subscribers.map((item) => '<article class="card"><strong>' + html(item.email) + '</strong></article>').join('') || '<p class="muted">No subscribers yet.</p>';
        }
        document.getElementById('newsletterForm').addEventListener('submit', (event) => {
          event.preventDefault();
          const email = event.target.email.value.trim();
          subscribers.unshift({ email });
          save(subscribers);
          event.target.reset();
          document.getElementById('newsletterMsg').textContent = 'Subscription stored locally.';
          draw();
        });
        draw();
        return;
      }
      if (variant === 'faq') {
        const faq = config.faq || [
          { question: 'How does it work?', answer: 'Type a question and filter the answers instantly.' },
          { question: 'Can I add entries?', answer: 'Yes. This demo keeps your FAQ data in the browser.' },
          { question: 'Is it responsive?', answer: 'Yes. The layout adapts to smaller screens.' }
        ];
        renderPage('<h2>' + html(config.title) + '</h2><div class="card"><input id="faqSearch" placeholder="Search FAQ"></div><div class="list" id="faqList" style="margin-top:12px"></div>');
        function draw(text) {
          document.getElementById('faqList').innerHTML = faq.filter((item) => (item.question + item.answer).toLowerCase().includes(text.toLowerCase())).map((item, index) => '<article class="card"><button class="secondary" data-faq="' + index + '" style="width:100%;justify-content:space-between"><span>' + html(item.question) + '</span><span>+</span></button><p class="muted hidden" id="faq-' + index + '">' + html(item.answer) + '</p></article>').join('') || '<p class="muted">No matches found.</p>';
          document.querySelectorAll('[data-faq]').forEach((button) => button.addEventListener('click', () => {
            const answer = document.getElementById('faq-' + button.dataset.faq);
            answer.classList.toggle('hidden');
          }));
        }
        document.getElementById('faqSearch').addEventListener('input', (event) => draw(event.target.value));
        draw('');
        return;
      }
      if (variant === 'countdown') {
        renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="countdownForm" class="list"><input name="target" type="datetime-local" required><input name="label" placeholder="Event title" value="Launch day"><button type="submit">Start countdown</button></form></div><div class="cards" id="countdownView"></div></div>');
        let timer = null;
        function draw(target, label) {
          clearInterval(timer);
          const view = document.getElementById('countdownView');
          function tick() {
            const diff = new Date(target) - new Date();
            if (diff <= 0) {
              view.innerHTML = '<article class="card"><strong>' + html(label) + '</strong><p class="muted">Event started.</p></article>';
              clearInterval(timer);
              return;
            }
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            view.innerHTML = '<article class="card"><strong>' + html(label) + '</strong><div class="stats"><div class="stat"><strong>' + days + '</strong><span>Days</span></div><div class="stat"><strong>' + hours + '</strong><span>Hours</span></div><div class="stat"><strong>' + minutes + '</strong><span>Minutes</span></div><div class="stat"><strong>' + seconds + '</strong><span>Seconds</span></div></div></article>';
          }
          tick();
          timer = setInterval(tick, 1000);
        }
        document.getElementById('countdownForm').addEventListener('submit', (event) => {
          event.preventDefault();
          draw(event.target.target.value, event.target.label.value);
        });
        draw(new Date(Date.now() + 86400000).toISOString().slice(0, 16), 'Launch day');
        return;
      }
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><div class="pill">Live clock</div><h3 id="clockTime">--:--:--</h3><p class="muted" id="clockDate"></p><form id="alarmForm" class="list"><input type="time" name="alarm"><button type="submit">Set alarm</button></form><p id="alarmStatus" class="mini"></p></div><div class="card"><h3>Clock features</h3><ul class="muted"><li>12/24-hour digital clock</li><li>Simple browser alarm</li><li>Local reminder support</li></ul></div></div>');
      const clockTime = document.getElementById('clockTime');
      const clockDate = document.getElementById('clockDate');
      const alarmStatus = document.getElementById('alarmStatus');
      let alarm = null;
      setInterval(() => {
        const now = new Date();
        clockTime.textContent = now.toLocaleTimeString();
        clockDate.textContent = now.toDateString();
        if (alarm && now.getHours() === alarm.hours && now.getMinutes() === alarm.minutes && now.getSeconds() < 5) {
          alarmStatus.textContent = 'Alarm time reached.';
          alarm = null;
        }
      }, 1000);
      document.getElementById('alarmForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const value = event.target.alarm.value.split(':');
        alarm = { hours: Number(value[0]), minutes: Number(value[1]) };
        alarmStatus.textContent = 'Alarm set for ' + event.target.alarm.value;
      });
      return;
    }

    if (variant === 'upload' || variant === 'gallery' || variant === 'compressor' || variant === 'pdfMerger') {
      if (variant === 'compressor') {
        renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="imageInput" accept="image/*"><div class="input-row" style="margin-top:12px"><input type="range" id="qualityRange" min="0.2" max="1" step="0.1" value="0.7"><button id="compressBtn">Compress</button></div><p class="mini" id="compressStatus"></p></div><div class="card"><canvas id="canvas" class="hidden"></canvas><img id="preview" alt="Preview" style="width:100%;border-radius:18px"></div></div>');
        const input = document.getElementById('imageInput');
        const preview = document.getElementById('preview');
        const status = document.getElementById('compressStatus');
        const canvas = document.getElementById('canvas');
        let file = null;
        input.addEventListener('change', () => {
          file = input.files[0];
          if (file) preview.src = URL.createObjectURL(file);
        });
        document.getElementById('compressBtn').addEventListener('click', async () => {
          if (!file) {
            status.textContent = 'Choose an image first.';
            return;
          }
          const bitmap = await createImageBitmap(file);
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const context = canvas.getContext('2d');
          context.drawImage(bitmap, 0, 0);
          canvas.toBlob((blob) => {
            preview.src = URL.createObjectURL(blob);
            status.textContent = 'Compressed to ' + Math.round(blob.size / 1024) + ' KB';
          }, 'image/jpeg', Number(document.getElementById('qualityRange').value));
        });
        return;
      }

      if (variant === 'pdfMerger') {
        renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="pdfInput" accept="application/pdf" multiple><button id="mergeBtn" style="margin-top:12px">Merge PDFs</button><p id="pdfStatus" class="mini"></p></div><div class="list" id="pdfList"></div></div>');
        const selected = [];
        const list = document.getElementById('pdfList');
        const status = document.getElementById('pdfStatus');
        document.getElementById('pdfInput').addEventListener('change', (event) => {
          selected.length = 0;
          selected.push(...event.target.files);
          list.innerHTML = selected.map((file) => '<article class="card"><strong>' + html(file.name) + '</strong><p class="muted">' + Math.round(file.size / 1024) + ' KB</p></article>').join('') || '<p class="muted">Choose two or more PDF files.</p>';
        });
        document.getElementById('mergeBtn').addEventListener('click', async () => {
          if (selected.length < 2) {
            status.textContent = 'Select two or more PDF files.';
            return;
          }
          if (!window.PDFLib) {
            status.textContent = 'PDFLib is not available in this browser preview.';
            return;
          }
          const merged = await PDFLib.PDFDocument.create();
          for (const file of selected) {
            const bytes = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(bytes);
            const copied = await merged.copyPages(pdf, pdf.getPageIndices());
            copied.forEach((page) => merged.addPage(page));
          }
          const bytes = await merged.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'merged.pdf';
          link.click();
          status.textContent = 'Merged PDF downloaded.';
        });
        return;
      }

      const uploads = load([]);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="galleryInput" multiple accept="image/*"><p class="mini">Upload images to build a gallery.</p></div><div class="cards" id="galleryList"></div></div>');
      function draw() {
        document.getElementById('galleryList').innerHTML = uploads.map((item) => '<article class="card"><img src="' + item.src + '" alt="' + html(item.name) + '" style="width:100%;border-radius:16px"><p class="muted">' + html(item.name) + '</p></article>').join('') || '<p class="muted">No images yet.</p>';
      }
      document.getElementById('galleryInput').addEventListener('change', (event) => {
        Array.from(event.target.files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            uploads.unshift({ name: file.name, src: reader.result });
            save(uploads);
            draw();
          };
          reader.readAsDataURL(file);
        });
      });
      draw();
      return;
    }

    if (variant === 'chat' || variant === 'forum' || variant === 'notice') {
      const messages = load(config.seedItems || []);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="messageForm" class="list"><input name="author" placeholder="Name" required><textarea name="message" placeholder="Write a post" required></textarea><button type="submit">Publish</button></form></div><div class="list" id="messageList"></div></div>');
      function draw() {
        document.getElementById('messageList').innerHTML = messages.map((item) => '<article class="' + (variant === 'notice' ? 'notice' : 'card') + '"><div class="row"><strong>' + html(item.author) + '</strong><span class="mini">' + new Date(item.time).toLocaleString() + '</span></div><p class="muted">' + html(item.message) + '</p></article>').join('') || '<p class="muted">No posts yet.</p>';
      }
      document.getElementById('messageForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        messages.unshift({ author: data.get('author'), message: data.get('message'), time: Date.now() });
        save(messages);
        event.target.reset();
        draw();
      });
      draw();
      return;
    }

    if (variant === 'tasks') {
      const columns = load({ todo: ['Research', 'Wireframe'], doing: ['Implement'], done: ['Launch'] });
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="taskForm" class="list"><input name="task" placeholder="Task name" required><select name="column"><option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option></select><button type="submit">Add task</button></form></div><div class="board-columns" id="board"></div></div>');
      function draw() {
        document.getElementById('board').innerHTML = ['todo', 'doing', 'done'].map((column) => '<section class="column"><h3>' + column.toUpperCase() + '</h3>' + columns[column].map((task, index) => '<article class="card"><div class="row"><span>' + html(task) + '</span><button data-move="' + column + ':' + index + '">Move</button></div></article>').join('') + '</section>').join('');
        document.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', () => {
          const [source, indexText] = button.dataset.move.split(':');
          const next = source === 'todo' ? 'doing' : source === 'doing' ? 'done' : 'todo';
          const [task] = columns[source].splice(Number(indexText), 1);
          columns[next].push(task);
          save(columns);
          draw();
        }));
      }
      document.getElementById('taskForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        columns[data.get('column')].unshift(data.get('task'));
        save(columns);
        event.target.reset();
        draw();
      });
      draw();
      return;
    }

    if (variant === 'blog' || variant === 'blogCMS' || variant === 'resume' || variant === 'companyAdmin') {
      const posts = load(config.seedItems || []);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="postForm" class="list"><input name="title" placeholder="Title" required><textarea name="body" placeholder="Write content" required></textarea><button type="submit">Publish</button></form></div><div class="list" id="postList"></div></div>');
      function draw() {
        document.getElementById('postList').innerHTML = posts.map((post) => '<article class="card"><div class="row"><strong>' + html(post.title) + '</strong><button data-delete="' + post.id + '">Delete</button></div><p class="muted">' + html(post.body) + '</p></article>').join('') || '<p class="muted">Publish your first post.</p>';
        document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => {
          const index = posts.findIndex((post) => post.id === button.dataset.delete);
          if (index >= 0) posts.splice(index, 1);
          save(posts);
          draw();
        }));
      }
      document.getElementById('postForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        posts.unshift({ id: uid(), title: data.get('title'), body: data.get('body') });
        save(posts);
        event.target.reset();
        draw();
      });
      draw();
      return;
    }

    renderCrud();
  }

  function renderStore() {
    const cart = load([]);
    const products = config.products || [
      { name: 'Starter Item', price: 19, tag: 'Popular' },
      { name: 'Premium Item', price: 39, tag: 'New' },
      { name: 'Bundle Item', price: 59, tag: 'Value' }
    ];
    renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="cards" id="productList"></div><aside class="card"><h3>Cart</h3><div id="cartList"></div><div class="stats" style="margin-top:12px"><div class="stat"><strong id="cartTotal">0</strong><span>Total</span></div><div class="stat"><strong id="cartCount">0</strong><span>Items</span></div></div></aside></div>');
    function draw() {
      document.getElementById('productList').innerHTML = products.map((product, index) => '<article class="card"><div class="row"><strong>' + html(product.name) + '</strong><span class="pill">' + html(product.tag || 'Item') + '</span></div><p class="muted">$' + Number(product.price).toFixed(2) + '</p><button data-add="' + index + '">Add to cart</button></article>').join('');
      document.getElementById('cartList').innerHTML = cart.map((item) => '<article class="card"><div class="row"><span>' + html(item.name) + '</span><strong>$' + Number(item.price).toFixed(2) + '</strong></div></article>').join('') || '<p class="muted">Your cart is empty.</p>';
      const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
      document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
      document.getElementById('cartCount').textContent = String(cart.length);
      document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => {
        cart.unshift(products[Number(button.dataset.add)]);
        save(cart);
        draw();
      }));
    }
    draw();
  }

  function renderCalendar() {
    const items = load(config.seedItems || []);
    renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="calendarForm" class="list"><input name="title" placeholder="Title" required><input name="date" type="date" required><textarea name="notes" placeholder="Notes"></textarea><button type="submit">Save event</button></form></div><div class="list" id="calendarList"></div></div>');
    function draw() {
      document.getElementById('calendarList').innerHTML = items.map((item) => '<article class="card"><div class="row"><strong>' + html(item.title) + '</strong><span class="pill">' + html(item.date) + '</span></div><p class="muted">' + html(item.notes || '') + '</p></article>').join('') || '<p class="muted">No events yet.</p>';
    }
    document.getElementById('calendarForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      items.unshift({ title: data.get('title'), date: data.get('date'), notes: data.get('notes') });
      save(items);
      event.target.reset();
      draw();
    });
    draw();
  }

  function renderDashboard() {
    const entries = load(config.seedItems || []);
    renderPage('<h2>' + html(config.title) + '</h2><div class="stats"><div class="stat"><strong>' + entries.length + '</strong><span>Records</span></div><div class="stat"><strong>92%</strong><span>Activity</span></div><div class="stat"><strong>4.8</strong><span>Rating</span></div></div><div class="split" style="margin-top:16px"><div class="card"><form id="dashboardForm" class="list"><input name="title" placeholder="Item title" required><textarea name="body" placeholder="Description" required></textarea><button type="submit">Add row</button></form></div><div class="list" id="dashboardList"></div></div>');
    function draw() {
      document.getElementById('dashboardList').innerHTML = entries.map((item) => '<article class="card"><div class="row"><strong>' + html(item.title) + '</strong><button data-remove="' + item.id + '">Delete</button></div><p class="muted">' + html(item.body) + '</p></article>').join('') || '<p class="muted">No data yet.</p>';
      document.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
        const index = entries.findIndex((item) => item.id === button.dataset.remove);
        if (index >= 0) entries.splice(index, 1);
        save(entries);
        draw();
      }));
    }
    document.getElementById('dashboardForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      entries.unshift({ id: uid(), title: data.get('title'), body: data.get('body') });
      save(entries);
      event.target.reset();
      draw();
    });
    draw();
  }

  function renderKanban() {
    const columns = load({ todo: ['Research', 'Wireframe'], doing: ['Implement'], done: ['Launch'] });
    renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="kanbanForm" class="list"><input name="task" placeholder="Task name" required><select name="column"><option value="todo">To do</option><option value="doing">Doing</option><option value="done">Done</option></select><button type="submit">Add task</button></form></div><div class="board-columns" id="kanbanBoard"></div></div>');
    function draw() {
      document.getElementById('kanbanBoard').innerHTML = ['todo', 'doing', 'done'].map((column) => '<section class="column"><h3>' + column.toUpperCase() + '</h3>' + columns[column].map((task, index) => '<article class="card"><div class="row"><span>' + html(task) + '</span><button data-move="' + column + ':' + index + '">Move</button></div></article>').join('') + '</section>').join('');
      document.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', () => {
        const [source, indexText] = button.dataset.move.split(':');
        const next = source === 'todo' ? 'doing' : source === 'doing' ? 'done' : 'todo';
        const [task] = columns[source].splice(Number(indexText), 1);
        columns[next].push(task);
        save(columns);
        draw();
      }));
    }
    document.getElementById('kanbanForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      columns[data.get('column')].unshift(data.get('task'));
      save(columns);
      event.target.reset();
      draw();
    });
    draw();
  }

  function renderBoard() {
    const messages = load(config.seedItems || []);
    renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><form id="boardForm" class="list"><input name="author" placeholder="Name" required><textarea name="message" placeholder="Write a post" required></textarea><button type="submit">Publish</button></form></div><div class="list" id="boardList"></div></div>');
    function draw() {
      document.getElementById('boardList').innerHTML = messages.map((item) => '<article class="' + (config.variant === 'notice' ? 'notice' : 'card') + '"><div class="row"><strong>' + html(item.author) + '</strong><span class="mini">' + new Date(item.time).toLocaleString() + '</span></div><p class="muted">' + html(item.message) + '</p></article>').join('') || '<p class="muted">No posts yet.</p>';
    }
    document.getElementById('boardForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      messages.unshift({ author: data.get('author'), message: data.get('message'), time: Date.now() });
      save(messages);
      event.target.reset();
      draw();
    });
    draw();
  }

  function renderMedia() {
    if (config.variant === 'upload') {
      const uploads = load([]);
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="uploadInput" multiple><p class="mini">Upload any file types and keep the list locally.</p></div><div class="list" id="uploadList"></div></div>');
      function draw() {
        document.getElementById('uploadList').innerHTML = uploads.map((file) => '<article class="card"><strong>' + html(file.name) + '</strong><p class="muted">' + html(file.type || 'file') + ' • ' + Math.round(file.size / 1024) + ' KB</p></article>').join('') || '<p class="muted">No uploads yet.</p>';
      }
      document.getElementById('uploadInput').addEventListener('change', (event) => {
        uploads.push(...Array.from(event.target.files).map((file) => ({ name: file.name, type: file.type, size: file.size })));
        save(uploads);
        draw();
      });
      draw();
      return;
    }

    if (config.variant === 'compressor') {
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="imageInput" accept="image/*"><div class="input-row" style="margin-top:12px"><input type="range" id="qualityRange" min="0.2" max="1" step="0.1" value="0.7"><button id="compressBtn">Compress</button></div><p class="mini" id="compressStatus"></p></div><div class="card"><canvas id="canvas" class="hidden"></canvas><img id="preview" alt="Preview" style="width:100%;border-radius:18px"></div></div>');
      const input = document.getElementById('imageInput');
      const preview = document.getElementById('preview');
      const status = document.getElementById('compressStatus');
      const canvas = document.getElementById('canvas');
      let file = null;
      input.addEventListener('change', () => {
        file = input.files[0];
        if (file) preview.src = URL.createObjectURL(file);
      });
      document.getElementById('compressBtn').addEventListener('click', async () => {
        if (!file) {
          status.textContent = 'Choose an image first.';
          return;
        }
        const bitmap = await createImageBitmap(file);
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        canvas.toBlob((blob) => {
          preview.src = URL.createObjectURL(blob);
          status.textContent = 'Compressed to ' + Math.round(blob.size / 1024) + ' KB';
        }, 'image/jpeg', Number(document.getElementById('qualityRange').value));
      });
      return;
    }

    if (config.variant === 'pdfMerger') {
      renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="pdfInput" accept="application/pdf" multiple><button id="mergeBtn" style="margin-top:12px">Merge PDFs</button><p id="pdfStatus" class="mini"></p></div><div class="list" id="pdfList"></div></div>');
      const selected = [];
      const list = document.getElementById('pdfList');
      const status = document.getElementById('pdfStatus');
      document.getElementById('pdfInput').addEventListener('change', (event) => {
        selected.length = 0;
        selected.push(...event.target.files);
        list.innerHTML = selected.map((file) => '<article class="card"><strong>' + html(file.name) + '</strong><p class="muted">' + Math.round(file.size / 1024) + ' KB</p></article>').join('') || '<p class="muted">Choose two or more PDF files.</p>';
      });
      document.getElementById('mergeBtn').addEventListener('click', async () => {
        if (selected.length < 2) {
          status.textContent = 'Select two or more PDF files.';
          return;
        }
        if (!window.PDFLib) {
          status.textContent = 'PDFLib is not available in this browser preview.';
          return;
        }
        const merged = await PDFLib.PDFDocument.create();
        for (const file of selected) {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFLib.PDFDocument.load(bytes);
          const copied = await merged.copyPages(pdf, pdf.getPageIndices());
          copied.forEach((page) => merged.addPage(page));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged.pdf';
        link.click();
        status.textContent = 'Merged PDF downloaded.';
      });
      return;
    }

    const uploads = load([]);
    renderPage('<h2>' + html(config.title) + '</h2><div class="split"><div class="card"><input type="file" id="galleryInput" multiple accept="image/*"><p class="mini">Upload images to build a gallery.</p></div><div class="cards" id="galleryList"></div></div>');
    function draw() {
      document.getElementById('galleryList').innerHTML = uploads.map((item) => '<article class="card"><img src="' + item.src + '" alt="' + html(item.name) + '" style="width:100%;border-radius:16px"><p class="muted">' + html(item.name) + '</p></article>').join('') || '<p class="muted">No images yet.</p>';
    }
    document.getElementById('galleryInput').addEventListener('change', (event) => {
      Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          uploads.unshift({ name: file.name, src: reader.result });
          save(uploads);
          draw();
        };
        reader.readAsDataURL(file);
      });
    });
    draw();
  }

  initTopControls();
  renderWidgetZone();

  switch (config.mode) {
    case 'hero': return renderHero();
    case 'crud': return renderCrud();
    case 'quiz': return renderQuiz();
    case 'utility': return renderUtility();
    case 'store': return renderStore();
    case 'calendar': return renderCalendar();
    case 'board': return renderBoard();
    case 'dashboard': return renderDashboard();
    case 'kanban': return renderKanban();
    case 'media': return renderMedia();
    default: return renderHero();
  }
})();
`;

function makeSeedItems(variant) {
  switch (variant) {
    case 'notes':
      return [
        { title: 'Design sprint', detail: 'Plan the landing page sections and copy.' },
        { title: 'JavaScript checklist', detail: 'Build add, remove, and search actions.' }
      ];
    case 'todoLogin':
      return [
        { title: 'Morning login', detail: 'Demo sign-in gate before task board.' },
        { title: 'Push release', detail: 'Ship the weekly task list update.' }
      ];
    case 'contacts':
      return [
        { title: 'Ava Stone', detail: 'Marketing • ava@example.com' },
        { title: 'Noah Patel', detail: 'Sales • noah@example.com' }
      ];
    case 'diary':
      return [
        { title: 'April 11', detail: 'Started the new project dashboard.' },
        { title: 'April 12', detail: 'Refined the color system and cards.' }
      ];
    case 'complaint':
      return [
        { title: 'Water leak', detail: 'Under review by maintenance team.' },
        { title: 'Wi-Fi issue', detail: 'Assigned to support desk.' }
      ];
    case 'attendance':
      return [
        { title: 'Design class', detail: 'Present • 24 students' },
        { title: 'Computer lab', detail: 'Absent • 2 students' }
      ];
    case 'results':
      return [
        { title: 'Student A', detail: '85% • A grade' },
        { title: 'Student B', detail: '72% • B grade' }
      ];
    case 'blood':
      return [
        { title: 'O+ donor', detail: 'Available in city center' },
        { title: 'A- donor', detail: 'Last donated 4 months ago' }
      ];
    case 'address':
      return [
        { title: 'Main office', detail: '12 River Street, London' },
        { title: 'Branch office', detail: '88 Market Road, Delhi' }
      ];
    case 'planner':
      return [
        { title: '08:00', detail: 'Workout and breakfast.' },
        { title: '14:00', detail: 'Project review meeting.' }
      ];
    case 'blogCMS':
      return [
        { id: '1', title: 'Launching the CMS blog', body: 'A short update on the editorial workflow.' },
        { id: '2', title: 'Content strategy', body: 'How to plan articles and site sections.' }
      ];
    case 'resume':
      return [
        { id: '1', title: 'Frontend Developer', body: 'HTML, CSS, JavaScript, and UI systems.' },
        { id: '2', title: 'Projects', body: 'Portfolio, dashboard, and utility app builds.' }
      ];
    case 'companyAdmin':
      return [
        { id: '1', title: 'Weekly revenue', body: 'Track performance and pending tasks.' },
        { id: '2', title: 'Admin updates', body: 'Review users, orders, and announcements.' }
      ];
    default:
      return [
        { title: 'Starter item', detail: 'Replace this with your own data.' },
        { title: 'Second item', detail: 'Local storage keeps the demo interactive.' }
      ];
  }
}

function makeFields(variant) {
  switch (variant) {
    case 'contacts': return [{ name: 'name', label: 'Name' }, { name: 'detail', label: 'Role and email' }];
    case 'complaint': return [{ name: 'title', label: 'Complaint title' }, { name: 'detail', label: 'Description' }];
    case 'attendance': return [{ name: 'title', label: 'Class name' }, { name: 'detail', label: 'Present / Absent stats' }];
    case 'results': return [{ name: 'title', label: 'Student name' }, { name: 'detail', label: 'Score and grade' }];
    case 'blood': return [{ name: 'title', label: 'Blood group' }, { name: 'detail', label: 'Availability' }];
    case 'address': return [{ name: 'title', label: 'Contact name' }, { name: 'detail', label: 'Address' }];
    case 'planner': return [{ name: 'title', label: 'Time slot' }, { name: 'detail', label: 'Task notes' }];
    default: return [{ name: 'title', label: 'Title' }, { name: 'detail', label: 'Details' }];
  }
}

function makeFeatures(variant) {
  const map = {
    portfolio: [
      { label: 'Profile', title: 'About me', text: 'A polished personal website with skills, projects, and contact form.' },
      { label: 'Work', title: 'Featured projects', text: 'Showcase cards with responsive spacing and bold typography.' },
      { label: 'Contact', title: 'Get in touch', text: 'A quick form for messages and lead capture.' }
    ],
    library: [
      { label: 'Search', title: 'Find books quickly', text: 'Filter books, add favorites, and manage the reading shelf.' },
      { label: 'Reads', title: 'Curated categories', text: 'Build a clean library experience with browsing sections.' }
    ],
    jobs: [
      { label: 'Roles', title: 'Browse openings', text: 'A job board style landing page with application actions.' },
      { label: 'Apply', title: 'Candidate form', text: 'Capture applicant details and keep them in the browser.' }
    ],
    menu: [
      { label: 'Cuisine', title: 'Filter menu items', text: 'Switch categories and make the restaurant menu interactive.' },
      { label: 'Order', title: 'Featured plates', text: 'Present dishes with prices and a modern card layout.' }
    ],
    course: [
      { label: 'Enroll', title: 'Course cards', text: 'Display programs, seat counts, and an enrollment form.' },
      { label: 'Plan', title: 'Learning paths', text: 'Organize offerings into a clear educational hub.' }
    ],
    club: [
      { label: 'Members', title: 'Community updates', text: 'Membership actions, event cards, and sign-up flow.' },
      { label: 'Events', title: 'Club activities', text: 'Promote meetings and announcements in a clean layout.' }
    ],
    learning: [
      { label: 'Resources', title: 'Study library', text: 'A resource hub with topic cards and bookmarks.' },
      { label: 'Plan', title: 'Track progress', text: 'Guide users through lessons, notes, and weekly goals.' }
    ],
  };
  return map[variant] || [
    { label: 'Feature', title: 'Interactive UI', text: 'Built with reusable components and local browser storage.' },
    { label: 'Layout', title: 'Responsive sections', text: 'Adaptive grids and panels for desktop and mobile.' },
    { label: 'Data', title: 'Live interaction', text: 'Forms, lists, searches, counters, and saved state.' }
  ];
}

function makeQuestions(variant) {
  if (variant === 'quiz') {
    return [
      { question: 'Which tag is used for navigation links?', options: ['nav', 'section', 'footer', 'aside'], answer: 0 },
      { question: 'What stores browser data locally?', options: ['sessionStorage', 'localStorage', 'history', 'cache'], answer: 1 },
      { question: 'Which method renders JSON to text?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.fetch()', 'JSON.write()'], answer: 1 }
    ];
  }
  if (variant === 'survey') {
    return [
      { question: 'Which feature should improve first?', options: ['Speed', 'Design', 'Forms', 'Reports'], answer: 0 },
      { question: 'How often should updates ship?', options: ['Weekly', 'Monthly', 'Quarterly', 'On demand'], answer: 0 },
      { question: 'What matters most in a demo?', options: ['Clarity', 'Complexity', 'Noise', 'Randomness'], answer: 0 }
    ];
  }
  if (variant === 'vote' || variant === 'poll' || variant === 'pollDash') {
    return [{ question: 'Which option wins the poll?', options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0 }];
  }
  return [
    { question: 'What is the main purpose?', options: ['Track records', 'Store files', 'Show cards', 'All of the above'], answer: 3 },
    { question: 'Which feature should be fastest?', options: ['Search', 'Form submit', 'Navigation', 'Charts'], answer: 0 },
    { question: 'How are updates stored?', options: ['Browser storage', 'Email only', 'Hard reset', 'Manual notes'], answer: 0 }
  ];
}

function makeProducts(variant) {
  if (variant === 'reviews') {
    return [
      { name: 'Studio headphones', price: 99, tag: '4.8★' },
      { name: 'Noise-cancel earbuds', price: 149, tag: '4.7★' },
      { name: 'USB microphone', price: 79, tag: '4.6★' }
    ];
  }
  return [
    { name: 'Starter item', price: 19, tag: 'Popular' },
    { name: 'Premium item', price: 39, tag: 'New' },
    { name: 'Bundle item', price: 59, tag: 'Value' }
  ];
}

function buildHtml(project) {
  const bodyAttrs = `style="--accent:${project.accent}; --accent-soft: color-mix(in srgb, ${project.accent} 15%, white);"`;
  const extraScript = project.variant === 'pdfMerger' ? '<script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>' : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.number}. ${project.name}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body ${bodyAttrs}>
  <main class="shell">
    <header class="topbar">
      <div class="left">
        <span class="chip">Project ${project.number}</span>
        <span class="chip">${project.mode.toUpperCase()} page</span>
        <span class="chip">${project.layout} layout</span>
      </div>
      <div class="right">
        <button id="themeToggle" class="chip" type="button">Theme</button>
        ${project.accentSet.map((color) => `<button class="dot" data-accent="${color}" style="background:${color}" title="${color}" type="button"></button>`).join('')}
      </div>
    </header>
    <section class="hero layout-${project.layout}">
      <p class="eyebrow">Project ${project.number}</p>
      <h1>${project.name}</h1>
      <p>${project.summary}</p>
      <div class="actions">
        <button id="heroPrimary">Open demo</button>
        <button id="heroSecondary" class="secondary">Save state</button>
      </div>
    </section>
    <section id="app" style="margin-top:18px"></section>
    <section id="widgetZone" class="panel" style="margin-top:18px"></section>
  </main>
  <script>
    window.PROJECT_CONFIG = ${JSON.stringify({
      ...project,
      summary: undefined,
      fields: makeFields(project.variant),
      features: makeFeatures(project.variant),
      seedItems: makeSeedItems(project.variant),
      questions: makeQuestions(project.variant),
      products: makeProducts(project.variant),
      primaryAction: 'Open ' + project.name,
      secondaryAction: 'Save ' + project.name,
      subtitle: project.summary,
      title: project.name,
    })};
  </script>
  ${extraScript}
  <script src="script.js"></script>
</body>
</html>`;
}

function buildSummary(project) {
  const messages = {
    hero: 'A polished content site with sections, features, and a capture form.',
    dashboard: 'A browser-driven dashboard with create, delete, and reporting flows.',
    crud: 'A data manager with add, search, and remove controls.',
    calendar: 'A scheduling view with date-based entries and registration flow.',
    store: 'A catalog site with cards, cart actions, and reviews.',
    quiz: 'An interactive quiz or poll board with live scoring.',
    utility: 'A focused utility with browser-only tools such as links, weather, or countdowns.',
    media: 'A file-focused experience for uploads, galleries, compression, or PDF tools.',
    board: 'A posting or discussion board with local persistence.',
    kanban: 'A task board with move actions and persistence.',
  };
  return `${messages[project.mode]} Built for ${project.name}.`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const project of generatedProjects) {
  const folderName = `${project.number}. ${project.name}`;
  const folderPath = path.join(rootDir, folderName);
  ensureDir(folderPath);
  fs.writeFileSync(path.join(folderPath, 'index.html'), buildHtml({ ...project, summary: buildSummary(project) }), 'utf8');
  fs.writeFileSync(path.join(folderPath, 'style.css'), sharedCss, 'utf8');
  fs.writeFileSync(path.join(folderPath, 'script.js'), sharedJs, 'utf8');
}

console.log(`Created ${generatedProjects.length} project folders.`);