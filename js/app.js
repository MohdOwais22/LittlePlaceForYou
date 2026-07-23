/* =========================================================
   OPEN WHEN — App logic. Vanilla JS, no dependencies.
========================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* -----------------------------------------------------
     Small line-art icon set (used as wax-seal marks and
     letter watermarks). Pure inline SVG, no external files.
  ----------------------------------------------------- */
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1110.5 4a6.8 6.8 0 009.5 10.5z"/><path d="M16.5 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
    heart: '<path d="M12 20s-7-4.6-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 11c-2.5 4.4-9.5 9-9.5 9z"/>',
    drop: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>',
    embrace: '<path d="M4 19c2-6 3-9 3-11a3 3 0 016 0"/><path d="M20 19c-2-6-3-9-3-11a3 3 0 00-6 0"/>',
    candle: '<path d="M9 21h6"/><rect x="9" y="10" width="6" height="11" rx="1"/><path d="M12 3c-1.4 2-1.6 3.3-.6 4.4A2 2 0 1114 10c0-1.4-.6-2-1.4-2.8C11.6 6.3 11.4 5 12 3z"/>',
    bloom: '<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8c-1.6-1.6-1.6-4-1.6-4s2.4 0 4 1.6c1.6 1.6 1.6 4 1.6 4s-2.4 0-4-1.6z"/><path d="M14.2 12c1.6-1.6 4-1.6 4-1.6s0 2.4-1.6 4c-1.6 1.6-4 1.6-4 1.6s0-2.4 1.6-4z"/><path d="M9.8 12c-1.6 1.6-4 1.6-4 1.6s0-2.4 1.6-4c1.6-1.6 4-1.6 4-1.6s0 2.4-1.6 4z"/><path d="M12 14.2c1.6 1.6 1.6 4 1.6 4s-2.4 0-4-1.6c-1.6-1.6-1.6-4-1.6-4s2.4 0 4 1.6z"/>',
    stars: '<path d="M7 5l.9 2.1L10 8l-2.1.9L7 11l-.9-2.1L4 8l2.1-.9z"/><path d="M16.5 12l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z"/>',
    spiral: '<path d="M12 20a8 8 0 01-2-15.8A6 6 0 0114 8.5a4.5 4.5 0 01-4.5 4.3 3 3 0 01-.5-6"/>',
    ribbon: '<path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.4-9.5 9-9.5 9z"/><path d="M9 12l2 2 4-4" opacity=".6"/>'
  };

  function iconSVG(name, extra=''){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name] || ICONS.heart}</svg>`;
  }

  /* -----------------------------------------------------
     Letters — content lives here. No photos, no audio,
     no external services. Everything renders offline.
  ----------------------------------------------------- */
  const LETTERS = [
    {
      id: 'happy', title: 'Open When You\u2019re Happy', icon: 'sun',
      body: [
        'If you\u2019re reading this with a smile already on your face \u2014 good. Keep it there a little longer.',
        'Your joy is one of my favourite things in this world. Not the big, loud kind only \u2014 the small kind too. The way your eyes soften when something delights you.',
        'Whatever made you happy today, let it stay with you. You deserve every bit of it, and so much more.'
      ],
      memory: 'A moment worth bottling up \u2014 write it here, someday.'
    },
    {
      id: 'missing', title: 'Open When You\u2019re Missing Me', icon: 'moon',
      body: [
        'Distance is strange \u2014 it doesn\u2019t make the feeling smaller, just quieter.',
        'If you\u2019re missing me right now, close your eyes for a second. I\u2019m there, in the ordinary places: the song you keep replaying, the side of the room that still feels like mine.',
        'I\u2019m missing you too, in the exact same quiet way. That hasn\u2019t changed, and it won\u2019t.'
      ],
      memory: 'Your memory goes here \u2014 a place, a song, a small thing that felt like us.'
    },
    {
      id: 'angry', title: 'Open When You\u2019re Angry At Me', icon: 'spiral',
      body: [
        'First \u2014 you\u2019re allowed to be angry. I won\u2019t ask you to set it down before you\u2019re ready.',
        'If I hurt you, I\u2019m sorry. Not the kind of sorry that wants to end the conversation quickly, but the kind that wants to understand it fully.',
        'Take your time. I\u2019ll still be here when the anger has had its say, ready to listen properly.'
      ],
      memory: 'This page is waiting for another beautiful chapter \u2014 the making-up part.'
    },
    {
      id: 'crying', title: 'Open When You\u2019re Crying', icon: 'drop',
      body: [
        'Let it out. Don\u2019t hold it back on my account \u2014 I\u2019d rather you feel it than fold it away.',
        'I wish I could sit beside you right now, say nothing useful, and just be there while it passes.',
        'Tears aren\u2019t weakness. They\u2019re just love and hurt finding a way out. Be gentle with yourself.'
      ],
      memory: 'A note for the next time \u2014 what helped, who you called, what got you through.'
    },
    {
      id: 'hug', title: 'Open When You Need A Hug', icon: 'embrace',
      body: [
        'Wrap the blanket around you a little tighter \u2014 pretend, for a moment, that it\u2019s my arms instead.',
        'I wish I could hold you properly right now, the way that makes the world go quiet for a while.',
        'Until then, know that you\u2019re held in my thoughts, fully and without condition.'
      ],
      memory: 'Your memory goes here \u2014 the last real hug, and where it happened.'
    },
    {
      id: 'sleep', title: 'Open When You Can\u2019t Sleep', icon: 'candle',
      body: [
        'It\u2019s late, and your mind won\u2019t settle. I understand \u2014 mine does the same on quiet nights.',
        'Let this be your lullaby: you did enough today. Tomorrow doesn\u2019t need you yet.',
        'Dim the light and let yourself rest. I\u2019ll be here in the morning, same as always.'
      ],
      memory: 'This page is waiting for another beautiful chapter \u2014 tell it about tonight.'
    },
    {
      id: 'anxious', title: 'Open When You\u2019re Feeling Anxious', icon: 'bloom',
      body: [
        'Anxiety lies. It tells you the worst version of things and dresses it up as truth.',
        'You are doing better than you think. One step, one breath, one minute at a time \u2014 that\u2019s all anyone is asking of you.',
        'I believe in you fully, even on the days you can\u2019t believe in yourself.'
      ],
      memory: 'A note to yourself \u2014 what usually helps you feel steady again.'
    },
    {
      id: 'lonely', title: 'Open When You Feel Lonely', icon: 'stars',
      body: [
        'Loneliness can sit in a room full of people just as easily as an empty one. I know.',
        'You are thought of, often and warmly, even on the days it doesn\u2019t feel that way.',
        'Reach out \u2014 to me, to someone, to anyone who feels safe. You don\u2019t have to carry quiet rooms alone.'
      ],
      memory: 'Your memory goes here \u2014 someone who made a lonely day feel lighter.'
    }
  ];

  const LAST = { id: 'last', title: 'Open Last', icon: 'ribbon' };

  const FINALE_LINES = [
    'No matter what tomorrow looks like for us, there will never be a day when I stop wishing the very best for you.',
    'No matter where life takes us, a part of my heart will always smile whenever it thinks of you.'
  ];
  const FINALE_SIGN = '\u2014 with love';

  /* -----------------------------------------------------
     Theme toggle
  ----------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(dark){
    root.classList.toggle('dark', dark);
    try{ localStorage.setItem('ow-theme', dark ? 'dark' : 'light'); }catch(e){}
    toggleStars(dark);
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let saved = null;
  try{ saved = localStorage.getItem('ow-theme'); }catch(e){}
  setTheme(saved ? saved === 'dark' : prefersDark);
  themeToggle.addEventListener('click', () => setTheme(!root.classList.contains('dark')));

  /* -----------------------------------------------------
     Starfield (dark mode ambience)
  ----------------------------------------------------- */
  const starsLayer = document.getElementById('stars');
  let starsBuilt = false;
  function toggleStars(on){
    if(on && !starsBuilt){
      const count = window.innerWidth < 640 ? 30 : 55;
      const frag = document.createDocumentFragment();
      for(let i=0;i<count;i++){
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random()*2 + 1;
        s.style.width = size+'px';
        s.style.height = size+'px';
        s.style.left = Math.random()*100+'vw';
        s.style.top = Math.random()*100+'vh';
        s.style.opacity = (Math.random()*.6+.3).toFixed(2);
        if(!reduceMotion){
          s.animate(
            [{ opacity: s.style.opacity }, { opacity: .1 }, { opacity: s.style.opacity }],
            { duration: 2000 + Math.random()*3000, iterations: Infinity, delay: Math.random()*2000 }
          );
        }
        frag.appendChild(s);
      }
      starsLayer.appendChild(frag);
      starsBuilt = true;
    }
  }

  /* -----------------------------------------------------
     Ambient dust + petals
  ----------------------------------------------------- */
  const particleField = document.getElementById('particles');
  if(!reduceMotion){
    const dustCount = window.innerWidth < 640 ? 12 : 22;
    for(let i=0;i<dustCount;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random()*3 + 1.5;
      p.style.width = size+'px'; p.style.height = size+'px';
      p.style.left = Math.random()*100+'vw'; p.style.top = Math.random()*100+'vh';
      p.style.opacity = (Math.random()*.5+.2).toFixed(2);
      particleField.appendChild(p);
      p.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: `translate(${(Math.random()-.5)*60}px, -${Math.random()*100+60}px)` },
          { transform: 'translate(0,0)' }
        ],
        { duration: (Math.random()*10+10)*1000, iterations: Infinity, delay: Math.random()*4000, easing: 'ease-in-out' }
      );
    }
    const petalCount = window.innerWidth < 640 ? 4 : 8;
    for(let i=0;i<petalCount;i++){
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = Math.random()*10 + 8;
      petal.style.width = size+'px'; petal.style.height = (size*.8)+'px';
      petal.style.left = Math.random()*100+'vw'; petal.style.top = '-5vh';
      particleField.appendChild(petal);
      petal.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)' },
          { transform: `translate(${(Math.random()-.5)*200}px, 115vh) rotate(${Math.random()*360}deg)` }
        ],
        { duration: (Math.random()*14+16)*1000, iterations: Infinity, delay: Math.random()*12000, easing: 'linear' }
      );
    }
  }

  /* -----------------------------------------------------
     Custom cursor + magnetic buttons + ripple
  ----------------------------------------------------- */
  if(!isTouch && !reduceMotion){
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx=0,my=0, rx=0, ry=0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
    });
    (function loop(){
      rx += (mx-rx)*.16; ry += (my-ry)*.16;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(loop);
    })();
    function bindCursorTargets(){
      document.querySelectorAll('a, button, .envelope-card').forEach(el => {
        if(el.dataset.cursorBound) return;
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
      });
    }
    bindCursorTargets();
    new MutationObserver(bindCursorTargets).observe(document.body, { childList:true, subtree:true });

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width/2;
        const relY = e.clientY - rect.top - rect.height/2;
        el.style.transform = `translate(${relX*.22}px, ${relY*.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.animate([{ transform: el.style.transform }, { transform: 'translate(0,0)' }],
          { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple-btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size+'px';
    ripple.style.left = (e.clientX - rect.left - size/2)+'px';
    ripple.style.top = (e.clientY - rect.top - size/2)+'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  function burstAt(x, y){
    if(reduceMotion) return;
    const dark = root.classList.contains('dark');
    const colors = dark ? ['#E4C896','#C9A467','#9C9690'] : ['#7C92A8','#5A7894','#DCCBAE'];
    for(let i=0;i<10;i++){
      const p = document.createElement('div');
      p.className = 'click-burst';
      const size = Math.random()*5+3;
      p.style.width = size+'px'; p.style.height = size+'px';
      p.style.left = x+'px'; p.style.top = y+'px';
      p.style.background = `radial-gradient(circle, ${colors[i%colors.length]}, transparent 70%)`;
      document.body.appendChild(p);
      const angle = Math.random()*Math.PI*2;
      const dist = Math.random()*60+30;
      const anim = p.animate(
        [
          { transform:'translate(0,0)', opacity:1 },
          { transform:`translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`, opacity:0 }
        ],
        { duration: 700+Math.random()*400, easing:'cubic-bezier(.16,1,.3,1)' }
      );
      anim.onfinish = () => p.remove();
    }
  }
  document.addEventListener('click', e => {
    if(e.target.closest('button, a, .envelope-card')) burstAt(e.clientX, e.clientY);
  });

  /* -----------------------------------------------------
     Hero entrance + typewriter
  ----------------------------------------------------- */
  document.querySelectorAll('.hero-char').forEach((el, i) => {
    el.style.animationDelay = (0.15 + i*0.035) + 's';
  });

  const TYPE_TEXT = 'Not every gift comes wrapped in paper. Some are meant to stay with you for a lifetime.';
  const typeEl = document.getElementById('typewriter');
  let typeIdx = 0;
  function typeNext(){
    if(typeIdx <= TYPE_TEXT.length){
      typeEl.textContent = TYPE_TEXT.slice(0, typeIdx);
      typeIdx++;
      setTimeout(typeNext, reduceMotion ? 0 : 18 + Math.random()*22);
    } else {
      document.querySelector('.typewriter-cursor')?.classList.add('done');
    }
  }
  setTimeout(typeNext, reduceMotion ? 0 : 1200);

  /* -----------------------------------------------------
     Read-state (purely local, no server)
  ----------------------------------------------------- */
  function getReadSet(){
    try{ return new Set(JSON.parse(localStorage.getItem('ow-read') || '[]')); }
    catch(e){ return new Set(); }
  }
  function markRead(id){
    const set = getReadSet(); set.add(id);
    try{ localStorage.setItem('ow-read', JSON.stringify([...set])); }catch(e){}
  }

  /* -----------------------------------------------------
     Envelope grid
  ----------------------------------------------------- */
  const grid = document.getElementById('envelopeGrid');
  const readSet = getReadSet();

  function envelopeCard(item){
    const card = document.createElement('div');
    card.className = 'envelope-card' + (readSet.has(item.id) ? ' read' : '');
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', 'Open letter: ' + item.title);
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="envelope-front">
        <div class="letter-peek"></div>
        <div class="flap"></div>
        <div class="seal">${iconSVG(item.icon)}</div>
        <div class="env-label">${item.title}</div>
      </div>`;
    return card;
  }

  function renderEnvelopes(){
    grid.innerHTML = '';
    LETTERS.forEach(item => grid.appendChild(envelopeCard(item)));
    const lastWrap = document.createElement('div');
    lastWrap.className = 'envelope-last-wrap';
    lastWrap.appendChild(envelopeCard(LAST));
    grid.appendChild(lastWrap);
    observeReveal(document.querySelectorAll('.envelope-card'));
  }
  renderEnvelopes();

  /* Scroll reveal via IntersectionObserver */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  function observeReveal(nodes){ nodes.forEach(n => revealObserver.observe(n)); }

  /* -----------------------------------------------------
     Open / close sequence
  ----------------------------------------------------- */
  grid.addEventListener('click', e => {
    const card = e.target.closest('.envelope-card');
    if(card) openSequence(card, e);
  });
  grid.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){
      const card = e.target.closest('.envelope-card');
      if(card){ e.preventDefault(); openSequence(card, e); }
    }
  });

  function openSequence(card, evt){
    if(card.classList.contains('open')) return;
    const rect = card.getBoundingClientRect();
    burstAt(evt.clientX ?? rect.x, evt.clientY ?? rect.y);
    card.classList.add('open');
    const id = card.dataset.id;
    setTimeout(() => {
      if(id === 'last'){ playFinale(); }
      else { openLetter(id); markRead(id); card.classList.add('read'); }
    }, reduceMotion ? 80 : 750);
  }

  /* -----------------------------------------------------
     Letter modal render
  ----------------------------------------------------- */
  const overlay = document.getElementById('letterOverlay');
  const sheet = document.getElementById('letterSheet');
  const scrollEl = document.getElementById('letterScroll');
  const progressBar = document.getElementById('reading-progress');

  function signatureSVG(){
    return `<svg class="signature-path" viewBox="0 0 220 60" width="160" height="44" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 40c10-22 18-26 24-10 4 10-2 18-10 14-6-3 2-16 14-18 14-2 18 10 10 16-6 4 4 10 12 2 6-6 10-18 18-16 6 1.5 0 14 8 14 8 0 14-12 22-14 6-1.5 10 6 16 4 8-2.5 12-12 20-12"/>
    </svg>`;
  }

  function openLetter(id){
    const item = LETTERS.find(l => l.id === id);
    if(!item) return;

    let html = '';
    html += iconSVG(item.icon, 'class="letter-illustration" aria-hidden="true"');
    html += `<p class="letter-eyebrow fade-up">a letter for you</p>`;
    html += `<h2 class="letter-title fade-up">${item.title}</h2>`;
    html += `<div class="letter-body">`;
    item.body.forEach(p => { html += `<p class="fade-up">${p}</p>`; });
    html += `</div>`;
    html += `<div class="memory-card fade-up">${iconSVG('bloom')}<p>${item.memory || 'Your memory goes here \u2014 whenever you\u2019re ready to add one.'}</p></div>`;
    html += `<div class="signature-wrap fade-up" style="color:var(--accent)">${signatureSVG()}</div>`;

    sheet.innerHTML = html;
    overlay.style.display = 'block';
    scrollEl.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    progressBar.style.display = 'block';
    progressBar.style.width = '0%';

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      sheet.classList.add('visible');
    });

    const fadeEls = sheet.querySelectorAll('.fade-up');
    fadeEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), reduceMotion ? 0 : 300 + i*90);
    });
    const sigPath = sheet.querySelector('.signature-path');
    if(sigPath){
      setTimeout(() => sigPath.classList.add('drawn'), reduceMotion ? 0 : 300 + fadeEls.length*90 + 400);
    }

    scrollEl.onscroll = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      const pct = max > 0 ? (scrollEl.scrollTop / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
  }

  function closeLetter(){
    sheet.classList.remove('visible');
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.style.display = 'none';
      progressBar.style.display = 'none';
      document.body.style.overflow = '';
      document.querySelectorAll('.envelope-card.open').forEach(c => {
        if(c.dataset.id !== 'last') c.classList.remove('open');
      });
    }, reduceMotion ? 0 : 450);
  }
  document.getElementById('closeLetter').addEventListener('click', closeLetter);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeLetter(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && overlay.style.display === 'block') closeLetter(); });

  /* -----------------------------------------------------
     Finale
  ----------------------------------------------------- */
  const finale = document.getElementById('finale');
  const finaleCandle = document.getElementById('finaleCandle');

  function playFinale(){
    finale.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => finale.classList.add('visible'));

    const l1 = document.getElementById('finaleLine1');
    const l2 = document.getElementById('finaleLine2');
    const l3 = document.getElementById('finaleLine3');
    const btn = document.getElementById('finaleClose');
    l1.textContent = FINALE_LINES[0];
    l2.textContent = FINALE_LINES[1];
    l3.textContent = FINALE_SIGN;

    const t = reduceMotion ? 0 : 1;
    setTimeout(() => l1.classList.add('visible'), (600)*t);
    setTimeout(() => l1.classList.remove('visible'), (3800)*t);
    setTimeout(() => l2.classList.add('visible'), (4200)*t);
    setTimeout(() => l3.classList.add('visible'), (7200)*t);
    setTimeout(() => btn.classList.add('visible'), (7800)*t);
    markRead('last');
    document.querySelector('.envelope-card[data-id="last"]')?.classList.add('read');
  }

  document.getElementById('finaleClose').addEventListener('click', () => {
    finale.classList.remove('visible');
    setTimeout(() => {
      finale.style.display = 'none';
      document.body.style.overflow = '';
      ['finaleLine1','finaleLine2','finaleLine3','finaleClose'].forEach(id => document.getElementById(id).classList.remove('visible'));
      document.querySelectorAll('.envelope-card.open').forEach(c => c.classList.remove('open'));
    }, reduceMotion ? 0 : 800);
  });

  /* candle flicker on the finale screen */
  if(finaleCandle && !reduceMotion){
    finaleCandle.querySelector('.flame')?.animate(
      [{ transform:'scaleY(1) skewX(0deg)' }, { transform:'scaleY(1.08) skewX(-2deg)' }, { transform:'scaleY(.96) skewX(2deg)' }, { transform:'scaleY(1) skewX(0deg)' }],
      { duration: 2200, iterations: Infinity, easing:'ease-in-out' }
    );
  }
})();
