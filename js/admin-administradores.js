/* ==========================================================================
   admin-administradores.js — cadastro e listagem de agentes/administradores
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-admins');
  const form = document.getElementById('form-admin');
  const erro = document.getElementById('admin-erro');

  const PERMISSAO_LABEL = { geral: 'Administrador geral', agente: 'Agente analista' };

  function render() {
    const lista = DA.getAdmins();
    tabela.innerHTML = '';
    if (lista.length === 0) {
      tabela.innerHTML = `<tr class="empty-row"><td colspan="4">Nenhum administrador cadastrado.</td></tr>`;
      return;
    }
    lista.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.nome}</strong></td>
        <td>${a.usuario}</td>
        <td>${a.setor}</td>
        <td><span class="badge badge-role-${a.permissao === 'geral' ? 'geral' : 'agente'}">${PERMISSAO_LABEL[a.permissao] || a.permissao}</span></td>
      `;
      tabela.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('a-nome').value.trim();
    const usuario = document.getElementById('a-usuario').value.trim();
    const setor = document.getElementById('a-setor').value.trim();
    const permissao = document.getElementById('a-permissao').value;

    if (!nome || !usuario || !setor) {
      erro.style.display = 'block';
      return;
    }

    const jaExiste = DA.getAdmins().some(a => a.usuario.toLowerCase() === usuario.toLowerCase());
    if (jaExiste) {
      erro.querySelector('p').textContent = 'Já existe um administrador com esse usuário/login.';
      erro.style.display = 'block';
      return;
    }

    erro.style.display = 'none';
    DA.addAdmin({ nome, usuario, senha: '123456', setor, permissao });
    form.reset();
    document.getElementById('a-permissao').value = 'agente';
    render();
  });

  render();
});
