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
  ready(() => document.addEventListener('keydown',e=>{if(e.key==='r'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){showTab?.('route');setTimeout(()=>document.getElementById(window.innerWidth<=640?'m-from':'d-from')?.focus(),80);}}));
  ready(() => document.addEventListener('keydown',e=>{if(e.key==='Escape'&&['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))document.activeElement.blur();}));
  ready(() => { const root=document.documentElement; const sync=()=>{root.dataset.section=(document.querySelector('.tab-pane.on')?.id||'').replace(/^[dm]p?-?/,'')||'alerts';}; document.querySelectorAll('[data-nav-tab]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync(); });
  ready(() => { const source=document.getElementById('route-status-source'); if(!source)return; source.setAttribute('aria-live','polite'); });
  ready(() => { const box=document.getElementById('route-status-overlay'); if(!box)return; const sync=()=>box.setAttribute('data-trust',box.classList.contains('route-approx')?'approximate':'provider'); new MutationObserver(sync).observe(box,{attributes:true,attributeFilter:['class']}); sync(); });
  ready(() => { const s=document.getElementById('sheet'); if(!s)return; new MutationObserver(()=>s.dataset.mode=s.classList.contains('open')?'expanded':'collapsed').observe(s,{attributes:true,attributeFilter:['class']}); });
  ready(() => { const b=document.getElementById('toggle-btn'); if(!b)return; const s=document.getElementById('sidebar'); new MutationObserver(()=>b.setAttribute('aria-expanded',s?.classList.contains('hidden')?'false':'true')).observe(s,{attributes:true,attributeFilter:['class']}); });
  ready(() => ['btn-map','btn-sat'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>document.getElementById('map')?.focus(),50))));
  ready(() => { const body=document.body; const sync=()=>body.dataset.intelligenceSection=document.documentElement.dataset.section||'alerts'; document.querySelectorAll('[data-nav-tab]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync(); });
  ready(() => { const i=document.getElementById('s-input'); if(i)i.dataset.source='local-plus-geocoder'; });
  ready(() => { const o=document.getElementById('route-status-overlay'); if(o)o.dataset.product='routing'; });
  ready(() => { const s=document.getElementById('observation-status-strip'); if(s)s.dataset.product='approved-observations'; });
  ready(() => { const m=document.getElementById('map'); if(m)m.dataset.product='road-intelligence'; });
  ready(() => document.getElementById('d-alerts-box')?.setAttribute('role','region'));
  ready(() => document.getElementById('d-alerts-box')?.setAttribute('aria-label','Current road alert feed'));
  ready(() => document.getElementById('m-alerts-box')?.setAttribute('role','region'));
  ready(() => document.getElementById('m-alerts-box')?.setAttribute('aria-label','Current road alert feed'));
  ready(() => document.querySelectorAll('[id$="-route-out"]').forEach(el=>el.setAttribute('role','region')));
  ready(() => document.querySelectorAll('[id$="-route-out"]').forEach(el=>el.setAttribute('aria-label','Calculated route intelligence')));
  ready(() => document.getElementById('stats-content')?.setAttribute('role','region'));
  ready(() => document.getElementById('stats-content')?.setAttribute('aria-label','Approved observation statistics'));
  ready(() => document.querySelector('body>footer')?.setAttribute('data-providers','leaflet,nominatim,osrm,gemini'));
  ready(() => { const sync=()=>document.documentElement.dataset.viewport=window.innerWidth<641?'mobile':window.innerWidth<1101?'tablet':'desktop'; window.addEventListener('resize',sync,{passive:true}); sync(); });
  ready(() => { const sync=()=>document.body.dataset.viewport=document.documentElement.dataset.viewport||'desktop'; window.addEventListener('resize',sync,{passive:true}); sync(); });
  ready(() => { const s=document.getElementById('sheet'); if(s)new MutationObserver(()=>s.setAttribute('aria-label',s.classList.contains('open')?'Expanded intelligence panel':'Collapsed intelligence panel')).observe(s,{attributes:true,attributeFilter:['class']}); });
  ready(() => { const source=document.getElementById('route-status-source'); if(source)new MutationObserver(()=>source.dataset.provider=source.textContent.trim()).observe(source,{childList:true,characterData:true,subtree:true}); });
  ready(() => { const o=document.getElementById('route-status-overlay'); if(o)o.setAttribute('data-trust-model','provider-or-approximate'); });
  ready(() => { const o=document.getElementById('route-status-overlay'), s=document.getElementById('route-status-source'); if(!o||!s)return; const sync=()=>o.classList.toggle('provider-backed',!o.classList.contains('route-approx')); new MutationObserver(sync).observe(o,{attributes:true,attributeFilter:['class']}); sync(); });
  ready(() => { const s=document.getElementById('route-status-source'); if(!s)return; s.dataset.sourceLabel=s.textContent.trim(); new MutationObserver(()=>s.dataset.sourceLabel=s.textContent.trim()).observe(s,{childList:true,characterData:true,subtree:true}); });
  ready(() => document.querySelectorAll('[id$="-route-out"]').forEach(el=>el.dataset.guidanceTrust='generated-unverified'));
  ready(() => ['d-alerts-box','m-alerts-box'].forEach(id=>document.getElementById(id)?.setAttribute('data-provenance','current-feed')));
  ready(() => document.getElementById('dp-data')?.setAttribute('data-provenance','approved-observations'));
  ready(() => document.getElementById('s-input')?.setAttribute('data-geocoder','explicit-search-only'));
  ready(() => document.getElementById('sidebar')?.setAttribute('role','complementary'));
  ready(() => document.getElementById('map')?.setAttribute('role','application'));
  ready(() => document.querySelector('nav[aria-label="Primary navigation"]')?.setAttribute('role','navigation'));
  ready(() => { const p=document.getElementById('dp-alerts'); if(p)p.dataset.surface='alerts'; });
  ready(() => { const p=document.getElementById('dp-route'); if(p)p.dataset.surface='routing'; });
  ready(() => { const p=document.getElementById('dp-data'); if(p)p.dataset.surface='data'; });
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById(i.id.startsWith('d-')?'d-go-btn':'m-go-btn')?.click();})));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.setAttribute('autocomplete','off')));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.setAttribute('spellcheck','false')));
  ready(() => { const m=document.getElementById('map'); if(m)m.dataset.layer='map'; });
  ready(() => { const m=document.getElementById('map'); if(!m)return; ['map','sat'].forEach(k=>document.getElementById('btn-'+k)?.addEventListener('click',()=>{m.dataset.layer=k;})); });
  ready(() => document.getElementById('search-result-count')?.setAttribute('aria-label','Search suggestion status'));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.addEventListener('input',()=>i.dataset.valid=i.value.trim()?'true':'false')));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.setAttribute('aria-invalid','false')));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.addEventListener('input',()=>i.setAttribute('aria-invalid','false'))));
  ready(() => document.querySelectorAll('#d-from,#d-to,#m-from,#m-to').forEach(i=>i.setAttribute('aria-required','true')));
  ready(() => { const o=document.getElementById('route-status-overlay'); if(o)o.dataset.routingMode='network'; });
  ready(() => { const o=document.getElementById('route-status-overlay'); if(o)o.dataset.fallbackPolicy='explicit-approximate'; });
  ready(() => { const s=document.getElementById('observation-status-strip'); if(s)s.dataset.publication='approved-only'; });
  ready(() => { const a=document.getElementById('d-alerts-box'); if(a)a.dataset.context='news-context-not-verification'; });
  ready(() => document.querySelector('body>footer')?.setAttribute('role','contentinfo'));
  ready(() => document.getElementById('s-input')?.setAttribute('role','searchbox'));
  ready(() => document.getElementById('sugg')?.setAttribute('role','listbox'));
  ready(() => document.getElementById('s-input')?.setAttribute('data-search-mode','explicit'));
  ready(() => document.getElementById('intelligence-hero')?.setAttribute('data-surface-version','v2'));
  ready(() => document.getElementById('map-intelligence-hud')?.setAttribute('data-surface-version','v2'));
  ready(() => document.getElementById('sidebar')?.setAttribute('data-surface-version','v2'));
  ready(() => document.getElementById('sheet')?.setAttribute('data-surface-version','v2'));
  ready(() => document.getElementById('map-layer-controls')?.setAttribute('data-surface-version','v2'));
  ready(() => document.getElementById('route-status-overlay')?.setAttribute('data-surface-version','v2'));
  ready(() => { const m=getMap(); if(m?.on)m.on('zoomend',()=>{const z=document.getElementById('map-hud-zoom');if(z)z.textContent='Z'+m.getZoom();}); });
  ready(() => { const m=getMap(); if(m?.on)m.on('moveend',()=>{const s=document.getElementById('map-hud-scope');if(s){const c=m.getCenter();s.dataset.center=c.lat.toFixed(2)+','+c.lng.toFixed(2);}}); });
  ready(() => { const m=getMap(); if(!m)return; const z=document.getElementById('map-hud-zoom'); if(z)z.textContent='Z'+m.getZoom(); });
  ready(() => { const m=getMap(); if(!m)return; const s=document.getElementById('map-hud-scope'); if(s){const c=m.getCenter();s.dataset.center=c.lat.toFixed(2)+','+c.lng.toFixed(2);}});
  ready(() => { const m=document.getElementById('map'); if(m)m.title='Interactive road intelligence map — search, route, or change layers.'; });
  ready(() => document.getElementById('sheet')?.addEventListener('transitionend',()=>getMap()?.invalidateSize?.({pan:false})));
  ready(() => document.getElementById('toggle-btn')?.addEventListener('click',()=>setTimeout(()=>getMap()?.invalidateSize?.({pan:false}),340)));
  ready(() => document.getElementById('route-status-source')?.setAttribute('aria-label','Routing source')); 
  ready(() => document.getElementById('obs-status-state')?.setAttribute('aria-label','Observation service state'));
  ready(() => document.getElementById('obs-status-dot')?.setAttribute('aria-hidden','true'));
  ready(() => document.querySelector('#s-input + span')?.setAttribute('aria-hidden','true'));
  ready(() => document.querySelector('#intelligence-hero .bg-emerald-400')?.setAttribute('aria-hidden','true'));
  ready(() => document.querySelectorAll('#map-layer-controls button span').forEach(s=>s.setAttribute('aria-hidden','true')));
  ready(() => document.querySelector('.route-status-dot')?.setAttribute('aria-hidden','true'));
  ready(() => document.querySelector('nav[aria-label="Primary navigation"] .text-zinc-800')?.setAttribute('aria-hidden','true'));
  ready(() => document.getElementById('hero-data-boundary')?.setAttribute('data-trust','explicit'));
  ready(() => document.querySelector('#dp-data .intel-card')?.setAttribute('data-trust','approved-only'));
  ready(() => document.querySelectorAll('.bg-amber-500\\/10').forEach(el=>el.dataset.trust='approximate'));
  ready(() => document.querySelectorAll('button').forEach(b=>{if(/PLAN ROUTE/i.test(b.textContent))b.setAttribute('aria-label','Open route planner');}));
  ready(() => document.querySelectorAll('button').forEach(b=>{if(/^ROUTE$/i.test(b.textContent.trim()))b.setAttribute('aria-label','Open route planner');}));
  ready(() => { const b=document.querySelector('nav h1')?.parentElement; if(b){b.setAttribute('role','button');b.setAttribute('tabindex','0');b.setAttribute('aria-label','Return to India map view');b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click();}});}});
  ready(() => { const b=document.querySelector('nav h1')?.parentElement; if(b)b.addEventListener('focus',()=>b.dataset.focused='true'); });
  ready(() => document.querySelector('nav h1')?.setAttribute('data-brand','odd-one'));
  ready(() => { const b=document.getElementById('toggle-btn'); if(b)b.title='Toggle intelligence sidebar'; });
  ready(() => { const b=document.getElementById('sheet-toggle'); if(b)b.title='Expand or collapse intelligence panel'; });
  ready(() => { const b=document.getElementById('sheet-toggle'),s=document.getElementById('sheet'); if(!b||!s)return; const sync=()=>b.title=s.classList.contains('open')?'Collapse intelligence panel':'Expand intelligence panel'; new MutationObserver(sync).observe(s,{attributes:true,attributeFilter:['class']}); sync(); });
  ready(() => { document.getElementById('btn-map')?.setAttribute('role','button'); document.getElementById('btn-sat')?.setAttribute('role','button'); });
  ready(() => document.getElementById('btn-loc')?.setAttribute('role','button'));
  ready(() => { const m=document.getElementById('map'); const sync=()=>{if(m)m.dataset.layer=(document.getElementById('btn-sat')?.classList.contains('on')?'sat':'map');}; ['btn-map','btn-sat'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(sync,0))); sync(); });
  ready(() => ['d-alerts-box','m-alerts-box'].forEach(id=>{const el=document.getElementById(id); if(el)el.dataset.feedFreshness='current-feed';}));
  ready(() => document.querySelectorAll('[id$="-route-out"],#stats-content').forEach(el=>el.dataset.missingDataPolicy='no-data-is-not-safe-or-empty'));
  ready(() => document.getElementById('btn-sat')?.setAttribute('data-trust','visual-context'));
  ready(() => document.querySelectorAll('[id$="-route-out"]').forEach(el=>el.dataset.aiGuidancePolicy='generated-not-verified'));
  ready(() => { const s=document.getElementById('route-status-source'); if(s)s.hidden=false; });
  ready(() => document.body.setAttribute('data-intelligence-ui','v2-progressive'));
  ready(() => { const sync=()=>document.querySelectorAll('[data-nav-tab]').forEach(b=>b.setAttribute('aria-current',b.classList.contains('active')?'page':'false')); document.querySelectorAll('[data-nav-tab]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0))); sync(); });
  ready(() => { const m=getMap(); if(m?.on)m.on('zoomend moveend',()=>document.body.dataset.mapViewport='updated'); });
  ready(() => document.getElementById('observation-status-strip')?.setAttribute('data-public-boundary','approved-only'));
  ready(() => document.getElementById('route-status-overlay')?.setAttribute('data-fallback-boundary','explicit'));
  ready(() => document.getElementById('btn-sat')?.setAttribute('data-context-only','true'));
  ready(() => { const s=document.getElementById('sheet'); if(s)s.setAttribute('aria-label','Road intelligence panel'); });
  ready(() => document.documentElement.setAttribute('data-odd-one-ui','intelligence-v2'));
  ready(() => window.addEventListener('orientationchange',()=>setTimeout(()=>getMap()?.invalidateSize?.({pan:false}),250),{passive:true}));
  ready(() => document.getElementById('s-input')?.setAttribute('aria-controls','sugg'));
  ready(() => document.body.setAttribute('data-progressive-ui','enabled'));
})();

document.documentElement.dataset.oddOneViewport='ready';

document.documentElement.dataset.oddOneMap='ready';

document.querySelector('nav')?.setAttribute('aria-label','Primary navigation');

document.querySelector('#search-wrap')?.setAttribute('role','search');

document.querySelector('#s-input')?.setAttribute('aria-label','Search India road intelligence');

document.querySelectorAll('#sidebar input').forEach((el,i)=>el.setAttribute('aria-label',el.getAttribute('aria-label')||`Route input ${i+1}`));

document.querySelector('#map')?.setAttribute('aria-label','Interactive India road intelligence map');

document.querySelector('#sidebar')?.setAttribute('aria-label','Road intelligence panel');

document.querySelector('#sheet')?.setAttribute('aria-label','Mobile road intelligence panel');

window.addEventListener('resize',()=>document.documentElement.dataset.oddOneViewport=window.innerWidth<641?'mobile':window.innerWidth<1101?'tablet':'desktop',{passive:true});

window.addEventListener('online',()=>document.documentElement.dataset.oddOneNetwork='online');

window.addEventListener('offline',()=>document.documentElement.dataset.oddOneNetwork='offline');

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.reducedMotion='true';

document.documentElement.dataset.oddOneViewport=window.innerWidth<641?'mobile':window.innerWidth<1101?'tablet':'desktop';

document.documentElement.dataset.oddOneNetwork=navigator.onLine?'online':'offline';

document.documentElement.lang=document.documentElement.lang||'en';

document.addEventListener('focusin',e=>e.target?.setAttribute('data-focus-visible','true'));

document.addEventListener('focusout',e=>e.target?.removeAttribute('data-focus-visible'));

document.documentElement.dataset.interactionVersion='v2';

document.documentElement.classList.toggle('is-mobile',window.innerWidth<641);

document.documentElement.classList.toggle('is-tablet',window.innerWidth>=641&&window.innerWidth<1101);

document.documentElement.classList.toggle('is-desktop',window.innerWidth>=1101);

document.documentElement.classList.toggle('is-online',navigator.onLine);

document.documentElement.classList.toggle('is-offline',!navigator.onLine);

document.documentElement.dataset.keyboard='false';

document.addEventListener('keydown',e=>{if(e.key==='Tab')document.documentElement.dataset.keyboard='true';});

document.addEventListener('pointerdown',()=>document.documentElement.dataset.keyboard='false',{passive:true});

window.addEventListener('resize',()=>{document.documentElement.classList.toggle('is-mobile',window.innerWidth<641);document.documentElement.classList.toggle('is-tablet',window.innerWidth>=641&&window.innerWidth<1101);document.documentElement.classList.toggle('is-desktop',window.innerWidth>=1101);},{passive:true});

window.addEventListener('online',()=>document.documentElement.classList.add('is-online'));

window.addEventListener('offline',()=>document.documentElement.classList.remove('is-online'));

document.querySelector('#s-input')?.addEventListener('input',()=>document.querySelector('#search-wrap')?.setAttribute('data-search-active','true'));

document.querySelector('#s-input')?.addEventListener('blur',()=>document.querySelector('#search-wrap')?.removeAttribute('data-search-active'));

document.querySelector('#intelligence-hero')?.setAttribute('data-rendered','true');

document.querySelector('#sidebar')?.setAttribute('data-rendered','true');

document.querySelector('#sheet')?.setAttribute('data-rendered','true');

document.querySelector('#search-wrap')?.setAttribute('data-rendered','true');

document.querySelector('#map')?.setAttribute('data-rendered','true');

document.documentElement.dataset.surfaceReady='true';

new IntersectionObserver(e=>e[0]&&document.documentElement.classList.toggle('hero-visible',e[0].isIntersecting)).observe(document.querySelector('#intelligence-hero')||document.documentElement);

new IntersectionObserver(e=>e[0]&&document.documentElement.classList.toggle('sidebar-visible',e[0].isIntersecting)).observe(document.querySelector('#sidebar')||document.documentElement);

new IntersectionObserver(e=>e[0]&&document.documentElement.classList.toggle('sheet-visible',e[0].isIntersecting)).observe(document.querySelector('#sheet')||document.documentElement);

if(document.readyState==='complete')document.documentElement.dataset.documentReady='true';

window.addEventListener('load',()=>document.documentElement.dataset.documentReady='true',{once:true});

window.addEventListener('resize',()=>document.documentElement.dataset.mapResize='pending',{passive:true});

window.addEventListener('resize',()=>{clearTimeout(window.__oddOneResizeTimer);window.__oddOneResizeTimer=setTimeout(()=>document.documentElement.dataset.mapResize='settled',180);},{passive:true});

document.querySelector('#s-input')?.addEventListener('focus',()=>document.documentElement.dataset.searchFocus='true');

document.querySelector('#s-input')?.addEventListener('blur',()=>document.documentElement.dataset.searchFocus='false');

document.querySelectorAll('#sidebar input').forEach(el=>el.addEventListener('focus',()=>el.setAttribute('data-route-focus','true')));

document.querySelectorAll('#sidebar input').forEach(el=>el.addEventListener('blur',()=>el.removeAttribute('data-route-focus')));

document.addEventListener('click',e=>{const b=e.target.closest?.('[data-tab]');if(b)document.documentElement.dataset.activePanel=b.dataset.tab;});

document.addEventListener('click',e=>{if(e.target.closest?.('#sheet-toggle'))document.documentElement.dataset.sheetInteraction='toggle';});

document.addEventListener('keydown',e=>{if(e.key==='Escape')document.documentElement.dataset.lastKey='escape';});

document.addEventListener('keydown',e=>{if(e.key==='Enter')document.documentElement.dataset.lastKey='enter';});

document.documentElement.dataset.interactionHeartbeat='ready';

document.documentElement.dataset.runtimePhase='interactive';

document.documentElement.dataset.controlsPhase='ready';

document.documentElement.dataset.contentPhase='ready';

document.querySelectorAll('[role="tab"]').forEach(el=>el.addEventListener('click',()=>document.documentElement.dataset.lastTab=el.textContent.trim()));

document.querySelectorAll('#d-go-btn,#m-go-btn').forEach(el=>el.addEventListener('click',()=>document.documentElement.dataset.routeAction='requested'));

document.querySelector('#s-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.documentElement.dataset.searchAction='submitted';});

document.querySelectorAll('[role="tab"]').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')document.documentElement.dataset.tabKeyAction='activated';}));

document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')document.documentElement.dataset.lastActionKey=e.key;});

document.addEventListener('focusout',e=>{if(e.target?.matches?.('#d-from,#d-to,#m-from,#m-to'))document.documentElement.dataset.routeFocus='idle';});

document.addEventListener('focusin',e=>{if(e.target?.matches?.('#d-from,#d-to,#m-from,#m-to'))document.documentElement.dataset.routeFocus='active';});

document.addEventListener('submit',e=>{if(e.target?.matches?.('#search-form'))document.documentElement.dataset.searchAction='submitted';});

document.addEventListener('click',e=>{if(e.target.closest?.('#d-alerts-box>div,#m-alerts-box>div'))document.documentElement.dataset.alertInteraction='selected';});

document.addEventListener('click',e=>{if(e.target.closest?.('#dp-data'))document.documentElement.dataset.dataInteraction='selected';});

document.addEventListener('click',e=>{if(e.target.closest?.('#dp-route'))document.documentElement.dataset.routeInteraction='selected';});

document.documentElement.dataset.interactionTimestamp=String(Date.now());

document.documentElement.dataset.surfaceTimestamp=String(Date.now());

document.documentElement.dataset.viewportTimestamp=String(Date.now());

document.documentElement.dataset.a11yPhase='active';

document.documentElement.dataset.routePhase='ready';

document.documentElement.dataset.searchPhase='ready';

document.documentElement.dataset.mapPhase='ready';

document.documentElement.dataset.interactionPhase='ready';

  ready(() => document.getElementById('map')?.setAttribute('role','region'));

  ready(() => document.getElementById('map')?.setAttribute('tabindex','0'));

  ready(() => document.getElementById('map-command-deck')?.setAttribute('aria-label','Map controls'));

  ready(() => document.getElementById('btn-map')?.setAttribute('title','Standard road map'));

  ready(() => document.getElementById('btn-sat')?.setAttribute('title','Satellite imagery'));

  ready(() => document.getElementById('btn-reset-view')?.setAttribute('title','Reset to India overview'));
