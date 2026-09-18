(() => {
  'use strict';

  const SESSION_KEY = 'hogwarts_session';
  const ID_KEY = 'hogwarts_id';
  const originalFetch = window.fetch.bind(window);

  function token() {
    return localStorage.getItem(SESSION_KEY) || '';
  }

  function safeText(value) {
    return String(value ?? '');
  }

  function escapeHTML(value) {
    return safeText(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }
  window.escapeHTML = escapeHTML;

  window.fetch = async function v1Fetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined) || {});
    const session = token();
    if (session && url.startsWith('/api/')) headers.set('X-Hogwarts-Session', session);

    const response = await originalFetch(input, { ...init, headers });

    if (url.includes('/api/registrar')) {
      try {
        const data = await response.clone().json();
        if (data?.sessionToken) localStorage.setItem(SESSION_KEY, data.sessionToken);
      } catch (_) {}
    }

    if (response.status === 401 && url.startsWith('/api/') && !url.includes('/api/registrar')) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(ID_KEY);
    }

    return response;
  };

  function installSocketGuard() {
    try {
      if (typeof socket === 'undefined' || !socket?.emit) return;
      if (socket.__v1Wrapped) return;
      socket.__v1Wrapped = true;
      const rawEmit = socket.emit.bind(socket);

      socket.emit = function(event, data, ...rest) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
        const session = token();
        if (session) data.token = session;
        return rawEmit(event, data, ...rest);
      };

      socket.on?.('connect', () => updateConnection(true));
      socket.on?.('disconnect', () => updateConnection(false));
      socket.on?.('connect_error', err => {
        if (String(err?.message || '').includes('AUTH')) updateConnection(false, 'Sessão');
      });
    } catch (_) {}
  }

  function updateConnection(ok, label) {
    const chip = document.getElementById('v1-connection');
    if (!chip) return;
    chip.classList.toggle('is-offline', !ok);
    chip.textContent = ok ? '● Online' : `○ ${label || 'Reconectando'}`;
  }

  function installSafeToasts() {
    window.mostrarNotificacao = function(msg, tipo = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      while (container.children.length >= 3) container.firstElementChild?.remove();

      const toast = document.createElement('div');
      toast.className = `magical-toast ${tipo === 'erro' ? 'toast-erro' : tipo === 'sucesso' ? 'toast-sucesso' : ''}`;
      toast.textContent = safeText(msg);
      container.appendChild(toast);
      requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });

      setTimeout(() => {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 350);
      }, 3600);
    };
  }

  function clickByText(needle) {
    const buttons = [...document.querySelectorAll('button')];
    const btn = buttons.find(b => b.offsetParent !== null && safeText(b.textContent).toLowerCase().includes(needle.toLowerCase()))
      || buttons.find(b => safeText(b.textContent).toLowerCase().includes(needle.toLowerCase()));
    btn?.click();
  }

  function createShell() {
    if (document.getElementById('v1-command-center')) return;

    const top = document.createElement('div');
    top.id = 'v1-command-center';
    top.innerHTML = `
      <div class="v1-brand">
        <span class="v1-brand-mark">H</span>
        <div><strong>HOGWARTS</strong><small>MUNDO VIVO</small></div>
      </div>
      <div class="v1-objective">
        <span id="v1-objective-icon">✦</span>
        <div><small>PRÓXIMO PASSO</small><strong id="v1-objective-title">A carregar o castelo...</strong><span id="v1-objective-text"></span></div>
      </div>
      <div class="v1-status-cluster">
        <span class="v1-chip" id="v1-class-chip">Tempo livre</span>
        <span class="v1-chip" id="v1-house-chip">Casa</span>
        <span class="v1-chip" id="v1-connection">○ Ligando</span>
      </div>
    `;
    document.body.appendChild(top);

    const dock = document.createElement('nav');
    dock.id = 'v1-mobile-dock';
    dock.setAttribute('aria-label', 'Navegação principal');
    dock.innerHTML = `
      <button data-v1-nav="Locais"><span>🗺️</span><small>Locais</small></button>
      <button data-v1-nav="Academia"><span>🎓</span><small>Aulas</small></button>
      <button data-v1-nav="Mochila"><span>🎒</span><small>Mochila</small></button>
      <button data-v1-nav="Salão da Glória"><span>🏆</span><small>Social</small></button>
      <button data-v1-nav="Dormitório"><span>🛏️</span><small>Vida</small></button>
    `;
    dock.addEventListener('click', e => {
      const btn = e.target.closest('button[data-v1-nav]');
      if (btn) clickByText(btn.dataset.v1Nav);
    });
    document.body.appendChild(dock);

    const rhythm = document.createElement('aside');
    rhythm.id = 'v1-rhythm';
    rhythm.innerHTML = `
      <button id="v1-rhythm-toggle" aria-expanded="false">✦ Ritmo de Hogwarts</button>
      <div id="v1-rhythm-panel" hidden>
        <h3>O teu dia em Hogwarts</h3>
        <div class="v1-rhythm-grid">
          <div><b>🎓 Aprender</b><span>Aulas e biblioteca</span></div>
          <div><b>🧪 Preparar</b><span>Poções e recursos</span></div>
          <div><b>🗺️ Explorar</b><span>Missões e segredos</span></div>
          <div><b>🤝 Pertencer</b><span>Casa e amigos</span></div>
          <div><b>⚔️ Competir</b><span>Duelos e Quadribol</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(rhythm);

    document.getElementById('v1-rhythm-toggle')?.addEventListener('click', e => {
      const panel = document.getElementById('v1-rhythm-panel');
      const open = panel.hasAttribute('hidden');
      panel.toggleAttribute('hidden', !open);
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });
  }

  async function refreshDashboard() {
    if (!token() || !localStorage.getItem(ID_KEY)) return;
    try {
      const res = await fetch('/api/v1/dashboard');
      if (!res.ok) return;
      const data = await res.json();
      const d = data.dashboard;
      if (!d) return;

      document.documentElement.dataset.house = safeText(d.player?.casa || 'Nenhuma').toLowerCase();

      const obj = d.objective || {};
      const icon = document.getElementById('v1-objective-icon');
      const title = document.getElementById('v1-objective-title');
      const text = document.getElementById('v1-objective-text');
      const classChip = document.getElementById('v1-class-chip');
      const houseChip = document.getElementById('v1-house-chip');

      if (icon) icon.textContent = obj.icon || '✦';
      if (title) title.textContent = obj.title || 'Viver Hogwarts';
      if (text) text.textContent = obj.text || '';
      if (classChip) classChip.textContent = d.relogio?.aulaAtiva && d.relogio.aulaAtiva !== 'Livre'
        ? `🎓 ${d.relogio.aulaAtiva}` : '☕ Tempo livre';
      if (houseChip) houseChip.textContent = `${d.player?.casa || 'Sem Casa'} · ${d.houseScore || 0} pts`;

      updateConnection(typeof socket !== 'undefined' ? socket.connected : true);
    } catch (_) {}
  }

  function enhanceAccessibility() {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        const label = safeText(btn.textContent).replace(/\s+/g, ' ').trim();
        if (label) btn.setAttribute('aria-label', label.slice(0, 100));
      }
    });
    document.querySelectorAll('input, textarea, select').forEach(el => {
      if (!el.getAttribute('aria-label') && !el.labels?.length) {
        const label = el.getAttribute('placeholder') || el.id || 'Campo';
        el.setAttribute('aria-label', label);
      }
    });
  }

  function installKeyboard() {
    document.addEventListener('keydown', e => {
      const tag = e.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key.toLowerCase() === 'm') clickByText('Locais');
      if (e.key.toLowerCase() === 'i') clickByText('Mochila');
      if (e.key.toLowerCase() === 'q') clickByText('Oráculo');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    installSocketGuard();
    installSafeToasts();
    createShell();
    enhanceAccessibility();
    installKeyboard();
    refreshDashboard();
    setInterval(refreshDashboard, 15000);

    const observer = new MutationObserver(() => enhanceAccessibility());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
