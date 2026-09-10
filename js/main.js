/* ==========================================================================
   main.js — comportamento compartilhado do site público
   (menu mobile + destaque do link ativo)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
  }

  const current = document.body.dataset.page;
  if (current) {
    document.querySelectorAll('.nav a[data-page], .admin-tabs a[data-page]').forEach(a => {
      if (a.dataset.page === current) a.classList.add('is-active');
    });
  }
});
