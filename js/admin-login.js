/* ==========================================================================
   admin-login.js — autenticação simulada do painel administrativo
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Se já existe sessão ativa, vai direto ao dashboard.
  if (DA.getSession()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('form-login');
  const erro = document.getElementById('login-erro');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;

    const admin = DA.checkLogin(usuario, senha);
    if (!admin) {
      erro.style.display = 'block';
      return;
    }
    erro.style.display = 'none';
    DA.setSession(admin);
    window.location.href = 'dashboard.html';
  });
});
