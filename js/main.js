/* ===========================
   ODKAZY A CV
   Prázdná hodnota = tlačítko / ikona se na webu nezobrazí.
   CV soubory patří do složky cv/.
=========================== */
const LINKS = {
  cvCs:     'cv/Jan-Sulak-CV-CZ.pdf',
  cvEn:     'cv/Jan-Sulak-CV-EN.pdf',
  linkedin: '',  // např. 'https://www.linkedin.com/in/...'
  github:   '',  // např. 'https://github.com/...'
  credly:   '',  // např. 'https://www.credly.com/users/...'
};

/* ===========================
   PARTICLE NETWORK CANVAS
=========================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], RAF;
  const mouse = { x: null, y: null };
  const MOUSE_DIST = 200;
  const MOBILE     = window.innerWidth < 768;
  const NODE_COUNT = MOBILE ? 35 : 70;
  const MAX_DIST   = MOBILE ? 120 : 160;
  const ACCENT     = '0,229,255';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Node() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r  = Math.random() * 2 + 1;
  }
  Node.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    nodes = Array.from({ length: NODE_COUNT }, () => new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.update();
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT},.7)`;
      ctx.fill();

      if (mouse.x !== null) {
        const mx = a.x - mouse.x, my = a.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < MOUSE_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - md / MOUSE_DIST) * .45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / MAX_DIST) * .18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    RAF = requestAnimationFrame(draw);
  }

  // Pozastavit animaci, když záložka není vidět (šetří CPU a baterii)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(RAF);
    else RAF = requestAnimationFrame(draw);
  });

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
  resize();
  init();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(n => { n.vx = n.vy = 0; });
  }
  draw();
})();


/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
const navbar   = document.getElementById('navbar');
const progress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  document.body.classList.toggle('show-top', window.scrollY > window.innerHeight);
}, { passive: true });


/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ===========================
   REVEAL ON SCROLL
=========================== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));


/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target + (target >= 20 ? '+' : '');
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterIO.observe(el));


/* ===========================
   TERMINAL TYPEWRITER
=========================== */
const TERMINAL_LINES = {
  cs: [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'jan.sulak — IT End User Support, Ing. student' },
    { type: 'prompt', text: 'cat /etc/company' },
    { type: 'out',    text: 'Euromedia Group, a.s.' },
    { type: 'prompt', text: 'ticket --status #4021' },
    { type: 'ok',     text: '✔ Vyřešeno — tiskárna opět online (2 min)' },
    { type: 'prompt', text: 'cat skills.txt' },
    { type: 'out',    text: 'Windows | M365 | AD     | Helpdesk' },
    { type: 'out',    text: 'MikroTik | GPON | TCP/IP | Zabbix' },
    { type: 'out',    text: 'Proxmox  | Python | Bash  | Git' },
    { type: 'prompt', text: 'echo $MOTTO' },
    { type: 'ok',     text: '✔ Každý problém má řešení' },
  ],
  en: [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'jan.sulak — IT End User Support, MSc student' },
    { type: 'prompt', text: 'cat /etc/company' },
    { type: 'out',    text: 'Euromedia Group, a.s.' },
    { type: 'prompt', text: 'ticket --status #4021' },
    { type: 'ok',     text: '✔ Resolved — printer back online (2 min)' },
    { type: 'prompt', text: 'cat skills.txt' },
    { type: 'out',    text: 'Windows | M365 | AD     | Helpdesk' },
    { type: 'out',    text: 'MikroTik | GPON | TCP/IP | Zabbix' },
    { type: 'out',    text: 'Proxmox  | Python | Bash  | Git' },
    { type: 'prompt', text: 'echo $MOTTO' },
    { type: 'ok',     text: '✔ Every problem has a solution' },
  ],
};

const terminal = (function () {
  const body = document.getElementById('terminal-body');
  let run = 0; // při restartu zneplatní běžící časovače

  function start(lang) {
    if (!body) return;
    const id = ++run;
    const lines = TERMINAL_LINES[lang] || TERMINAL_LINES.cs;
    body.innerHTML = '';
    let lineIdx = 0, charIdx = 0, currentEl = null, cursorEl = null;

    function later(fn, ms) { setTimeout(() => { if (id === run) fn(); }, ms); }

    function nextLine() {
      if (lineIdx >= lines.length) {
        if (cursorEl) cursorEl.remove();
        const end = document.createElement('div');
        end.innerHTML = '<span class="t-prompt">jan@network:~$ </span><span class="t-cursor"></span>';
        body.appendChild(end);
        body.scrollTop = body.scrollHeight;
        return;
      }
      const line = lines[lineIdx];
      const row  = document.createElement('div');
      if (cursorEl) cursorEl.remove();
      if (line.type === 'prompt') {
        row.innerHTML = '<span class="t-prompt">jan@network:~$ </span><span class="t-cmd"></span>';
        body.appendChild(row);
        currentEl = row.querySelector('.t-cmd');
        cursorEl = document.createElement('span');
        cursorEl.className = 't-cursor';
        row.appendChild(cursorEl);
      } else {
        row.className = `t-${line.type}`;
        body.appendChild(row);
        currentEl = row;
      }
      typeChars(line.text);
    }

    function typeChars(text) {
      if (charIdx < text.length) {
        currentEl.textContent += text[charIdx++];
        body.scrollTop = body.scrollHeight;
        later(() => typeChars(text), 38 + Math.random() * 30);
      } else {
        charIdx = 0;
        lineIdx++;
        later(nextLine, lines[lineIdx - 1].type === 'prompt' ? 500 : 120);
      }
    }

    later(nextLine, 800);
  }

  return { start };
})();


