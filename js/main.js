/* ===========================
   PARTICLE NETWORK CANVAS
=========================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], RAF;
  const NODE_COUNT = 70;
  const MAX_DIST   = 160;
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

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();


/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


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
   SKILL BARS
=========================== */
const barFills = document.querySelectorAll('.bar-fill');
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.w + '%';
      barIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
barFills.forEach(el => barIO.observe(el));


/* ===========================
   TERMINAL TYPEWRITER
=========================== */
(function () {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'jan.sulak — Správce sítě, Ing. student' },
    { type: 'prompt', text: 'ping -c 3 vsb.cz' },
    { type: 'ok',     text: '64 bytes from vsb.cz: time=1.4ms' },
    { type: 'ok',     text: '64 bytes from vsb.cz: time=1.1ms' },
    { type: 'ok',     text: '64 bytes from vsb.cz: time=0.9ms' },
    { type: 'prompt', text: 'cat skills.txt' },
    { type: 'out',    text: 'MikroTik | GPON | TCP/IP | Zabbix' },
    { type: 'out',    text: 'Proxmox  | Python | Bash  | Git' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'ok',     text: '✔ Dostupný pro nové projekty' },
    { type: 'prompt', text: '' },
  ];

  let lineIdx = 0, charIdx = 0;
  let currentEl = null;
  let cursorEl  = null;

  function nextLine() {
    if (lineIdx >= lines.length) {
      if (cursorEl) cursorEl.remove();
      const end = document.createElement('span');
      end.className = 't-prompt';
      end.innerHTML = '<span class="t-prompt">jan@network:~$ </span><span class="t-cursor"></span>';
      body.appendChild(end);
      return;
    }

    const line = lines[lineIdx];
    const row  = document.createElement('div');

    if (line.type === 'prompt') {
      row.innerHTML = `<span class="t-prompt">jan@network:~$ </span><span class="t-cmd"></span>`;
      body.appendChild(row);
      currentEl = row.querySelector('.t-cmd');
      if (cursorEl) cursorEl.remove();
      cursorEl = document.createElement('span');
      cursorEl.className = 't-cursor';
      row.appendChild(cursorEl);
      typeChars(line.text);
    } else {
      row.className = `t-${line.type}`;
      body.appendChild(row);
      currentEl = row;
      if (cursorEl) cursorEl.remove();
      typeChars(line.text);
    }
    body.scrollTop = body.scrollHeight;
  }

  function typeChars(text) {
    if (charIdx < text.length) {
      currentEl.textContent += text[charIdx++];
      body.scrollTop = body.scrollHeight;
      setTimeout(typeChars.bind(null, text), 38 + Math.random() * 30);
    } else {
      charIdx = 0;
      lineIdx++;
      const delay = lines[lineIdx - 1].type === 'prompt' ? 500 : 120;
      setTimeout(nextLine, delay);
    }
  }

  setTimeout(nextLine, 800);
})();


/* ===========================
   CONTACT FORM (DEMO)
=========================== */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = '✔ Odesláno!';
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
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
}, { passive: true });
