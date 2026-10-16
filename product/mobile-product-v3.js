(() => {
  'use strict';

  const mobile = () => window.matchMedia('(max-width: 900px)').matches;

  function wireZoneToolbar() {
    const gam = document.getElementById('hud-gamificacao-topo');
    if (!gam || !gam.parentElement) return;
    const parent = gam.parentElement;
    parent.classList.add('hg3-zone-toolbar');

    // Based on current DOM: gamification, H3 location, action buttons.
    const children = [...parent.children];
    const title = children.find(el => el.tagName === 'H3');
    if (title) title.classList.add('hg3-zone-title');

    const actions = children.find(el =>
      el !== gam &&
      el !== title &&
      el.tagName === 'DIV' &&
      el.querySelector('button')
    );
    if (actions) actions.classList.add('hg3-zone-actions');
  }

  function resetKeys() {
    const engine = window.HogwartsMMOEngine;
    if (!engine?.keys) return;
    engine.keys.w = 0;
    engine.keys.a = 0;
    engine.keys.s = 0;
    engine.keys.d = 0;
  }

  function bindCastleJoystick() {
    const zone = document.getElementById('mmo-joystick-zone');
    const knob = document.getElementById('mmo-joystick-knob');
    if (!zone || !knob || zone.dataset.hg3TouchBound === '1') return;

    zone.dataset.hg3TouchBound = '1';
    let pointerId = null;

    function update(clientX, clientY) {
      const engine = window.HogwartsMMOEngine;
      if (!engine?.keys) return;

      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = Math.max(24, Math.min(rect.width, rect.height) / 2 - 27);

      let dx = clientX - cx;
      let dy = clientY - cy;
      const len = Math.hypot(dx, dy) || 1;
      if (len > max) {
        dx = dx / len * max;
        dy = dy / len * max;
      }

      knob.style.transform = `translate(${dx}px, ${dy}px)`;

      const nx = dx / max;
      const ny = dy / max;
      const dead = 0.18;

      engine.keys.a = nx < -dead ? 1 : 0;
      engine.keys.d = nx > dead ? 1 : 0;
      engine.keys.w = ny < -dead ? 1 : 0;
      engine.keys.s = ny > dead ? 1 : 0;
    }

    function end() {
      pointerId = null;
      knob.style.transform = 'translate(0px, 0px)';
      resetKeys();
    }

    if (window.PointerEvent) {
      zone.addEventListener('pointerdown', e => {
        if (!mobile()) return;
        e.preventDefault();
        pointerId = e.pointerId;
        try { zone.setPointerCapture(pointerId); } catch (_) {}
        update(e.clientX, e.clientY);
      }, { passive: false });

      zone.addEventListener('pointermove', e => {
        if (!mobile() || pointerId !== e.pointerId) return;
        e.preventDefault();
        update(e.clientX, e.clientY);
      }, { passive: false });

      zone.addEventListener('pointerup', e => {
        if (pointerId !== e.pointerId) return;
        e.preventDefault();
        end();
      }, { passive: false });

      zone.addEventListener('pointercancel', end);
      zone.addEventListener('lostpointercapture', end);
    } else {
      zone.addEventListener('touchstart', e => {
        if (!mobile() || !e.touches[0]) return;
        e.preventDefault();
        update(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      zone.addEventListener('touchmove', e => {
        if (!mobile() || !e.touches[0]) return;
        e.preventDefault();
        update(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      zone.addEventListener('touchend', end, { passive: false });
      zone.addEventListener('touchcancel', end, { passive: false });
    }
  }

  function repairTouchTargets() {
    if (!mobile()) return;
    document.querySelectorAll('button, a, [onclick], input, textarea, select').forEach(el => {
      el.style.pointerEvents = 'auto';
    });
  }

  function resizeWorld() {
    if (!mobile()) return;
    try {
      window.HogwartsMMOEngine?.ajustarResolucao?.();
    } catch (_) {}
  }

  function init() {
    wireZoneToolbar();
    bindCastleJoystick();
    repairTouchTargets();
    resizeWorld();

    window.addEventListener('resize', () => {
      clearTimeout(window.__hg3ResizeTimer);
      window.__hg3ResizeTimer = setTimeout(resizeWorld, 80);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(resizeWorld, 180);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetKeys();
    });

    // Rebind only when DOM systems are mounted later. No click interception,
    // no scrollIntoView, no global touchmove listener.
    const observer = new MutationObserver(() => {
      wireZoneToolbar();
      bindCastleJoystick();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
