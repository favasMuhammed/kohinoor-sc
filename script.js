(function () {
  'use strict';

  /* ═══════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ═══════════════════════════════════════
     GSAP SETUP
     ═══════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════
     CUSTOM CURSOR
     ═══════════════════════════════════════ */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && dot && ring) {
    let mx = 0, my = 0;
    let dx = 0, dy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function animateRing() {
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      ring.style.left = dx + 'px';
      ring.style.top = dy + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const interactives = document.querySelectorAll('a, button, .magnetic, input');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ═══════════════════════════════════════
     HERO TEXT REVEAL (word-by-word)
     ═══════════════════════════════════════ */
  const headline = document.getElementById('hero-headline');

  if (headline) {
    // Split text into words, preserving <em> tags
    const html = headline.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let result = '';
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach((w) => {
          if (w.trim()) {
            result += `<span class="word-mask"><span class="word">${w}</span></span>`;
          } else {
            result += w;
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        result += `<${tag}>`;
        node.childNodes.forEach(processNode);
        result += `</${tag}>`;
      }
    }
    tempDiv.childNodes.forEach(processNode);
    headline.innerHTML = result;

    // Animate words in
    gsap.to('.hero-headline .word', {
      y: 0,
      duration: 1.4,
      ease: 'power4.out',
      stagger: 0.07,
      delay: 0.6,
    });
  }

  /* ═══════════════════════════════════════
     SCROLL-TRIGGERED REVEALS
     ═══════════════════════════════════════ */
  const reveals = gsap.utils.toArray('.reveal');

  reveals.forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: el.closest('.contact-grid') ? (Array.from(el.parentElement.children).indexOf(el)) * 0.1 : 0,
    });
  });

  /* ═══════════════════════════════════════
     PARALLAX IMAGE
     ═══════════════════════════════════════ */
  const parallaxImg = document.getElementById('parallax-img');

  if (parallaxImg) {
    gsap.to(parallaxImg, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#showcase',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  }

  /* ═══════════════════════════════════════
     MAGNETIC BUTTONS
     ═══════════════════════════════════════ */
  if (!isTouch) {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.25;

        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  /* ═══════════════════════════════════════
     HERO OVERLINE + MICRO ENTRANCE
     ═══════════════════════════════════════ */
  gsap.from('.hero-overline', {
    opacity: 0, y: 20,
    duration: 0.8, ease: 'power3.out', delay: 0.3,
  });

  gsap.from('.hero-divider', {
    opacity: 0, scaleX: 0,
    duration: 0.8, ease: 'power3.out', delay: 1.4,
  });

  gsap.from('.hero-body', {
    opacity: 0, y: 30,
    duration: 1, ease: 'power3.out', delay: 1.6,
  });

  gsap.from('.hero-cta-panel', {
    opacity: 0, y: 25, scale: 0.97,
    duration: 0.9, ease: 'power3.out', delay: 1.9,
  });

  gsap.from('.hero-micro', {
    opacity: 0, y: 15,
    duration: 0.7, ease: 'power3.out', delay: 2.2,
  });

  /* ═══════════════════════════════════════
     HEADER ENTRANCE
     ═══════════════════════════════════════ */
  gsap.from('.header-inner', {
    opacity: 0, y: -20,
    duration: 0.9, ease: 'power3.out', delay: 0.1,
  });

})();
