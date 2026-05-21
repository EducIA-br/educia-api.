

// Progress bar
const bar=document.getElementById('progress-bar');
if(bar) window.addEventListener('scroll',()=>{bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%'});

// Navbar shadow
const nav=document.getElementById('navbar');
if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));

// Active nav link — detecta automaticamente a página atual
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.classList.remove('active');
  const href = a.getAttribute('href');
  if(href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
// botão vídeo
const vbtn = document.querySelector('.nav-video-btn');
if(vbtn) {
  vbtn.classList.remove('active');
  if(page === 'videos.html') vbtn.classList.add('active');
}

// Scroll reveals
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible')});
},{threshold:0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger,.debate-card').forEach(el=>obs.observe(el));

// Animated counters
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!e.target.dataset.done){
      e.target.dataset.done='1';
      const target=parseInt(e.target.dataset.target),suffix=e.target.dataset.suffix||'';
      const startVal=target>100?target-100:0,dur=1500,t0=performance.now();
      const run=now=>{const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);
        e.target.textContent=Math.round(startVal+(target-startVal)*ease)+suffix;
        if(p<1) requestAnimationFrame(run)};
      requestAnimationFrame(run);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.stat-val[data-target]').forEach(el=>cObs.observe(el));





// ── Page Transitions ──
(function(){
  // Páginas escuras usam scan ciano, claras usam scan azul suave
  const darkPages = ['debate.html','videos.html'];

  const overlay   = document.createElement('div'); overlay.id='pt-overlay';
  const scan      = document.createElement('div'); scan.id='pt-scan';
  const scanLight = document.createElement('div'); scanLight.id='pt-scan-light';

  [overlay, scan, scanLight].forEach(el=>document.body.appendChild(el));

  function isDark(href){
    return darkPages.includes(href || (location.pathname.split('/').pop()||'index.html'));
  }

  function clearAll(){
    [overlay, scan, scanLight].forEach(el=>el.classList.remove('active'));
    [scan, scanLight].forEach(el=>{
      el.style.animation='none'; el.style.top='-4px';
      el.offsetHeight;
      el.style.animation='';
    });
  }

  function runTransition(toHref, cb){
    clearAll();
    const dark = isDark(toHref);
    overlay.style.background = dark ? 'rgba(10,14,26,0.7)' : 'rgba(250,250,250,0.7)';
    overlay.classList.add('active');
    setTimeout(()=>{
      (dark ? scan : scanLight).classList.add('active');
    }, 30);
    setTimeout(cb, 520);
  }

  // Entrada suave
  window.addEventListener('load', ()=>{
    overlay.style.background = isDark() ? 'rgba(10,14,26,0.5)' : 'rgba(250,250,250,0.5)';
    overlay.classList.add('active');
    setTimeout(()=>overlay.classList.remove('active'), 80);
  });

  // Saída ao clicar
  document.addEventListener('click', e=>{
    const link = e.target.closest('a');
    if(!link) return;
    const href = link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto')) return;
    e.preventDefault();
    runTransition(href, ()=>{ window.location.href = href; });
  });
})();
