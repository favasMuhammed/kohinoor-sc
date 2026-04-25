(function () {
  'use strict';

  /* ═══════════════════════════════════════
     GSAP
     ═══════════════════════════════════════ */
  
  // 1. Master Timeline Entrance
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Initial states
  gsap.set('.reveal-item', { opacity: 0, y: 30 });
  gsap.set('.headline', { opacity: 0, y: 40 });

  tl
    // Fade in cinematic video panel
    .to('.panel-visual', {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power3.out'
    }, 0)
    // Fade in top info
    .to('.info-top', {
      opacity: 1,
      y: 0,
      duration: 1.2
    }, 0.2)
    // Fade in overline
    .to('.overline', {
      opacity: 1,
      y: 0,
      duration: 1
    }, 0.4)
    // Fade in headline
    .to('.headline', {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out'
    }, 0.6)
    // Fade in body
    .to('.body-text', {
      opacity: 1,
      y: 0,
      duration: 1
    }, 1.2)
    // Fade in buttons
    .to('.cta-wrapper', {
      opacity: 1,
      y: 0,
      duration: 1
    }, 1.4)
    // Fade in bottom grid
    .to('.info-bottom', {
      opacity: 1,
      y: 0,
      duration: 1
    }, 1.6);

})();
