(() => {
  const nav = document.querySelector('.about-nav');
  const progress = [...document.querySelectorAll('.story-progress a')];
  const scenes = [...document.querySelectorAll('[data-story-scene]')];
  const setActive = (number) => progress.forEach(link => link.classList.toggle('is-active', link.dataset.scene === number));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); setActive(entry.target.dataset.storyScene); } }), { threshold: .48 });
  scenes.forEach(scene => observer.observe(scene));
  document.querySelectorAll('.scroll-chapter').forEach(chapter => {
    const steps = [...chapter.querySelectorAll('[data-step]')];
    const update = () => { const available = chapter.offsetHeight - window.innerHeight; const ratio = Math.max(0, Math.min(1, -chapter.getBoundingClientRect().top / available)); const active = Math.min(steps.length - 1, Math.floor(ratio * steps.length)); steps.forEach((step, index) => step.classList.toggle('is-current', index === active)); const count = chapter.querySelector('.chapter-count b'); if (count) count.textContent = String(active + 1).padStart(2, '0'); };
    window.addEventListener('scroll', update, { passive: true }); update();
  });
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
})();
