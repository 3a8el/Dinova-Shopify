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
    '.dinova-ahero__title',
    '.dinova-notes__title',
    '.dinova-values__title',
    '.dinova-news__heading',
    '.dinova-jhero__heading',
    '.dinova-jhero__title',
    '.dinova-jgrid__heading',
    '.dinova-chero__heading',
    '.dinova-ccar__heading',
    '.dinova-spot__text',
    '.dinova-contact__title',
    '.dinova-ctitle__heading',
    '.dinova-story__heading',
    '.dinova-related__heading',
    '.dinova-statement__title',
    '.dinova-statement__lead',
    '.dinova-journey__heading',
    '.dinova-cta__title',
    '.dinova-classic-story__title',
    '.dinova-classic-story__subtitle',
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
    '.dinova-ahero__subtitle',
    '.dinova-ahero__text',
    '.dinova-notes__text',
    '.dinova-values__item',
    '.dinova-news__form',
    '.dinova-jhero__excerpt',
    '.dinova-jhero__link',
    '.dinova-jgrid__tags',
    '.dinova-jgrid__body',
    '.dinova-chero__text',
    '.dinova-ccar__text',
    '.dinova-footer__menu',
    '.dinova-footer__contact',
    '.dinova-contact__text',
    '.dinova-contact__detail',
    '.dinova-contact__form-wrap',
    '.dinova-story__text',
    '.dinova-values__subtitle',
    '.dinova-statement__eyebrow',
    '.dinova-statement__subtitle',
    '.dinova-statement__text',
    '.dinova-journey__eyebrow',
    '.dinova-journey__step',
    '.dinova-cta__subtitle',
    '.dinova-cta__text',
    '.dinova-cta__button',
    '.dinova-classic-story__intro-text',
    '.dinova-classic-story__text',
    '.dinova-classic-values__item',
  ];

  /* Media frames that unveil; the image or video inside eases out of a zoom. */
  const MEDIA = [
    '.dinova-contact__main',
    '.dinova-story__media',
    '.dinova-contact__detail-image',
    '.dinova-switcher__media',
    '.dinova-cuts__slides',
    '.dinova-split__column',
    '.dinova-carousel__image',
    '.dinova-about__item',
    '.dinova-vblog__media',
    '.dinova-notes__image',
    '.dinova-notes__small',
    '.dinova-values__media',
    '.dinova-news__frame',
    '.dinova-jhero__media',
    '.dinova-jgrid__media',
    '.dinova-chero__slider',
    '.dinova-ccar__media',
    '.dinova-spot__card-media',
    '.dinova-spot__photo',
    '.dinova-cgrid__tile',
    '.dinova-journey__frame',
    '.dinova-cta__media',
    '.dinova-classic-story__media',
    '.dinova-classic-portrait__media',
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

  /* Headings marked data-dinova-reveal: each letter shifts from white to the
     heading's own colour, scrubbed with the scroll. It starts when the heading
     column comes into view and finishes when a sticky heading reaches the
     bottom of its column, or at the end of the page if that comes first. */
  function reveal(el) {
    const color = getComputedStyle(el).color;
    const area = el.parentElement;
    const scrollerEl = () => scroller();
    const scrollPos = () => {
      const sc = scrollerEl();
      return sc === window ? window.scrollY : sc.scrollTop;
    };
    const viewport = () => {
      const sc = scrollerEl();
      return sc === window ? window.innerHeight : sc.clientHeight;
    };
    const maxScroll = () => ScrollTrigger.maxScroll(scrollerEl());
    const startPx = () => Math.max(0, area.getBoundingClientRect().top + scrollPos() - viewport() * 0.7);
    const endPx = () => {
      const stickTop = parseFloat(getComputedStyle(el).top) || 0;
      const natural = area.getBoundingClientRect().bottom + scrollPos() - stickTop - el.offsetHeight;
      return Math.max(startPx() + 1, Math.min(natural, maxScroll() - 2));
    };
    const targets = SplitText ? SplitText.create(el, { type: 'words,chars' }).chars : [el];
    gsap.fromTo(
      targets,
      { color: '#ffffff' },
      {
        color,
        ease: 'none',
        stagger: 0.1,
        immediateRender: true,
        scrollTrigger: { trigger: area, start: startPx, end: endPx, scrub: 0.6 },
      }
    );
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
      const revealEls = root.matches?.('[data-dinova-reveal]') ? [root] : root.querySelectorAll('[data-dinova-reveal]');
      revealEls.forEach(reveal);
    });
    contexts.set(root, mm);
  }

  function teardown(root) {
    contexts.get(root)?.revert();
    contexts.delete(root);
  }

  /* On desktop (990px and up) Horizon scrolls .page-wrapper instead of the
     window, so ScrollTrigger has to watch that element. */
  const squeeze = window.matchMedia('(min-width: 990px)');
  const scroller = () => (squeeze.matches && document.querySelector('.page-wrapper')) || window;

  function start() {
    ScrollTrigger.defaults({ scroller: scroller() });
    init(document.body);

    squeeze.addEventListener('change', () => {
      [...contexts.keys()].forEach(teardown);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ScrollTrigger.defaults({ scroller: scroller() });
      init(document.body);
      ScrollTrigger.refresh();
    });

    /* Images and fonts change the layout after load; re-measure trigger points.
       Lazy images load later too, so re-measure (debounced) whenever one lands. */
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    let refreshTimer;
    document.addEventListener(
      'load',
      (event) => {
        if (event.target.tagName !== 'IMG') return;
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
      },
      true
    );

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
