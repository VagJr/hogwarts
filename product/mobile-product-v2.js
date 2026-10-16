(() => {
  'use strict';

  const mq = window.matchMedia('(max-width: 900px)');

  function applyMode() {
    document.documentElement.classList.toggle('hg2-mobile', mq.matches);
    document.body?.classList.toggle('hg2-mobile', mq.matches);
  }

  function visible(el) {
    if (!el) return false;
    if (el.classList.contains('oculto') || el.hidden) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function normalizeTabs() {
    if (!mq.matches) return;

    // Critical rule: hidden navigation must remain hidden.
    document.querySelectorAll('.sub-tabs.oculto, .tabs.oculto').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
    });

    // Keep the active contextual button visible without changing game state.
    document.querySelectorAll('.sub-tabs, .tabs').forEach(row => {
      if (!visible(row)) return;
      const active = row.querySelector('button.active');
      if (active && typeof active.scrollIntoView === 'function') {
        active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    });
  }

  function fitCanvases() {
    if (!mq.matches) return;
    for (const canvas of document.querySelectorAll('#mmo-world-canvas, #forest-map-container canvas')) {
      canvas.style.maxWidth = 'none';
    }
  }

  function closeJourneyOnNavigation(e) {
    if (!mq.matches) return;
    if (!e.target.closest('#hg2-mobile-dock button, .main-nav-btn, .sub-tabs button, .tabs button')) return;
    const panel = document.getElementById('hg2-journey-panel');
    const toggle = document.getElementById('hg2-journey-toggle');
    if (panel && !panel.hidden) {
      panel.hidden = true;
      toggle?.setAttribute('aria-expanded', 'false');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyMode();
    normalizeTabs();
    fitCanvases();

    document.addEventListener('click', e => {
      closeJourneyOnNavigation(e);
      setTimeout(normalizeTabs, 30);
    }, true);

    const observer = new MutationObserver(records => {
      if (!mq.matches) return;
      if (records.some(r => r.type === 'attributes' || r.addedNodes.length)) {
        requestAnimationFrame(normalizeTabs);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'hidden']
    });

    mq.addEventListener?.('change', () => {
      applyMode();
      normalizeTabs();
      fitCanvases();
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        normalizeTabs();
        fitCanvases();
      }, 120);
    });
  });
})();
