/* ============================================================
   1. NAVBAR — scroll state + menu mobile
   ============================================================ */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-links');

  // Adiciona classe "scrolled" quando rolar
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open', !expanded);
  });

  // Fecha menu ao clicar em um link
  navList?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navList.classList.remove('open');
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      toggle?.setAttribute('aria-expanded', 'false');
      navList?.classList.remove('open');
    }
  });
})();


/* ============================================================
   2. TYPING EFFECT — hero accent
   ============================================================ */
(function initTyping() {
  const target = document.querySelector('.typing-target');
  if (!target) return;

  // Respeita preferência de redução de movimento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const words   = ['Developer.', 'Engineer.', 'Builder.'];
  const pause   = 2200;   // ms pausado na palavra completa
  const typeMs  = 80;     // ms por caractere ao digitar
  const eraseMs = 45;     // ms por caractere ao apagar

  let wordIndex = 0;
  let charIndex = 0;
  let erasing   = false;

  // Remove o cursor CSS estático — o JS vai controlar
  target.style.setProperty('--cursor-visible', '1');

  function tick() {
    const currentWord = words[wordIndex];

    if (!erasing) {
      // Digita
      target.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        // Palavra completa: pausa antes de apagar
        erasing = true;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typeMs);

    } else {
      // Apaga
      target.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Apagou tudo: próxima palavra
        erasing   = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, eraseMs);
    }
  }

  // Inicia após a animação de entrada do hero (0.7s delay + 0.7s duration)
  setTimeout(tick, 1600);
})();


/* ============================================================
   3. SCROLL REVEAL — fade-up nas seções
   ============================================================ */
(function initScrollReveal() {
  // Adiciona a classe .reveal nos elementos alvo
  const targets = [
    '.section-label',
    '.section-title',
    '.about-text',
    '.about-facts',
    '.stack-group',
    '.project-card',
    '.contact-description',
    '.section-contact .btn',
    '.social-links',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Adiciona .reveal-stagger nos grupos de stack e projetos
  document.querySelectorAll('.stack-grid, .projects-grid').forEach(el => {
    el.classList.add('reveal-stagger');
    // Remove .reveal individual dos filhos (evita conflito)
    el.querySelectorAll('.reveal').forEach(child => {
      child.classList.remove('reveal');
    });
  });

  // IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // dispara só uma vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      observer.observe(el);
    });

  } else {
    // Fallback: torna tudo visível imediatamente
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      el.classList.add('visible');
    });
  }
})();


/* ============================================================
   4. ACTIVE NAV LINK — destaca link da seção atual
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.removeAttribute('aria-current');
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.setAttribute('aria-current', 'page');
          }
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => observer.observe(section));
})();


/* ============================================================
   5. FOOTER — ano dinâmico
   ============================================================ */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================================
   6. SMOOTH SCROLL — fallback para browsers sem suporte nativo
   ============================================================ */
(function initSmoothScroll() {
  if (CSS.supports('scroll-behavior', 'smooth')) return; // já tem suporte nativo

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();