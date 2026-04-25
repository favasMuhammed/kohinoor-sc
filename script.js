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
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(201,168,76,0.1)', borderColor: '#FFFFFF', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', borderColor: '#C9A84C', duration: 0.3 });
      });
    });

    window.addEventListener('mousedown', () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
    window.addEventListener('mouseup', () => gsap.to(cursor, { scale: 1, duration: 0.1 }));
  }

  // 4. Magnetic Button Logic
  const btn = document.querySelector('.enquire-btn');
  if (btn && !isTouchDevice && window.innerWidth > 768) {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  }

  // 5. Three.js Ambient Particle Field
  initThreeJS();

  // 6. Master GSAP Animation Timeline
  // Wait a tiny bit to ensure fonts/splitting are ready
  setTimeout(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl
      // 0.0s — Page starts dark (body opacity 0 -> 1)
      .to('body', { opacity: 1, duration: 0.1 })

      // 0.0s — Three.js canvas fades in
      .to('#ambient-canvas', { opacity: 1, duration: 2 }, 0)

      // 0.6s — Logo mark descends
      .to('.logo-mark', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: -20, scale: 0.9 } }, 0.6)

      // 0.8s — KOHINOOR chars shatter in
      .to('.brand-name .char', {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.055,
        duration: 1.1,
        startAt: { opacity: 0, y: 80, rotateX: -50 },
        transformOrigin: "0% 50% -80px"
      }, 0.8)

      // 1.5s — Ornament divider draws itself
      .to('.divider-line-left', { strokeDashoffset: 0, duration: 0.7 }, 1.5)
      .to('.divider-line-right', { strokeDashoffset: 0, duration: 0.7 }, 1.5)
      .to('.divider-diamond', { scale: 1, duration: 0.5, ease: "back.out(3)", startAt: { scale: 0, transformOrigin: "50% 50%" } }, 1.9)

      // 1.6s — CATERER fades up
      .to('.brand-sub', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 10 } }, 1.6)

      // 2.0s — Hero line words
      .to('.hero-line .word', { opacity: 1, y: 0, stagger: 0.07, duration: 0.9, startAt: { opacity: 0, y: 20 } }, 2.0)

      // 2.5s — Sub-descriptor
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 10 } }, 2.5)

      // 2.8s — Glass CTA surface rises
      .to('.cta-surface', { opacity: 1, y: 0, scale: 1, duration: 1, startAt: { y: 30, scale: 0.97 } }, 2.8)

      // 3.2s — Contact strip
      .to('.contact-strip', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 12 } }, 3.2)

      // 3.5s — Legal
      .to('.legal', { opacity: 1, duration: 0.8 }, 3.5);

  }, 100);

}; // End of init function

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
// ─────────────────────────────────────────────────────────
// Three.js Logic 
// ─────────────────────────────────────────────────────────
function initThreeJS() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  // Use Orthographic camera so it perfectly maps to viewport without perspective distortion on edges
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Determine particle count based on screen width (as requested)
  let particleCount = 180;
  if (width < 1024) particleCount = 120;
  if (width < 600) particleCount = 80;

  const particles = [];
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: 0xC9A84C,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });

  // Create custom diamond geometry (two triangles)
  const geom = new THREE.BufferGeometry();
  const size = 3; // tiny pixel size for orthographic view
  const vertices = new Float32Array([
    0, size, 0,   // top
    -size, 0, 0,  // left
    size, 0, 0,   // right

    -size, 0, 0,  // left
    0, -size, 0,  // bottom
    size, 0, 0    // right
  ]);
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(geom, particleMaterial.clone());

    // Spread across viewport
    mesh.position.x = (Math.random() - 0.5) * width;
    mesh.position.y = (Math.random() - 0.5) * height;
    mesh.position.z = (Math.random() - 0.5) * 5;

    // Randomize initial rotation and opacity
    mesh.rotation.z = Math.random() * Math.PI;
    mesh.material.opacity = 0.2 + Math.random() * 0.5;

    // Attach custom data for animation
    mesh.userData = {
      seed: Math.random() * 100,
      speedY: 0.2 + Math.random() * 0.4, // pixels per frame in ortho
      rotSpeed: 0.01 + Math.random() * 0.02
    };

    scene.add(mesh);
    particles.push(mesh);
  }

  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Upward drift
      p.position.y += p.userData.speedY;

      // If it goes off top, reset to bottom
      if (p.position.y > height / 2 + 10) {
        p.position.y = -height / 2 - 10;
        p.position.x = (Math.random() - 0.5) * width; // new random X
      }

      // Horizontal sway (sine wave)
      p.position.x += Math.sin(time + p.userData.seed) * 0.3;

      // Slow rotation
      p.rotation.z += p.userData.rotSpeed;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    const newW = window.innerWidth;
    const newH = window.innerHeight;

    camera.left = newW / -2;
    camera.right = newW / 2;
    camera.top = newH / 2;
    camera.bottom = newH / -2;
    camera.updateProjectionMatrix();

    renderer.setSize(newW, newH);
  });
}
