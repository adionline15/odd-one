/* Odd-One interaction layer v2 — progressive, non-destructive enhancements */
(function(){
  'use strict';

  const ready = fn => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once:true })
    : fn();

  ready(() => {
    const navButtons = document.querySelectorAll('[data-nav-tab]');
    const syncNavState = () => {
      const active = document.querySelector('.tab-pane.on')?.id || '';
      const tab = active.replace(/^d?p?[-]/,'').replace(/^m?t?[-]/,'');
      navButtons.forEach(btn => {
        const isActive = btn.dataset.navTab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
    };

    navButtons.forEach(btn => btn.addEventListener('click', () => requestAnimationFrame(syncNavState)));
    syncNavState();
  });
  ready(() => {
    document.querySelectorAll('[data-nav-tab]').forEach(btn => btn.setAttribute('role','tab'));
    ['dt-alerts','dt-route','dt-data','mt-alerts','mt-route','mt-data'].forEach(id => document.getElementById(id)?.setAttribute('role','tab'));
  });
})();
