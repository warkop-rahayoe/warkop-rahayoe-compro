import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent?.trim() ?? '';
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="w" aria-hidden="true"><span class="wi">${w}</span></span>`)
    .join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.wi'));
}

function delayOf(el: HTMLElement): number {
  return parseFloat(getComputedStyle(el).getPropertyValue('--d')) / 1000 || 0;
}

if (!reduceMotion) {
  const progress = document.querySelector<HTMLElement>('.progress');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  }

  document.querySelectorAll<HTMLElement>('[data-split]:not([data-hero])').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
  });

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const words = splitWords(hero);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero-eyebrow', { opacity: 0, y: 18, duration: 0.7 })
      .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.09 }, '-=0.3')
      .from('.hero-lead', { opacity: 0, y: 30, duration: 0.9 }, '-=0.6')
      .from('.hero-cta > *', { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 }, '-=0.7')
      .from('.hero-logo', { scale: 0.7, rotate: -8, opacity: 0, duration: 1.4 }, '-=1.2');
  }

  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 44 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        delay: delayOf(el),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax ?? '12');
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-scrub-text]').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(
      words,
      { opacity: 0.15 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.2,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    );
  });

  if (finePointer) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * 10,
          rotateX: -y * 10,
          transformPerspective: 900,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      });
    });

    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      });
    });

    const cursor = document.querySelector<HTMLElement>('.cursor');
    if (cursor) {
      const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
      const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
      window.addEventListener('pointermove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      });
      document.querySelectorAll('a, button, [data-tilt]').forEach((el) => {
        el.addEventListener('pointerenter', () => cursor.classList.add('hot'));
        el.addEventListener('pointerleave', () => cursor.classList.remove('hot'));
      });
      document.body.classList.add('has-cursor');
    }
  }
}
