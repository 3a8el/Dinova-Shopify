import { QuickAddComponent } from '@theme/quick-add';

/* Horizon's quick-add, pointed at this product instead of a product card. */
if (!customElements.get('dinova-quick-view')) {
  customElements.define(
    'dinova-quick-view',
    class DinovaQuickView extends QuickAddComponent {
      constructor() {
        super();
        const open = this.handleClick;
        this.handleClick = (event) => {
          // No quick-add modal on the page: let the link open the product page.
          if (!document.getElementById('quick-add-dialog')) return;
          return open(event);
        };
      }

      get productPageUrl() {
        return this.dataset.productUrl || '';
      }
    }
  );
}
