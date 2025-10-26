const setYear = () => {
  const span = document.getElementById('year');
  if (span) span.textContent = new Date().getFullYear();
  const exp = document.getElementById('experienceYears');
  if (exp) {
    const startYear = 2016;
    const currentYear = new Date().getFullYear();
    exp.textContent = Math.max(currentYear - startYear, 8);
  }
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
  if (stored) {
    applyTheme(stored);
  } else {
    const hour = new Date().getHours();
    const daylight = hour >= 7 && hour < 19;
    applyTheme(daylight ? 'light' : 'dark');
  }
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

const initNavIndicator = () => {
  const nav = document.querySelector('.site-nav');
  const indicator = nav?.querySelector('.nav-indicator');
  const chips = nav ? Array.from(nav.querySelectorAll('.nav-chip')) : [];
  if (!nav || !indicator || chips.length === 0) return;

  const setIndicator = chip => {
    const navRect = nav.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    indicator.style.width = `${chipRect.width}px`;
    indicator.style.transform = `translate3d(${chipRect.left - navRect.left}px, 0, 0)`;
  };

  const setActive = chip => {
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    setIndicator(chip);
  };

  const sectionMap = new Map();
  chips.forEach(chip => {
    const id = chip.dataset.section;
    const section = id ? document.getElementById(id) : null;
    if (section) {
      sectionMap.set(section, chip);
    }
    chip.addEventListener('click', () => setActive(chip));
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chip = sectionMap.get(entry.target);
          if (chip) setActive(chip);
        }
      });
    },
    { threshold: 0.4 }
  );
  sectionMap.forEach((_, section) => observer.observe(section));

  window.addEventListener('resize', () => {
    const active = chips.find(chip => chip.classList.contains('is-active'));
    if (active) setIndicator(active);
  });

  setIndicator(chips[0]);
};

setYear();
enableScrollReveals();
enablePodTilt();
initThemeToggle();
enableSmoothAnchors();
initNavIndicator();
