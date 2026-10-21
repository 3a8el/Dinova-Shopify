/**
 * Dinova navigation (snippets/dinova-nav.liquid).
 * Places the drawer under the header. On desktop it sizes the drawer to the main
 * column and expands it to show a top-level item's submenu when that item is
 * clicked; below 990px the item opens its submenu page instead, and the back
 * button closes it. Opening and closing the drawer stays with Horizon's header-drawer.
 */
const desktop = window.matchMedia('(min-width: 990px)');

class DinovaNav extends HTMLElement {
  connectedCallback() {
    this.details = this.closest('details');
    this.drawer = this.closest('.menu-drawer');
    this.header = this.closest('#header-component');

    this.addEventListener('click', this.onClick);
    this.details?.addEventListener('toggle', this.onToggle);
    window.addEventListener('resize', this.place);
    desktop.addEventListener('change', this.reset);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.details?.removeEventListener('toggle', this.onToggle);
    window.removeEventListener('resize', this.place);
    desktop.removeEventListener('change', this.reset);
  }

  onClick = (event) => {
    if (!(event.target instanceof Element)) return;

    const back = event.target.closest('[data-dinova-nav-back]');
    if (back) {
      this.closePage(back.closest('[data-dinova-nav-page-panel]'));
      return;
    }

    if (desktop.matches) {
      const button = event.target.closest('[data-dinova-nav-toggle]');
      if (!button) return;

      const isOpen = button.getAttribute('aria-expanded') === 'true';
      this.collapse();
      if (!isOpen) this.expand(button);
      return;
    }

    const opener = event.target.closest('[data-dinova-nav-page]');
    if (opener) this.openPage(opener);
  };

  onToggle = () => {
    if (this.details.open) {
      // Wait a frame so the header has switched to its sticky, open state
      requestAnimationFrame(this.place);
    } else {
      this.reset();
    }
  };

  /** Starts the drawer and the blurred backdrop right under the header */
  place = () => {
    if (!this.header || !this.drawer) return;
    const top = Math.max(0, Math.round(this.header.getBoundingClientRect().bottom));
    this.details.style.setProperty('--dinova-nav-top', `${top}px`);

    // The closed desktop drawer is as wide as the main column, which fits its longest item
    const main = this.querySelector('.dinova-nav__main');
    if (desktop.matches && main?.offsetWidth) {
      this.details.style.setProperty('--dinova-nav-main-width', `${Math.ceil(main.offsetWidth)}px`);
    }
  };

  reset = () => {
    this.collapse();
    this.querySelectorAll('[data-dinova-nav-page-panel].is-open').forEach((page) => this.closePage(page));
  };

  /** @param {HTMLElement} button */
  expand(button) {
    const panel = this.querySelector(`#${CSS.escape(button.getAttribute('aria-controls'))}`);
    if (!panel) return;

    button.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-active');
    this.setAttribute('data-expanded', '');
  }

  collapse() {
    this.querySelectorAll('[data-dinova-nav-toggle][aria-expanded="true"]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
    this.querySelectorAll('[data-dinova-nav-panel].is-active').forEach((panel) => {
      panel.classList.remove('is-active');
    });
    this.removeAttribute('data-expanded');
  }

  /** @param {HTMLElement} opener */
  openPage(opener) {
    const page = this.querySelector(`#${CSS.escape(opener.dataset.dinovaNavPage)}`);
    if (!page) return;

    opener.setAttribute('aria-expanded', 'true');
    page.classList.add('is-open');
    page.querySelector('[data-dinova-nav-back]')?.focus({ preventScroll: true });
  }

  /** @param {HTMLElement | null} page */
  closePage(page) {
    if (!page) return;

    page.classList.remove('is-open');
    const opener = this.querySelector(`[data-dinova-nav-page="${CSS.escape(page.id)}"]`);
    opener?.setAttribute('aria-expanded', 'false');
    if (page.contains(document.activeElement)) opener?.focus({ preventScroll: true });
  }
}

if (!customElements.get('dinova-nav')) {
  customElements.define('dinova-nav', DinovaNav);
}
