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
  ready(() => {
    const observer = new MutationObserver(() => requestAnimationFrame(() => {
      document.querySelectorAll('[data-nav-tab]').forEach(btn => {
        const active = btn.classList.contains('active');
        btn.setAttribute('aria-current', active ? 'page' : 'false');
      });
    }));
    document.querySelectorAll('.tab-pane').forEach(el => observer.observe(el,{attributes:true,attributeFilter:['class']}));
  });
  ready(() => document.addEventListener('keydown', e => {
    if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
      e.preventDefault(); document.getElementById('s-input')?.focus();
    }
  }));
  ready(() => document.getElementById('s-input')?.addEventListener('keydown', e => {
    if(e.key==='Escape'){ e.currentTarget.blur(); document.getElementById('sugg')?.classList.add('hidden'); }
  }));
  ready(() => {
    const update = () => {
      if(window.map?.getZoom){ const el=document.getElementById('map-hud-zoom'); if(el) el.textContent='Z'+map.getZoom(); }
    };
    window.addEventListener('load', update, {once:true});
    document.getElementById('map')?.addEventListener('wheel', () => setTimeout(update,120), {passive:true});
  });
  ready(() => {
    const update = () => {
      if(!window.map?.getZoom) return;
      const z=map.getZoom(), el=document.getElementById('map-hud-scope');
      if(el) el.textContent = z<6 ? 'India · regional scope' : z<9 ? 'India · corridor scope' : 'India · local scope';
    };
    window.addEventListener('load', update, {once:true});
  });
})();
