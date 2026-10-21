/**
 * Dinova desktop navigation (snippets/dinova-nav.liquid).
 * Places the drawer under the header, and expands it to show a top-level item's
 * submenu when that item is clicked. Opening and closing the drawer stays with
 * Horizon's header-drawer.
 */
class DinovaNav extends HTMLElement {
  connectedCallback() {
    this.details = this.closest('details');
    this.drawer = this.closest('.menu-drawer');
    this.header = this.closest('#header-component');

    this.addEventListener('click', this.onClick);
    this.details?.addEventListener('toggle', this.onToggle);
    window.addEventListener('resize', this.place);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.details?.removeEventListener('toggle', this.onToggle);
    window.removeEventListener('resize', this.place);
  }

  onClick = (event) => {
    const button = event.target.closest('[data-dinova-nav-toggle]');
    if (!button) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    this.collapse();
    if (!isOpen) this.expand(button);
  };

  onToggle = () => {
    if (this.details.open) {
      // Wait a frame so the header has switched to its sticky, open state
      requestAnimationFrame(this.place);
    } else {
      this.collapse();
    }
  };

  /** Starts the drawer and the blurred backdrop right under the header */
  place = () => {
    if (!this.header || !this.drawer) return;
    const top = Math.max(0, Math.round(this.header.getBoundingClientRect().bottom));
    this.details.style.setProperty('--dinova-nav-top', `${top}px`);
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
}

if (!customElements.get('dinova-nav')) {
  customElements.define('dinova-nav', DinovaNav);
}
