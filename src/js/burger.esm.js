const $ = document.querySelector.bind(document);
const burger = $('.burger');
const menu = $('.navigation__layer');

if (burger) {
  burger.addEventListener('click', (e) => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    const newState = !expanded;
    burger.setAttribute('aria-expanded', newState.toString());
    if (newState === true) {
      window.setTimeout(() => menu.classList.add('animate'), 50);
    } else {
      menu.classList.remove('animate');
    }
  });

  menu.addEventListener('click', (e) => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('animate');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}
