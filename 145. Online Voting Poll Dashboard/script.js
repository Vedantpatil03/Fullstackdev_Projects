(() => {
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
