/* ==========================================================================
   consultar.js — consulta pública de andamento por protocolo + código
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-consulta');
  const msgErro = document.getElementById('msg-erro');
  const painelDetalhe = document.getElementById('painel-detalhe');

  const URGENCIA_LABEL = { baixa: 'Urgência baixa', media: 'Urgência média', alta: 'Urgência alta', emergencial: 'Emergencial' };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const protocolo = document.getElementById('protocolo').value.trim();
    const codigo = document.getElementById('codigo').value.trim().toUpperCase();

    const item = DA.findDenuncia(protocolo);

    if (!item || item.codigoAcesso.toUpperCase() !== codigo) {
      msgErro.style.display = 'block';
      painelDetalhe.style.display = 'none';
      return;
    }

    msgErro.style.display = 'none';
    renderDetalhe(item);
    painelDetalhe.style.display = 'block';
    painelDetalhe.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function renderDetalhe(item) {
    document.getElementById('det-protocolo').textContent = item.protocolo;
    document.getElementById('det-data-registro').textContent = DA.formatarData(item.dataRegistro);

    const statusEl = document.getElementById('det-status');
    statusEl.textContent = DA.STATUS_LABEL[item.status] || item.status;
    statusEl.className = `badge badge-${item.status}`;

    const urgEl = document.getElementById('det-urgencia');
    urgEl.textContent = URGENCIA_LABEL[item.urgencia] || item.urgencia;
    urgEl.className = `badge badge-${item.urgencia}`;

    document.getElementById('det-categoria').textContent = item.categoria;
    document.getElementById('det-subcategoria').textContent = item.subcategoria;
    document.getElementById('det-local').textContent = item.local;
    document.getElementById('det-data-ocorrencia').textContent = item.dataOcorrencia
      ? new Date(item.dataOcorrencia + 'T00:00:00').toLocaleDateString('pt-BR')
      : '—';
    document.getElementById('det-descricao').textContent = item.descricao;

    const tl = document.getElementById('det-timeline');
    tl.innerHTML = '';
    item.historico.slice().reverse().forEach(h => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <div class="bar-label">
          <span><span class="badge badge-${h.status}">${DA.STATUS_LABEL[h.status] || h.status}</span></span>
          <span class="muted small">${DA.formatarData(h.data)}</span>
        </div>
        ${h.obs ? `<p class="small muted" style="margin:4px 0 0">${h.obs}</p>` : ''}
      `;
      tl.appendChild(row);
    });
  }
});
