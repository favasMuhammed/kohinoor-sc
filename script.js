(function () {
  'use strict';

  /* ═══════════════════════════════════════
     LENIS — Smooth scroll
     ═══════════════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ═══════════════════════════════════════
     GSAP
     ═══════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════
     HERO TEXT SPLIT — Word-by-word reveal
     ═══════════════════════════════════════ */
  const headline = document.getElementById('hero-headline');

  if (headline) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headline.innerHTML;
    let result = '';

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((w) => {
          if (w.trim()) {
            result += '<span class="word-mask"><span class="word">' + w + '</span></span>';
          } else {
            result += w;
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        result += '<' + tag + '>';
        node.childNodes.forEach(processNode);
        result += '</' + tag + '>';
      }
    }

    tempDiv.childNodes.forEach(processNode);
    headline.innerHTML = result;
  }

  /* ═══════════════════════════════════════
     HERO TIMELINE — Orchestrated entrance
     ═══════════════════════════════════════ */
  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.2,
  });

  heroTl
    // Logo and tagline
    .from('.hero-logo', {
      opacity: 0, y: -25, duration: 0.9,
    })
    // Top gold rule draws from center
    .from('.hero-rule-top', {
      scaleX: 0, opacity: 0, duration: 0.7,
    }, '-=0.3')
    // Headline words cascade up
    .to('.hero-headline .word', {
      y: 0, duration: 1.3, stagger: 0.065, ease: 'power4.out',
    }, '-=0.2')
    // Bottom gold rule
    .from('.hero-rule-bottom', {
      scaleX: 0, opacity: 0, duration: 0.7,
    }, '-=0.5')
    // Body text
    .from('.hero-body', {
      opacity: 0, y: 28, duration: 1,
    }, '-=0.3')
    // CTAs
    .from('.hero-ctas', {
      opacity: 0, y: 22, duration: 0.9,
    }, '-=0.5')
    // Micro-copy
    .from('.hero-micro', {
      opacity: 0, duration: 0.7,
    }, '-=0.4')
    // Scroll indicator
    .from('.scroll-indicator', {
      opacity: 0, y: -12, duration: 0.8,
    }, '-=0.3');

  /* ═══════════════════════════════════════
     SCROLL REVEALS
     ═══════════════════════════════════════ */
  gsap.utils.toArray('.reveal').forEach((el) => {
    // Skip hero elements (handled by timeline)
    if (el.closest('.hero')) return;

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Set initial state for non-hero reveals
    gsap.set(el, { y: 40 });
  });

  /* ═══════════════════════════════════════
     PARALLAX — Showcase image
     ═══════════════════════════════════════ */
  const parallaxImg = document.getElementById('parallax-img');

  if (parallaxImg) {
    gsap.to(parallaxImg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#showcase',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  /* ═══════════════════════════════════════
     SHOWCASE CAPTION — Fade in on scroll
     ═══════════════════════════════════════ */
  gsap.from('.showcase-caption', {
    scrollTrigger: {
      trigger: '.showcase',
      start: 'top 40%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power3.out',
  });

})();
