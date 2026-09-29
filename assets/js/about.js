(() => {
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Solid header once the page has scrolled.
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fallback: show everything if IntersectionObserver is unavailable.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Fade sections in as they enter the viewport.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Load the showcase video only when it nears the viewport, and pause it off-screen.
  const saveData = navigator.connection && navigator.connection.saveData;
  document.querySelectorAll('video.lazy-video').forEach(video => {
    if (saveData || reducedMotion) return; // poster image only
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else if (video.src) {
        video.pause();
      }
    }, { rootMargin: '200px 0px' });
    videoObserver.observe(video);
  });
})();
