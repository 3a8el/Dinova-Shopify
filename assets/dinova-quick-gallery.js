/* Quick view gallery: one large photo at a time, switched by the thumbnails
   (and the arrows beside them) under it. The quick view's content is fetched
   in, so this listens on the document instead of on each gallery. */

function show(gallery, index) {
  const items = [...gallery.querySelectorAll('.media-gallery__grid > li')];
  const buttons = [...gallery.querySelectorAll('.dinova-thumbs__button')];
  if (!items.length) return;
  const next = (index + items.length) % items.length;
  items.forEach((item, i) => item.classList.toggle('dinova-current', i === next));
  buttons.forEach((button, i) => {
    const active = i === next;
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'true');
      button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function current(gallery) {
  const buttons = [...gallery.querySelectorAll('.dinova-thumbs__button')];
  return Math.max(0, buttons.findIndex((button) => button.classList.contains('is-active')));
}

document.addEventListener('click', (event) => {
  const control = event.target.closest('.quick-add-modal .dinova-thumbs__button, .quick-add-modal .dinova-thumbs__step');
  if (!control) return;
  const gallery = control.closest('media-gallery');
  if (!gallery) return;
  event.preventDefault();
  event.stopPropagation();
  if (control.classList.contains('dinova-thumbs__step')) {
    show(gallery, current(gallery) + Number(control.dataset.step));
  } else {
    show(gallery, Number(control.dataset.index));
  }
}, true);
