const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initThreeBackground = () => {
  if (reducedMotion || !window.THREE) return;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.z = 34;

  const renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new window.THREE.Group();
  const pointsCount = 320;
  const positions = new Float32Array(pointsCount * 3);
  const drift = new Float32Array(pointsCount);

  for (let i = 0; i < pointsCount; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 70;
    positions[i3 + 1] = (Math.random() - 0.5) * 46;
    positions[i3 + 2] = (Math.random() - 0.5) * 34;
    drift[i] = 0.001 + Math.random() * 0.004;
  }

  const geometry = new window.THREE.BufferGeometry();
  geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));

  const material = new window.THREE.PointsMaterial({
    color: 0xb4ccff,
    size: 0.24,
    transparent: true,
    opacity: 0.7,
    blending: window.THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new window.THREE.Points(geometry, material);
  group.add(points);
  scene.add(group);

  const lineGeometry = new window.THREE.RingGeometry(12, 12.08, 96);
  const lineMaterial = new window.THREE.MeshBasicMaterial({
    color: 0x6c8fd8,
    transparent: true,
    opacity: 0.25,
    side: window.THREE.DoubleSide,
  });
  const ring = new window.THREE.Mesh(lineGeometry, lineMaterial);
  ring.rotation.x = 1.23;
  group.add(ring);

  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  const animate = () => {
    const positionAttr = geometry.getAttribute('position');
    for (let i = 0; i < pointsCount; i += 1) {
      const i3 = i * 3;
      positionAttr.array[i3 + 1] += drift[i];
      if (positionAttr.array[i3 + 1] > 26) positionAttr.array[i3 + 1] = -26;
    }
    positionAttr.needsUpdate = true;
    group.rotation.y += 0.0008;
    group.rotation.x = pointer.y * 0.08;
    group.rotation.z = pointer.x * 0.08;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };
  animate();
};

const initAnime = () => {
  if (reducedMotion || !window.anime) return;

  window.anime({
    targets: '.hero-copy .kicker, .hero-copy h1, .hero-copy p, .hero-copy .btn',
    opacity: [0, 1],
    translateY: [28, 0],
    delay: window.anime.stagger(85),
    duration: 1050,
    easing: 'easeOutExpo',
  });

  window.anime({
    targets: '.division-card, .meta-card, .about-meta, .future-nodes span',
    translateY: [0, -6],
    direction: 'alternate',
    loop: true,
    duration: 2800,
    delay: window.anime.stagger(140, { start: 300 }),
    easing: 'easeInOutSine',
  });
};

initThreeBackground();
initAnime();

const visual = document.querySelector('.hero-visual');
if (visual && !reducedMotion) {
  visual.addEventListener('pointermove', (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.querySelectorAll('.node').forEach((node, index) => {
      const depth = (index + 1) * 6;
      node.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
  visual.addEventListener('pointerleave', () => {
    visual.querySelectorAll('.node').forEach((node) => {
      node.style.transform = '';
    });
  });
}

const revealElements = document.querySelectorAll('.section, .division-card');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}
