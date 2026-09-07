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
