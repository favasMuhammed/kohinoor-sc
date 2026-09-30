// About page · "The Cue Sheet"
// Cue state is derived from IntersectionObservers only — no scroll-position maths on the main thread.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideLayout = window.matchMedia('(min-width: 1024px)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  // Critically damped spring (stiffness 170, damping 26, mass 1) sampled over 1100ms.
  const SPRING = 'linear(0, 0.226, 0.535, 0.749, 0.873, 0.938, 0.971, 0.986, 0.994, 0.997, 0.999, 0.999, 1, 1, 1, 1, 1)';
  const travelEasing = CSS.supports('animation-timing-function', SPRING) ? SPRING : 'cubic-bezier(0.34, 1.2, 0.64, 1)';

  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!('IntersectionObserver' in window)) {
    root.classList.add('no-io');
    return;
  }

  // ── Reveals ──
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.act, .interval, .your-cue').forEach(el => revealObserver.observe(el));

  // ── Signature moment 1 · the cue light ──
  const cues = [...document.querySelectorAll('.step[data-cue]')];
  const light = document.querySelector('.cue-light');
  const lightState = light.querySelector('.cue-light-state');
  const lightNum = light.querySelector('.cue-light-num');

  const passed = new Set();   // headings that have reached the upper half of the viewport
  const inBand = new Set();   // headings currently inside the upper half
  const near = new Set();     // headings within half a viewport below the fold
  let docked = false;

  const pad = n => String(n).padStart(2, '0');

  function render() {
    const current = passed.size ? Math.max(...passed) : 0;
    let state = 'standby';
    let shown = 1;

    if (current && inBand.has(current)) {
      state = 'go';
      shown = current;
    } else if (near.has(current + 1)) {
      shown = current + 1;
    } else if (current) {
      state = 'go';
      shown = current;
    }

    light.dataset.state = state;
    lightState.textContent = state === 'go' ? 'Go' : 'Standby';
    lightNum.textContent = pad(shown);
    light.classList.toggle('is-live', !docked && (current > 0 || near.has(1)));

    // The film sits beside steps 05–06, so it cuts in as the Deliver act starts
    if (current >= 5) triggerCut();
  }

  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const n = Number(entry.target.closest('.step').dataset.cue);
      if (entry.isIntersecting) {
        passed.add(n);
        inBand.add(n);
      } else {
        inBand.delete(n);
        // Leaving through the top keeps it "called"; leaving through the bottom un-calls it (scrolling back up).
        if (entry.boundingClientRect.top > window.innerHeight / 2) passed.delete(n);
      }
    });
    render();
  }, { rootMargin: '0px 0px -50% 0px' });

  const nearObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const n = Number(entry.target.closest('.step').dataset.cue);
      entry.isIntersecting ? near.add(n) : near.delete(n);
    });
    render();
  }, { rootMargin: '0px 0px 50% 0px' });

  cues.forEach(cue => {
    const heading = cue.querySelector('h3');
    headingObserver.observe(heading);
    nearObserver.observe(heading);
  });

  // A jump (anchor link, Home/End, scrollbar drag) can move a heading from above the viewport to below it
  // without ever intersecting, so observers never fire. Re-derive the sets once scrolling settles.
  function reconcile() {
    const mid = window.innerHeight / 2;
    passed.clear();
    inBand.clear();
    near.clear();
    cues.forEach(cue => {
      const n = Number(cue.dataset.cue);
      const rect = cue.querySelector('h3').getBoundingClientRect();
      if (rect.top < mid) passed.add(n);
      if (rect.bottom > 0 && rect.top < mid) inBand.add(n);
      if (rect.top >= mid && rect.top < window.innerHeight * 1.5) near.add(n);
    });
    render();
  }
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', reconcile);
  } else {
    let settle;
    window.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(reconcile, 120);
    }, { passive: true });
  }

  // ── Signature moment 2 · the lighting cut (Deliver) ──
  const cut = document.querySelector('.cut');
  const video = cut.querySelector('video');
  const toggle = cut.querySelector('.cut-toggle');
  const start = Number(video.dataset.start);
  const end = Number(video.dataset.end);
  let cutFired = false;
  let userPaused = false;

  function loadVideo() {
    if (video.src) return;
    video.src = `${video.dataset.src}#t=${start}`;
    // Media fragments are ignored by some servers/browsers; seek explicitly once metadata is known.
    video.addEventListener('loadedmetadata', () => {
      if (video.currentTime < start) video.currentTime = start;
    }, { once: true });
    // Loop only the service segment of the film.
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= end) video.currentTime = start;
    });
  }

  function setPlaying(playing) {
    toggle.dataset.playing = String(playing);
    toggle.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  }

  function play() {
    loadVideo();
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  function triggerCut() {
    if (cutFired) return;
    cutFired = true;
    if (reducedMotion.matches || saveData) return; // poster + play button only
    cut.classList.add('is-go');
    play();
  }

  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      video.pause();
      setPlaying(false);
    }
  });

  // Pause off-screen; resume on return unless the visitor paused it.
  new IntersectionObserver(([entry]) => {
    if (!video.src) return;
    if (!entry.isIntersecting) {
      video.pause();
      setPlaying(false);
    } else if (!userPaused && !reducedMotion.matches && !saveData) {
      play();
    }
  }, { threshold: 0.25 }).observe(cut);

  // ── Signature moment 3 · the cue light docks in the call button ──
  const call = document.querySelector('.call');
  const callGem = call.querySelector('.call-gem');

  function dock() {
    if (docked) return;
    docked = true;
    render();

    if (!wideLayout.matches || reducedMotion.matches) {
      call.classList.add('is-lit');
      return;
    }

    const from = light.querySelector('.gem').getBoundingClientRect();
    const to = callGem.getBoundingClientRect();
    const traveller = document.createElement('span');
    traveller.className = 'gem gem-traveller';
    traveller.setAttribute('aria-hidden', 'true');
    Object.assign(traveller.style, {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
    });
    document.body.append(traveller);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    traveller.animate(
      [
        { transform: 'translate(0, 0) rotate(45deg) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) rotate(45deg) scale(${scale})` },
      ],
      { duration: 1100, easing: travelEasing, fill: 'forwards' }
    ).finished.then(() => {
      call.classList.add('is-lit');
      traveller.remove();
    });
  }

  function undock() {
    if (!docked) return;
    docked = false;
    call.classList.remove('is-lit');
    render();
  }

  new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? dock() : undock();
  }, { threshold: 0.5 }).observe(document.querySelector('.your-cue'));
})();
