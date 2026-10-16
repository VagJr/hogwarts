(() => {
  'use strict';

  const TOKEN_KEY = 'hogwarts_session_v2';
  const LEGACY_ID_KEY = 'hogwarts_id';
  const originalFetch = window.fetch.bind(window);

  const houseClass = value => String(value || 'nenhuma')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  function token() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function safe(value) {
    return String(value ?? '');
  }

  window.fetch = async function productFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined) || {});
    const session = token();

    if (session && url.startsWith('/api/')) headers.set('X-Hogwarts-Session', session);

    const response = await originalFetch(input, { ...init, headers });

    if (url.includes('/api/registrar')) {
      try {
        const payload = await response.clone().json();
        if (payload?.sessionToken) localStorage.setItem(TOKEN_KEY, payload.sessionToken);
      } catch (_) {}
    }

    if (response.status === 401 && url.startsWith('/api/') && !url.includes('/api/registrar')) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_ID_KEY);
      window.dispatchEvent(new CustomEvent('hogwarts:session-expired'));
    }

    return response;
  };

  function wrapSocket() {
    try {
      if (typeof socket === 'undefined' || !socket?.emit || socket.__productV2Wrapped) return;
      socket.__productV2Wrapped = true;
      const raw = socket.emit.bind(socket);

      socket.emit = function(event, data, ...rest) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
        const session = token();
        if (session) data.token = session;
        return raw(event, data, ...rest);
      };

      if (token()) {
        socket.auth = { ...(socket.auth || {}), token: token() };
      }

      socket.on?.('connect', () => setConnection(true));
      socket.on?.('disconnect', () => setConnection(false));
      socket.on?.('connect_error', err => {
        setConnection(false, String(err?.message || '').includes('AUTH') ? 'Sessão' : 'Reconectando');
      });
    } catch (_) {}
  }

  function setConnection(ok, label = '') {
    const el = document.getElementById('hg2-connection');
    if (!el) return;
    el.dataset.online = ok ? 'true' : 'false';
    el.textContent = ok ? 'Online' : (label || 'Reconectando');
  }

  function clickByText(query) {
    const q = query.toLowerCase();
    const all = [...document.querySelectorAll('button, a')];
    const visible = all.find(el => el.offsetParent !== null && safe(el.textContent).toLowerCase().includes(q));
    const fallback = all.find(el => safe(el.textContent).toLowerCase().includes(q));
    (visible || fallback)?.click();
  }

  function createShell() {
    if (document.getElementById('hg2-shell')) return;

    const shell = document.createElement('div');
    shell.id = 'hg2-shell';
    shell.innerHTML = `
      <header id="hg2-command">
        <div class="hg2-brand">
          <span class="hg2-crest">H</span>
          <span class="hg2-brand-copy"><b>HOGWARTS ONLINE</b><small>VIDA NO CASTELO</small></span>
        </div>

        <div class="hg2-objective">
          <span id="hg2-objective-icon" class="hg2-objective-icon">✦</span>
          <div>
            <small>AGORA EM HOGWARTS</small>
            <b id="hg2-objective-title">A carregar o teu próximo passo...</b>
            <span id="hg2-objective-detail"></span>
          </div>
        </div>

        <div class="hg2-status">
          <span class="hg2-chip" id="hg2-class">Tempo livre</span>
          <span class="hg2-chip" id="hg2-house">Sem Casa</span>
          <span class="hg2-chip" id="hg2-connection" data-online="false">Ligando</span>
        </div>
      </header>

      <aside id="hg2-journey">
        <button id="hg2-journey-toggle" aria-expanded="false">✦ Diário vivo</button>
        <section id="hg2-journey-panel" hidden>
          <div class="hg2-journey-head">
            <div><small>RITMO DO DIA</small><b>Vida em Hogwarts</b></div>
            <span id="hg2-needs">100% / 100%</span>
          </div>
          <div id="hg2-loop"></div>
          <div id="hg2-diary-mini"></div>
        </section>
      </aside>

      <nav id="hg2-mobile-dock" aria-label="Navegação principal">
        <button data-go="Locais"><span>🗺️</span><small>Explorar</small></button>
        <button data-go="Salas de Aula"><span>🎓</span><small>Aulas</small></button>
        <button data-go="Mochila"><span>🎒</span><small>Mochila</small></button>
        <button data-go="Diário"><span>📜</span><small>Diário</small></button>
        <button data-go="Dormitório"><span>🛏️</span><small>Vida</small></button>
      </nav>
    `;
    document.body.appendChild(shell);

    document.getElementById('hg2-mobile-dock')?.addEventListener('click', e => {
      const button = e.target.closest('button[data-go]');
      if (button) clickByText(button.dataset.go);
    });

    document.getElementById('hg2-journey-toggle')?.addEventListener('click', e => {
      const panel = document.getElementById('hg2-journey-panel');
      const open = panel.hasAttribute('hidden');
      panel.toggleAttribute('hidden', !open);
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });
  }

  function renderLoop(items = []) {
    const host = document.getElementById('hg2-loop');
    if (!host) return;
    host.replaceChildren(...items.map((item, index) => {
      const div = document.createElement('div');
      div.className = 'hg2-loop-step';
      div.innerHTML = `<i>${index + 1}</i><span><b></b><small></small></span>`;
      div.querySelector('b').textContent = item.label || '';
      div.querySelector('small').textContent = item.hint || '';
      return div;
    }));
  }

  function renderDiary(diary) {
    const host = document.getElementById('hg2-diary-mini');
    if (!host) return;
    host.replaceChildren();

    const title = document.createElement('div');
    title.className = 'hg2-diary-title';
    title.textContent = 'Diário do Maroto';
    host.appendChild(title);

    const tasks = diary?.tarefas || [];
    for (const task of tasks.slice(0, 5)) {
      const row = document.createElement('div');
      row.className = 'hg2-task';
      if (task.concluida) row.dataset.done = 'true';

      const name = document.createElement('span');
      name.textContent = `${task.icone || '•'} ${task.texto || 'Objetivo'}`;

      const progress = document.createElement('b');
      progress.textContent = task.concluida ? '✓' : `${task.atual || 0}/${task.meta || 1}`;

      row.append(name, progress);
      host.appendChild(row);
    }
  }

  async function refreshProduct() {
    if (!token()) return;
    try {
      const response = await fetch('/api/product/dashboard');
      if (!response.ok) return;
      const payload = await response.json();
      const d = payload.dashboard;
      if (!d) return;

      document.documentElement.dataset.hgHouse = houseClass(d.player?.casa);

      const title = document.getElementById('hg2-objective-title');
      const detail = document.getElementById('hg2-objective-detail');
      const icon = document.getElementById('hg2-objective-icon');
      const classChip = document.getElementById('hg2-class');
      const house = document.getElementById('hg2-house');
      const needs = document.getElementById('hg2-needs');

      if (title) title.textContent = d.objective?.title || 'Viver Hogwarts';
      if (detail) detail.textContent = d.objective?.detail || '';
      if (icon) icon.textContent = ({
        bag:'🛍️', hat:'🎩', meal:'🍗', bed:'🛏️', class:'🎓',
        journal:'📜', quest:'🔮', moon:'🌙', castle:'🏰'
      })[d.objective?.icon] || '✦';

      if (classChip) classChip.textContent =
        d.relogio?.aulaAtiva && d.relogio.aulaAtiva !== 'Livre'
          ? `Aula: ${d.relogio.aulaAtiva}`
          : 'Tempo livre';

      if (house) house.textContent = `${d.player?.casa || 'Sem Casa'} · ${d.houseScore || 0}`;
      if (needs) needs.textContent = `Fome ${d.player?.fome ?? 100}% · Energia ${d.player?.energia ?? 100}%`;

      renderLoop(d.loop);
      renderDiary(d.diary);
      setConnection(typeof socket !== 'undefined' ? !!socket.connected : true);
    } catch (_) {}
  }

  function accessibilityPass() {
    document.querySelectorAll('button').forEach(button => {
      if (!button.getAttribute('aria-label')) {
        const label = safe(button.textContent).replace(/\s+/g, ' ').trim();
        if (label) button.setAttribute('aria-label', label.slice(0, 120));
      }
    });

    document.querySelectorAll('input, textarea, select').forEach(control => {
      if (!control.getAttribute('aria-label') && !control.labels?.length) {
        control.setAttribute('aria-label', control.getAttribute('placeholder') || control.id || 'Campo');
      }
    });
  }

  function installKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      const key = safe(e.key).toLowerCase();
      if (key === 'm') clickByText('Locais');
      if (key === 'i') clickByText('Mochila');
    });
  }

  function installSessionExpiredUi() {
    window.addEventListener('hogwarts:session-expired', () => {
      try {
        if (typeof mostrarNotificacao === 'function') {
          mostrarNotificacao('A tua sessão terminou. Entra novamente para continuar.', 'erro');
        }
      } catch (_) {}
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!token() && localStorage.getItem(LEGACY_ID_KEY)) {
      localStorage.removeItem(LEGACY_ID_KEY);
    }

    wrapSocket();
    createShell();
    accessibilityPass();
    installKeyboardShortcuts();
    installSessionExpiredUi();
    refreshProduct();

    setInterval(refreshProduct, 15_000);

    const observer = new MutationObserver(() => accessibilityPass());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