/* ===========================
   CONTACT FORM (DEMO)
=========================== */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = document.documentElement.lang === 'en' ? '✔ Sent!' : '✔ Odesláno!';
  btn.style.background = '#28c840';
  btn.style.borderColor = '#28c840';
  btn.style.color = '#000';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.cssText = '';
    this.reset();
  }, 3000);
});


/* ===========================
   ACTIVE NAV LINK
=========================== */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });


/* ===========================
   ROLE ROTATOR (HERO)
=========================== */
(function () {
  const el = document.getElementById('role-rotator');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ROLES = {
    cs: ['IT End User Support', 'Síťový specialista', 'Telekomunikační technik', 'Ing. student @ VŠB-TUO'],
    en: ['IT End User Support', 'Network specialist', 'Telecommunications technician', 'MSc student @ VŠB-TUO'],
  };
  let roles = ROLES.cs;
  let r = 0, c = roles[0].length, deleting = true;

  function tick() {
    roles = ROLES[document.documentElement.lang] || ROLES.cs;
    if (r >= roles.length) r = 0;
    const word = roles[r];
    if (deleting) {
      el.textContent = word.slice(0, --c);
      if (c === 0) { deleting = false; r = (r + 1) % roles.length; }
      setTimeout(tick, 35);
    } else {
      el.textContent = roles[r].slice(0, ++c);
      if (c === roles[r].length) { deleting = true; setTimeout(tick, 2200); }
      else setTimeout(tick, 70);
    }
  }
  setTimeout(tick, 2600);
})();


/* ===========================
   CARD SPOTLIGHT
=========================== */
document.querySelectorAll('.tl-card, .edu-card, .cert-card, .hobby-card, .stat-card').forEach(card => {
  card.classList.add('spotlight');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
});


/* ===========================
   LANGUAGE SWITCH (CZ / EN)
   Český text je přímo v HTML, anglický v atributu data-en.
=========================== */
(function () {
  const META = {
    cs: {
      title: 'Bc. Jan Šulák – Portfolio',
      desc:  'Jan Šulák – IT End User Support v Euromedia Group, a.s., absolvent VŠB-TUO (Telekomunikační technika). Sítě, MikroTik, GPON, Windows, Microsoft 365.',
      toggle: 'Switch language to English',
      top: 'Zpět nahoru',
    },
    en: {
      title: 'Bc. Jan Šulák – Portfolio',
      desc:  'Jan Šulák – IT End User Support at Euromedia Group, a.s., VŠB-TUO graduate (Telecommunication Engineering). Networking, MikroTik, GPON, Windows, Microsoft 365.',
      toggle: 'Přepnout do češtiny',
      top: 'Back to top',
    },
  };
  const toggle = document.getElementById('lang-toggle');
  const descEl = document.querySelector('meta[name="description"]');
  const topEl  = document.querySelector('.back-to-top');

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.dataset.cs === undefined) el.dataset.cs = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.cs;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
      if (el.dataset.csPlaceholder === undefined) el.dataset.csPlaceholder = el.placeholder;
      el.placeholder = lang === 'en' ? el.dataset.enPlaceholder : el.dataset.csPlaceholder;
    });
    document.title = META[lang].title;
    if (descEl) descEl.content = META[lang].desc;
    toggle.setAttribute('aria-label', META[lang].toggle);
    if (topEl) topEl.setAttribute('aria-label', META[lang].top);
    terminal.start(lang);
    applyLinks(lang);
  }

  function applyLinks(lang) {
    // CV v jazyce stránky, jinak to druhé, pokud existuje
    const cv = lang === 'en' ? (LINKS.cvEn || LINKS.cvCs) : (LINKS.cvCs || LINKS.cvEn);
    document.querySelectorAll('[data-link]').forEach(el => {
      const url = el.dataset.link === 'cv' ? cv : LINKS[el.dataset.link];
      el.hidden = !url;
      if (url) el.href = url;
    });
    document.querySelectorAll('.social-links').forEach(box => {
      box.hidden = !box.querySelector('[data-link]:not([hidden])');
    });
  }

  let lang = 'cs';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    lang = q === 'en' || q === 'cs' ? q : (localStorage.getItem('lang') || 'cs');
  } catch (e) { /* bez localStorage zůstane čeština */ }
  apply(lang);

  toggle.addEventListener('click', () => {
    lang = lang === 'cs' ? 'en' : 'cs';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    apply(lang);
  });
})();
