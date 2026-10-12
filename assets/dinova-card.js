/* Dinova product card hover: the cart icon presses Horizon's own quick-add
   button for the card (hidden in Dinova cards), so adding to cart, the
   options modal and the cart drawer all behave as Horizon intends. */
if (!window.dinovaCardCart) {
  window.dinovaCardCart = true;

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-dinova-cart]') : null;
    if (!trigger) return;

    const gallery = trigger.closest('.card-gallery');
    const quickAdd = gallery?.querySelector('quick-add-component');
    const state = quickAdd?.getAttribute('data-quick-add-button');
    const button =
      quickAdd?.querySelector(`.quick-add__button--${state}`) ?? quickAdd?.querySelector('.quick-add__button');

    event.preventDefault();
    event.stopPropagation();

    if (button) {
      button.click();
    } else {
      // Quick add is off in theme settings: fall back to the quick view link.
      trigger.closest('dinova-quick-view')?.querySelector('[data-dinova-view]')?.click();
    }
  });
}
