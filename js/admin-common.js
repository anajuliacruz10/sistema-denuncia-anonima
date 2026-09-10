/* ==========================================================================
   admin-common.js — reaproveitado por todas as páginas do painel:
   garante sessão ativa, preenche identidade do agente logado e trata logout.
   ========================================================================== */

const ADMIN = (() => {
  function init() {
    const session = DA.requireSession('login.html');
    if (!session) return null;

    const nomeEl = document.getElementById('admin-nome');
    const setorEl = document.getElementById('admin-setor');
    if (nomeEl) nomeEl.textContent = `Bem-vindo, ${session.nome}!`;
    if (setorEl) setorEl.textContent = `Agente logado: ${session.nome} | Setor: ${session.setor}`;

    const logoutBtn = document.querySelector('.admin-tabs .logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        DA.clearSession();
        window.location.href = 'login.html';
      });
    }
    return session;
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ADMIN.init();
});
