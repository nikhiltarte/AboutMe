const setYear = () => {
  const span = document.getElementById('year');
  if (span) span.textContent = new Date().getFullYear();
};

const enableScrollReveals = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const revealables = document.querySelectorAll(
    '.pod-card, .timeline-card, .passion-grid article, .floating-metrics article, .hero-portrait'
  );
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  revealables.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
};

const enablePodTilt = () => {
  const pod = document.querySelector('.hero-pod');
  if (!pod) return;
  const bounds = () => pod.getBoundingClientRect();
  let frame;
  const handlePointer = event => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = bounds();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (y * -6).toFixed(2);
      const rotateY = (x * 6).toFixed(2);
      pod.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  };
  const reset = () => {
    pod.style.transform = '';
  };
  pod.addEventListener('pointermove', handlePointer);
  pod.addEventListener('pointerleave', reset);
};

const initThemeToggle = () => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const label = toggle.querySelector('.toggle-label');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = theme => {
    const isLight = theme === 'light';
    document.body.classList.toggle('theme-light', isLight);
    toggle.setAttribute('aria-pressed', String(isLight));
    if (label) {
      label.textContent = isLight ? 'Dark' : 'Light';
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage failures
    }
  };
  const stored = (() => {
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  })();
  applyTheme(stored || (prefersDark.matches ? 'dark' : 'light'));
  toggle.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(next);
  });
  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', event => {
      const storedTheme = (() => {
        try {
          return localStorage.getItem('theme');
        } catch {
          return null;
        }
      })();
      if (!storedTheme) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }
};

const enableSmoothAnchors = () => {
  const header = document.querySelector('.site-header');
  const offset = header ? header.offsetHeight - 20 : 0;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const top =
        window.scrollY + target.getBoundingClientRect().top - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

setYear();
enableScrollReveals();
enablePodTilt();
initThemeToggle();
enableSmoothAnchors();
