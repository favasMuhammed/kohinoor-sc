/* ═══════════════════════════════════════
   KOHINOOR CATERER — EXPERIENTIAL LOGIC
   Tech: GSAP, Splitting
   ═══════════════════════════════════════ */

const init = () => {

  // 1. Prepare Text Splitting
  Splitting({ target: '.hero-line', by: 'words' });

  // 2. Custom Cursor Logic (Desktop Only)
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

  // 3. Periodic Shimmer Sweep on CTA Button
  const btn = document.querySelector('.enquire-btn');
  if (btn) {
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

  // 4. Master GSAP Animation Timeline
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

      // 1.0s — Welcome heading fades in
      .to('.welcome-heading', { opacity: 1, y: 0, duration: 0.8, startAt: { opacity: 0, y: 12 } }, 1.0)

      // 1.3s — Ornament divider draws itself
      .to('.divider-line-left', { strokeDashoffset: 0, duration: 0.7 }, 1.3)
      .to('.divider-line-right', { strokeDashoffset: 0, duration: 0.7 }, 1.3)
      .to('.divider-diamond', { scale: 1, duration: 0.5, ease: "back.out(3)", startAt: { scale: 0, transformOrigin: "50% 50%" } }, 1.6)

      // 1.7s — Hero line words
      .to('.hero-line .word', { opacity: 1, y: 0, stagger: 0.08, duration: 0.9, startAt: { opacity: 0, y: 20 } }, 1.7)

      // 2.2s — Welcome text fades in and rises
      .to('.welcome-text', { opacity: 1, y: 0, duration: 0.9, startAt: { y: 16 } }, 2.2)

      // 2.5s — Welcome sub-text
      .to('.welcome-sub', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 10 } }, 2.5)

      // 2.7s — Glass CTA surface rises
      .to('.cta-surface', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: 30, scale: 0.97 } }, 2.7)

      // 3.0s — Contact strip
      .to('.contact-strip', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 12 } }, 3.0)

      // 3.3s — Legal
      .to('.legal', { opacity: 1, duration: 0.8 }, 3.3);

  }, 100);

}; // End of init function

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
