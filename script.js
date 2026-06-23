/* ============================================================
   Nova AI — Script
   ============================================================ */

(() => {
  'use strict';

  // ─── DOM cache ────────────────────────────────────────────
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const faqItems    = document.querySelectorAll('.faq-item');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  // ─── Scroll → sticky header ──────────────────────────────
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile menu ─────────────────────────────────────────
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ─── FAQ accordion ───────────────────────────────────────
  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn    = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.style.maxHeight = null;
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── Contact form (front-end only) ───────────────────────
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name    = contactForm.querySelector('#contact-name');
    const email   = contactForm.querySelector('#contact-email');
    const message = contactForm.querySelector('#contact-message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      return;
    }

    // Simulate success
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');

    // Reset after 4s
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = '';
      formSuccess.classList.remove('show');
    }, 4000);
  });

  // ─── Counter animation ───────────────────────────────────
  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = eased * target;

      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.floor(current).toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // ─── Scroll reveal — IntersectionObserver fallback ───────
  // Only run the JS-based reveal if the browser lacks native
  // CSS scroll-driven animation support.
  const needsFallback = !CSS.supports?.(
    '(animation-timeline: view()) and (animation-range: entry)'
  );

  if (needsFallback) {
    const revealElements = document.querySelectorAll('.reveal');

    // Apply initial hidden state
    revealElements.forEach(el => el.classList.add('is-hidden'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-hidden');
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ─── Stat counter trigger ────────────────────────────────
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ─── Smooth scroll for anchor links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ─── Staggered reveal for grid children ──────────────────
  if (needsFallback) {
    const grids = document.querySelectorAll(
      '.features-grid, .testimonials-grid, .pricing-grid'
    );

    grids.forEach(grid => {
      const gridObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const cards = grid.querySelectorAll('.reveal');
              cards.forEach((card, i) => {
                setTimeout(() => {
                  card.classList.remove('is-hidden');
                  card.classList.add('is-visible');
                }, i * 120);
              });
              gridObserver.unobserve(grid);
            }
          });
        },
        { threshold: 0.1 }
      );
      gridObserver.observe(grid);
    });
  }
})();
