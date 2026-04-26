/* ═══════════════════════════════════════
   KOHINOOR CATERER — EXPERIENTIAL LOGIC
   Tech: GSAP, Three.js, Lenis, Splitting
   ═══════════════════════════════════════ */

const init = () => {

  // 1. Initialise Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Prepare Text Splitting
  Splitting({ target: '.brand-name', by: 'chars' });
  Splitting({ target: '.hero-line', by: 'words' });

  // Prevent FOUC from Splitting by ensuring opacity 0 is handled by CSS initially,
  // but Splitting wraps them in spans, so we target the spans in GSAP.

  // 3. Custom Cursor Logic (Desktop Only)
  const cursor = document.querySelector('.cursor');
  const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

  if (!isTouchDevice) {
    // GSAP quickTo for smooth cursor follow
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Hover states for cursor
    const interactables = document.querySelectorAll('a, button');
    const enquireBtn = document.querySelector('.enquire-btn');

    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (el === enquireBtn || el.closest('.enquire-btn')) {
          // CTA button: cursor fades out so the button glow takes focus
          gsap.to(cursor, { scale: 0.4, opacity: 0, duration: 0.3 });
        } else {
          gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(201,168,76,0.1)', borderColor: '#FFFFFF', duration: 0.3 });
        }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, opacity: 1, backgroundColor: 'transparent', borderColor: '#C9A84C', duration: 0.3 });
      });
    });

    window.addEventListener('mousedown', () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
    window.addEventListener('mouseup', () => gsap.to(cursor, { scale: 1, duration: 0.1 }));
  }

  // 4. Periodic Shimmer Sweep on CTA Button
  const btn = document.querySelector('.enquire-btn');
  if (btn) {
    // Trigger the shimmer sweep periodically for a premium idle glow
    const triggerShimmer = () => {
      const shimmer = btn.querySelector('::before'); // CSS handles via animation
      btn.classList.remove('shimmer-active');
      void btn.offsetWidth; // Force reflow
      btn.classList.add('shimmer-active');
    };

    // Auto-shimmer every 4 seconds after initial page load
    setTimeout(() => {
      setInterval(() => {
        if (!btn.matches(':hover')) {
          btn.classList.add('shimmer-active');
          setTimeout(() => btn.classList.remove('shimmer-active'), 800);
        }
      }, 4000);
    }, 3500); // Start after entrance animations complete
  }

  // 5. Removed Three.js ambient field (replaced with cinematic video)

  // 6. Master GSAP Animation Timeline
  // Wait a tiny bit to ensure fonts/splitting are ready
  setTimeout(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl
      // 0.0s — Page starts dark (body opacity 0 -> 1)
      .to('body', { opacity: 1, duration: 0.1 })

      // 0.0s — Cinematic video fades in
      .to('.ambient-video', { opacity: 1, duration: 2 }, 0)

      // 0.5s — Logo mark descends
      .to('.logo-mark', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: -20, scale: 0.9 } }, 0.5)

      // 1.1s — Ornament divider draws itself
      .to('.divider-line-left', { strokeDashoffset: 0, duration: 0.7 }, 1.1)
      .to('.divider-line-right', { strokeDashoffset: 0, duration: 0.7 }, 1.1)
      .to('.divider-diamond', { scale: 1, duration: 0.5, ease: "back.out(3)", startAt: { scale: 0, transformOrigin: "50% 50%" } }, 1.4)

      // 1.4s — Hero line words
      .to('.hero-line .word', { opacity: 1, y: 0, stagger: 0.07, duration: 0.9, startAt: { opacity: 0, y: 20 } }, 1.4)

      // 1.9s — Sub-descriptor
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 10 } }, 1.9)

      // 2.2s — Glass CTA surface rises
      .to('.cta-surface', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: 30, scale: 0.97 } }, 2.2)

      // 2.5s — Contact strip
      .to('.contact-strip', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 12 } }, 2.5)

      // 2.8s — Legal
      .to('.legal', { opacity: 1, duration: 0.8 }, 2.8);

  }, 100);

}; // End of init function

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// End of file
