/* ==========================================================================
   admin-denuncias.js — listagem filtrável e gerenciamento de status
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-denuncias');
  const fBusca = document.getElementById('f-busca');
  const fCategoria = document.getElementById('f-categoria');
  const fStatus = document.getElementById('f-status');
  const fUrgencia = document.getElementById('f-urgencia');
  const btnLimpar = document.getElementById('btn-limpar');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalProtocolo = document.getElementById('modal-protocolo');
  const modalCategoria = document.getElementById('modal-categoria');
  const modalLocal = document.getElementById('modal-local');
  const modalDescricao = document.getElementById('modal-descricao');
  const modalStatus = document.getElementById('modal-status');
  const modalObs = document.getElementById('modal-obs');

  let protocoloAtivo = null;

  // Popular filtro de categorias
  Object.keys(DA.CATEGORIAS).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    fCategoria.appendChild(opt);
  });

  function render() {
    const busca = fBusca.value.trim().toUpperCase();
    const categoria = fCategoria.value;
    const status = fStatus.value;
    const urgencia = fUrgencia.value;

    let lista = DA.getDenuncias();
    if (busca) lista = lista.filter(d => d.protocolo.toUpperCase().includes(busca));
    if (categoria) lista = lista.filter(d => d.categoria === categoria);
    if (status) lista = lista.filter(d => d.status === status);
    if (urgencia) lista = lista.filter(d => d.urgencia === urgencia);

    tabela.innerHTML = '';

    if (lista.length === 0) {
      tabela.innerHTML = `<tr class="empty-row"><td colspan="6">Nenhuma denúncia encontrada para os filtros aplicados.</td></tr>`;
      return;
    }

    lista.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${d.protocolo}</strong></td>
        <td>${DA.formatarData(d.dataRegistro)}</td>
        <td>${d.categoria}</td>
        <td><span class="badge badge-${d.urgencia}">${capitalize(d.urgencia)}</span></td>
        <td><span class="badge badge-${d.status}">${DA.STATUS_LABEL[d.status]}</span></td>
        <td><button class="btn btn-dark btn-sm" data-protocolo="${d.protocolo}">Gerenciar</button></td>
      `;
      tabela.appendChild(tr);
    });

    tabela.querySelectorAll('button[data-protocolo]').forEach(btn => {
      btn.addEventListener('click', () => abrirModal(btn.dataset.protocolo));
    });
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function abrirModal(protocolo) {
    const item = DA.findDenuncia(protocolo);
    if (!item) return;
    protocoloAtivo = protocolo;
    modalProtocolo.textContent = `Gerenciar ${item.protocolo}`;
    modalCategoria.textContent = `${item.categoria} — ${item.subcategoria}`;
    modalLocal.textContent = item.local;
    modalDescricao.textContent = item.descricao;
    modalStatus.value = item.status;
    modalObs.value = '';
    modalOverlay.classList.add('is-open');
  }

  function fecharModal() {
    modalOverlay.classList.remove('is-open');
    protocoloAtivo = null;
  }

  document.getElementById('modal-close').addEventListener('click', fecharModal);
  document.getElementById('modal-cancelar').addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) fecharModal(); });

  document.getElementById('modal-salvar').addEventListener('click', () => {
    if (!protocoloAtivo) return;
    DA.updateDenunciaStatus(protocoloAtivo, modalStatus.value, modalObs.value.trim());
    fecharModal();
    render();
  });

  [fBusca, fCategoria, fStatus, fUrgencia].forEach(el => el.addEventListener('input', render));
  btnLimpar.addEventListener('click', () => {
    fBusca.value = ''; fCategoria.value = ''; fStatus.value = ''; fUrgencia.value = '';
    render();
  });

  render();
});
