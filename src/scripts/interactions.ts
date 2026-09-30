/**
 * Interaksi global (dimuat di setiap halaman, ±1 KB):
 * - scroll reveal ([data-reveal])
 * - count-up statistik ([data-countup])
 * - toggle tema ([data-theme-toggle])
 * - menu mobile ([data-menu-toggle])
 * - tombol salin pada blok kode artikel
 * Semua animasi menghormati prefers-reduced-motion.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll reveal */
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* Count-up */
const counters = document.querySelectorAll<HTMLElement>('[data-countup]');
const runCount = (el: HTMLElement) => {
  const target = Number(el.dataset.countup);
  if (reduceMotion || !Number.isFinite(target)) {
    el.textContent = String(target);
    return;
  }
  const start = performance.now();
  const dur = 1400;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if (counters.length) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        runCount(e.target as HTMLElement);
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* Toggle tema */
const root = document.documentElement;
const syncThemeButtons = () => {
  const isDark = root.dataset.theme !== 'light';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(!isDark)));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0A0A0A' : '#FFFFFF');
};
syncThemeButtons();
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    syncThemeButtons();
  }),
);

/* Menu mobile */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('mobile-menu');
if (menuBtn && menu) {
  const setOpen = (open: boolean) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/* Navbar: tambahkan border saat halaman di-scroll */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Tombol salin di blok kode */
document.querySelectorAll<HTMLPreElement>('.prose-cendera pre').forEach((pre) => {
  const wrap = document.createElement('div');
  wrap.className = 'code-block';
  pre.replaceWith(wrap);
  wrap.appendChild(pre);
  const lang = pre.dataset.language;
  if (lang && lang !== 'plaintext') {
    const tag = document.createElement('span');
    tag.className = 'code-lang';
    tag.textContent = lang;
    wrap.appendChild(tag);
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = 'Salin';
  btn.setAttribute('aria-label', 'Salin kode');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText);
      btn.textContent = 'Tersalin ✓';
    } catch {
      btn.textContent = 'Gagal';
    }
    setTimeout(() => (btn.textContent = 'Salin'), 1800);
  });
  wrap.appendChild(btn);
});
