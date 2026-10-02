/* Odd-One interaction layer v2 — progressive, non-destructive enhancements */
(function(){
  'use strict';

  const getMap = () => (typeof map !== 'undefined' ? map : null);

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
      if(getMap()?.getZoom){ const el=document.getElementById('map-hud-zoom'); if(el) el.textContent='Z'+map.getZoom(); }
    };
    window.addEventListener('load', update, {once:true});
    document.getElementById('map')?.addEventListener('wheel', () => setTimeout(update,120), {passive:true});
  });
  ready(() => {
    const update = () => {
      if(!getMap()?.getZoom) return;
      const z=map.getZoom(), el=document.getElementById('map-hud-scope');
      if(el) el.textContent = z<6 ? 'India · regional scope' : z<9 ? 'India · corridor scope' : 'India · local scope';
    };
    window.addEventListener('load', update, {once:true});
  });
  ready(() => {
    const mapEl=document.getElementById('map');
    if(!mapEl || !window.ResizeObserver) return;
    const ro=new ResizeObserver(()=>getMap()?.invalidateSize?.({pan:false}));
    ro.observe(mapEl);
  });
  ready(() => {
    ['d-go-btn','m-go-btn'].forEach(id => document.getElementById(id)?.addEventListener('click', e => e.currentTarget.setAttribute('aria-busy','true')));
  });
  ready(() => {
    const restore=()=>['d-go-btn','m-go-btn'].forEach(id=>document.getElementById(id)?.setAttribute('aria-busy','false'));
    const observer=new MutationObserver(restore);
    document.querySelectorAll('[id$="-route-out"]').forEach(el=>observer.observe(el,{childList:true,subtree:true}));
  });
  ready(() => {
    const sync=()=>{ const box=document.getElementById('route-status-overlay'), source=document.getElementById('route-status-source'); if(box&&source) box.dataset.source=source.textContent.includes('APPROX')?'approx':'provider'; };
    const source=document.getElementById('route-status-source'); if(source) new MutationObserver(sync).observe(source,{childList:true,characterData:true,subtree:true});
    sync();
  });
  ready(() => {
    const strip=document.getElementById('observation-status-strip'), state=document.getElementById('obs-status-state');
    if(!strip||!state) return;
    const sync=()=>{ const s=state.textContent.trim().toLowerCase(); strip.dataset.state=s.includes('error')?'error':s.includes('live')?'live':s.includes('await')?'awaiting':s.includes('empty')?'empty':s.includes('unavailable')?'unavailable':'loading'; };
    new MutationObserver(sync).observe(state,{childList:true,characterData:true,subtree:true}); sync();
  });
  ready(() => {
    const footer=document.querySelector('body>footer'); if(!footer) return;
    footer.innerHTML=footer.innerHTML.replace(/©\s*\d{4}/,'© '+new Date().getFullYear());
  });
  ready(() => document.documentElement.dataset.motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full');
  ready(() => window.addEventListener('resize',()=>setTimeout(()=>getMap()?.invalidateSize?.({pan:false}),180),{passive:true}));
  ready(() => {
    const sync=()=>['map','sat'].forEach(k=>document.getElementById('btn-'+k)?.setAttribute('aria-pressed',document.getElementById('btn-'+k)?.classList.contains('on')?'true':'false'));
    ['btn-map','btn-sat'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(sync,0))); sync();
  });
  ready(() => {
    const b=document.getElementById('toggle-btn'), s=document.getElementById('sidebar'); if(!b||!s) return;
    b.setAttribute('role','button'); b.setAttribute('tabindex','0'); b.setAttribute('aria-label','Toggle intelligence sidebar');
    b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleSidebar();}});
  });
  ready(() => {
    const sync=()=>{ const active=document.querySelector('.tab-pane.on')?.id||''; const name=active.includes('route')?'Routing':active.includes('data')?'Data':'Alerts'; document.title='Odd-One.in — '+name+' Intelligence'; };
    document.querySelectorAll('[data-nav-tab]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync();
  });
  ready(() => {
    const sync=()=>['alerts','route','data'].forEach(k=>document.getElementById('dt-'+k)?.setAttribute('aria-selected',document.getElementById('dt-'+k)?.classList.contains('border-white')?'true':'false'));
    document.querySelectorAll('#dt-alerts,#dt-route,#dt-data').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync();
  });
  ready(() => {
    const sync=()=>['alerts','route','data'].forEach(k=>document.getElementById('mt-'+k)?.setAttribute('aria-selected',document.getElementById('mt-'+k)?.classList.contains('border-white')?'true':'false'));
    document.querySelectorAll('#mt-alerts,#mt-route,#mt-data').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync();
  });
  ready(() => document.querySelectorAll('[role="tab"]').forEach(tab=>tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const tabs=[...document.querySelectorAll('[role="tab"]')];const i=tabs.indexOf(e.currentTarget);tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length]?.focus();})));
  ready(() => {
    const sheet=document.getElementById('sheet'), toggle=document.getElementById('sheet-toggle'); if(!sheet||!toggle)return;
    const sync=()=>toggle.setAttribute('aria-expanded',sheet.classList.contains('open')?'true':'false');
    new MutationObserver(sync).observe(sheet,{attributes:true,attributeFilter:['class']}); sync();
  });
  ready(() => document.addEventListener('keydown',e=>{if(e.key==='Escape'&&window.innerWidth<=640&&document.getElementById('sheet')?.classList.contains('open'))toggleSheet?.();}));
  ready(() => { const box=document.getElementById('route-status-overlay'); if(!box)return; new MutationObserver(()=>box.dataset.visible=box.classList.contains('hidden')?'false':'true').observe(box,{attributes:true,attributeFilter:['class']}); });
  ready(() => document.getElementById('route-status-overlay')?.setAttribute('aria-label','Current route status')); 
  ready(() => { const input=document.getElementById('s-input'); if(!input)return; input.addEventListener('input',()=>input.setAttribute('aria-busy','false')); });
  ready(() => { const input=document.getElementById('s-input'), list=document.getElementById('sugg'); if(!input||!list)return; new MutationObserver(()=>{const n=list.querySelectorAll('.sugg-item').length; input.setAttribute('aria-describedby',n?'search-result-count':'');}).observe(list,{childList:true,subtree:true}); });
  ready(() => { const input=document.getElementById('s-input'); if(!input)return; const s=document.createElement('span'); s.id='search-result-count'; s.className='sr-only'; s.setAttribute('aria-live','polite'); input.parentElement?.appendChild(s); const list=document.getElementById('sugg'); if(list)new MutationObserver(()=>{s.textContent=list.querySelectorAll('.sugg-item').length+' search suggestions';}).observe(list,{childList:true,subtree:true}); });
  ready(() => document.getElementById('btn-loc')?.addEventListener('click',e=>{e.currentTarget.setAttribute('aria-busy','true');setTimeout(()=>e.currentTarget.setAttribute('aria-busy','false'),2500);}));
  ready(() => { const b=document.getElementById('btn-loc'); if(!b)return; const text=new MutationObserver(()=>{if(!/Locating/i.test(b.textContent))b.setAttribute('aria-busy','false');}); text.observe(b,{childList:true,characterData:true,subtree:true}); });
  ready(() => { const hud=document.getElementById('map-hud-scope'); if(!hud||!getMap())return; const sync=()=>{const c=map.getCenter(); hud.dataset.center=c.lat.toFixed(2)+','+c.lng.toFixed(2);}; window.addEventListener('load',sync,{once:true}); });
  ready(() => document.getElementById('map')?.setAttribute('aria-describedby','map-interaction-note')); 
  ready(() => { if(document.getElementById('map-interaction-note'))return; const n=document.createElement('p'); n.id='map-interaction-note'; n.className='sr-only'; n.textContent='Interactive road intelligence map. Use search, route, and map layer controls to explore.'; document.body.appendChild(n); });
  ready(() => { const m=document.getElementById('map'); if(!m)return; m.addEventListener('focus',()=>m.dataset.focused='true'); m.addEventListener('blur',()=>delete m.dataset.focused); });
  ready(() => document.querySelectorAll('#d-from,#m-from').forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter'){const id=input.id.replace('-from','-to');document.getElementById(id)?.focus();}}));
  ready(() => document.getElementById('s-input')?.addEventListener('blur',()=>document.getElementById('sugg')?.setAttribute('aria-hidden','true')));
  ready(() => { const l=document.getElementById('sugg'); if(!l)return; new MutationObserver(()=>l.setAttribute('aria-hidden',l.classList.contains('hidden')?'true':'false')).observe(l,{attributes:true,attributeFilter:['class']}); });
  ready(() => { const p=document.getElementById('route-status-path'); if(p) p.title=p.textContent; });
  ready(() => { const p=document.getElementById('route-status-path'); if(!p)return; new MutationObserver(()=>p.title=p.textContent).observe(p,{childList:true,characterData:true,subtree:true}); });
  ready(() => { document.getElementById('route-status-distance')?.setAttribute('aria-label','Route distance'); document.getElementById('route-status-time')?.setAttribute('aria-label','Estimated route time'); });
  ready(() => document.getElementById('obs-status-count')?.setAttribute('aria-label','Approved observation count')); 
  ready(() => { const el=document.getElementById('obs-status-count'); if(!el)return; new MutationObserver(()=>{el.dataset.numeric=/^\d/.test(el.textContent.trim())?'true':'false';}).observe(el,{childList:true,characterData:true,subtree:true}); });
  ready(() => { const box=document.getElementById('stats-content'); if(!box)return; new MutationObserver(()=>box.dataset.ready=box.textContent.trim()?'true':'false').observe(box,{childList:true,subtree:true}); });
  ready(() => document.querySelectorAll('[data-nav-tab="route"]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>document.getElementById(window.innerWidth<=640?'m-from':'d-from')?.focus(),120))));
})();
