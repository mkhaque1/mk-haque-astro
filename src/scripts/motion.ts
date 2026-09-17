import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const events = new AbortController();
const options = { signal: events.signal };
const media = gsap.matchMedia();

let destroyScene: (() => void) | undefined;
let disposed = false;

media.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-enter', {
    y: 28,
    opacity: 0,
    duration: 1.1,
    stagger: 0.11,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 35,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: element,
        start: 'top 93%',
        once: true,
      },
    });
  });

  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
    },
  });

  gsap.utils.toArray<HTMLElement>('.project-art').forEach((art) => {
    const object = art.querySelector('.art-object');
    if (!object) return;

    gsap.fromTo(
      object,
      { y: -18 },
      {
        y: 22,
        ease: 'none',
        scrollTrigger: {
          trigger: art,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      },
    );
  });

  gsap.to('.skill-orbit', {
    rotation: 12,
    y: -8,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

media.add(
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  () => {
    const localEvents = new AbortController();

    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const rotateX = gsap.quickTo(card, 'rotationX', {
        duration: 0.5,
        ease: 'power3.out',
      });
      const rotateY = gsap.quickTo(card, 'rotationY', {
        duration: 0.5,
        ease: 'power3.out',
      });

      gsap.set(card, { transformPerspective: 1100 });

      card.addEventListener(
        'pointermove',
        (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(-y * 6);
          rotateY(x * 7);
        },
        { signal: localEvents.signal },
      );

      card.addEventListener(
        'pointerleave',
        () => {
          rotateX(0);
          rotateY(0);
        },
        { signal: localEvents.signal },
      );
    });

    return () => localEvents.abort();
  },
);

// Project filtering.
const filters = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const projects = document.querySelectorAll<HTMLElement>('[data-category]');

filters.forEach((button) => {
  button.addEventListener(
    'click',
    () => {
      const filter = button.dataset.filter ?? 'all';
      let visibleCount = 0;

      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      projects.forEach((project) => {
        const visible = filter === 'all' || project.dataset.category === filter;
        project.hidden = !visible;
        if (visible) visibleCount++;
      });

      const status = document.getElementById('filter-status');
      if (status) {
        status.textContent = `${visibleCount} projects shown.`;
      }

      ScrollTrigger.refresh();
    },
    options,
  );
});

// Skill layers.
const skillButtons =
  document.querySelectorAll<HTMLButtonElement>('[data-skill]');
const skillPanels = document.querySelectorAll<HTMLElement>('.skill-panel');

skillButtons.forEach((button) => {
  button.addEventListener(
    'click',
    () => {
      const id = `panel-${button.dataset.skill}`;

      skillButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      skillPanels.forEach((panel) => {
        gsap.killTweensOf(panel);
        gsap.set(panel, { clearProps: 'transform,opacity' });
        panel.hidden = panel.id !== id;

        if (!panel.hidden && !reduced.matches) {
          gsap.fromTo(
            panel,
            {
              y: 12,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
          );
        }
      });

      ScrollTrigger.refresh();
    },
    options,
  );
});

// Load the heavier 3D module only when its container approaches view.
const sceneHost = document.getElementById('human-scene');

const sceneObserver = new IntersectionObserver(
  async ([entry]) => {
    if (!entry?.isIntersecting || !sceneHost) return;
    sceneObserver.disconnect();

    try {
      const { mountHumanScene } = await import('./scene');
      if (disposed) return;
      destroyScene = mountHumanScene(sceneHost);
    } catch (error) {
      console.warn(
        '3D scene unavailable; retaining the static fallback.',
        error,
      );

      const hint = document.getElementById('scene-hint');
      if (hint) hint.textContent = 'STATIC VIEW';

      document
        .querySelectorAll<HTMLButtonElement>('.scene-buttons button')
        .forEach((button) => {
          button.disabled = true;
        });
    }
  },
  { rootMargin: '200px' },
);

if (sceneHost) sceneObserver.observe(sceneHost);

document.fonts.ready.then(() => {
  if (!disposed) ScrollTrigger.refresh();
});

// Preserve live instances when the browser uses its back-forward cache.
window.addEventListener(
  'pagehide',
  (event) => {
    if (event.persisted) return;

    disposed = true;
    events.abort();
    sceneObserver.disconnect();
    destroyScene?.();
    media.revert();
    gsap.killTweensOf('.skill-panel');
  },
  { once: true },
);
