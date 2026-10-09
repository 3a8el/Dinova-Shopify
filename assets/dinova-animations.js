/**
 * Dinova entrance animations (GSAP + ScrollTrigger + SplitText).
 * Loaded from layout/theme.liquid when the theme setting is on. In the theme
 * editor, a section replays its animations when it is edited. Visitors with
 * reduced motion turned on see everything static.
 *
 * - Large serif text: lines slide up from behind a mask.
 * - Small text and buttons: fade up.
 * - Images and videos: unveil from the bottom while easing out of a slight zoom.
 */
(() => {
  const { gsap, ScrollTrigger, SplitText } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  const EASE = 'power3.out';
  const START = 'top 85%';

  /* Big Cormorant headings and decorative paragraphs. */
  const LINES = [
    '.dinova-switcher__heading',
    '.dinova-cuts__title',
    '.dinova-split__text',
    '.dinova-carousel__title',
    '.dinova-about__text',
    '.dinova-vblog__heading',
  ];

  /* Smaller text, buttons and blocks that just fade up, staggered per section. */
  const FADES = [
    '.dinova-switcher__texts',
    '.dinova-switcher__names',
    '.dinova-switcher__links',
    '.dinova-split__content-image',
    '.dinova-split__subtitle',
    '.dinova-split__button',
    '.dinova-carousel__footer',
    '.dinova-about__button',
    '.dinova-marquee__heading',
    '.dinova-marquee__viewport',
    '.dinova-vblog__text',
    '.dinova-vblog__header > .dinova-vblog__button',
    '.dinova-cuts__caption',
    '.dinova-footer__menu',
    '.dinova-footer__contact',
  ];

  /* Media frames that unveil; the image or video inside eases out of a zoom. */
  const MEDIA = [
    '.dinova-switcher__media',
    '.dinova-cuts__slides',
    '.dinova-split__column',
    '.dinova-carousel__image',
    '.dinova-about__item',
    '.dinova-vblog__media',
  ];

  const sectionOf = (el) => el.closest('.shopify-section') || el.parentElement;

  function lines(el) {
    if (!SplitText) return fade([el]);
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'dinova-line' });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.1,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: START, once: true },
      onComplete: () => split.revert(),
    });
  }

  function fade(els) {
    gsap.from(els, {
      autoAlpha: 0,
      y: 24,
      duration: 0.9,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: els[0], start: START, once: true },
      clearProps: 'transform,opacity,visibility',
    });
  }

  function media(els) {
    els.forEach((el, i) => {
      const inner = el.querySelector('img, video, svg');
      const tl = gsap.timeline({
        delay: (i % 4) * 0.12,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
      tl.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out', clearProps: 'clipPath' }
      );
      if (inner) {
        tl.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: EASE, clearProps: 'transform' }, 0);
      }
    });
  }

  /* Group matches by section so each section staggers on its own. */
  function bySection(selectors, root = document) {
    const groups = new Map();
    root.querySelectorAll(selectors.join(',')).forEach((el) => {
      const key = sectionOf(el);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    return [...groups.values()];
  }

  /* One gsap.matchMedia per section, so the theme editor can rebuild a single
     section when it is edited without touching the rest of the page. */
  const contexts = new Map();

  function init(root) {
    const mm = gsap.matchMedia(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lineEls = root.matches?.(LINES.join(',')) ? [root] : root.querySelectorAll(LINES.join(','));
      lineEls.forEach(lines);
      bySection(FADES, root).forEach(fade);
      bySection(MEDIA, root).forEach(media);
    });
    contexts.set(root, mm);
  }

  function teardown(root) {
    contexts.get(root)?.revert();
    contexts.delete(root);
  }

  function start() {
    init(document.body);

    /* Images and fonts change the layout after load; re-measure trigger points. */
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

    /* Theme editor: replay a section's animations when it is added or changed. */
    if (window.Shopify?.designMode) {
      document.addEventListener('shopify:section:unload', (event) => {
        teardown(event.target);
        ScrollTrigger.getAll().forEach((t) => event.target.contains(t.trigger) && t.kill());
      });
      document.addEventListener('shopify:section:load', (event) => {
        init(event.target);
        ScrollTrigger.refresh();
      });
    }
  }

  const ready = () => (document.fonts?.ready || Promise.resolve()).then(start);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }
})();
