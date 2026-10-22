'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('sideMenu');
  const opener = document.getElementById('hamburgerBtn');
  const closer = document.getElementById('sideMenuClose');
  if (!menu || !opener || !closer) return;

  opener.setAttribute('aria-controls', menu.id);
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'Navigation menu');
  let wasOpen = false;
  const syncMenu = () => {
    const isOpen = menu.classList.contains('active');
    menu.inert = !isOpen;
    menu.setAttribute('aria-hidden', String(!isOpen));
    opener.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) menu.setAttribute('aria-modal', 'true');
    else menu.removeAttribute('aria-modal');
    if (isOpen && !wasOpen) closer.focus();
    if (!isOpen && wasOpen) opener.focus();
    wasOpen = isOpen;
  };
  syncMenu();
  new MutationObserver(syncMenu).observe(menu, { attributes: true, attributeFilter: ['class'] });

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closer.click();
    } else if (event.key === 'Tab') {
      const items = [...menu.querySelectorAll('a[href], button:not([disabled])')];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
