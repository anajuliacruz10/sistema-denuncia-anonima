/* ==========================================================================
   admin-dashboard.js — KPIs, distribuição por urgência e top categorias
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const denuncias = DA.getDenuncias();
  const total = denuncias.length;

  const porStatus = { recebido: 0, analise: 0, investigacao: 0, concluida: 0, arquivada: 0 };
  denuncias.forEach(d => { if (porStatus[d.status] !== undefined) porStatus[d.status]++; });

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-recebido').textContent = porStatus.recebido;
  document.getElementById('kpi-analise').textContent = porStatus.analise;
  document.getElementById('kpi-investigacao').textContent = porStatus.investigacao;
  document.getElementById('kpi-concluida').textContent = porStatus.concluida;
  document.getElementById('kpi-arquivada').textContent = porStatus.arquivada;

  // Urgência
  const urgOrder = ['baixa', 'media', 'alta', 'emergencial'];
  const urgLabel = { baixa: 'Baixa', media: 'Média', alta: 'Alta', emergencial: 'Emergencial' };
  const porUrgencia = { baixa: 0, media: 0, alta: 0, emergencial: 0 };
  denuncias.forEach(d => { if (porUrgencia[d.urgencia] !== undefined) porUrgencia[d.urgencia]++; });

  const barsUrgencia = document.getElementById('bars-urgencia');
  urgOrder.forEach(u => {
    const count = porUrgencia[u];
    const pct = total ? Math.round((count / total) * 100) : 0;
    barsUrgencia.appendChild(renderBar(urgLabel[u], count, pct));
  });

  // Categorias
  const porCategoria = {};
  denuncias.forEach(d => { porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + 1; });
  const categoriasOrdenadas = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const barsCategoria = document.getElementById('bars-categoria');
  if (categoriasOrdenadas.length === 0) {
    barsCategoria.innerHTML = '<p class="muted small mb-0">Nenhuma denúncia registrada ainda.</p>';
  } else {
    categoriasOrdenadas.forEach(([cat, count]) => {
      const pct = total ? Math.round((count / total) * 100) : 0;
      barsCategoria.appendChild(renderBar(cat, count, pct));
    });
  }

  function renderBar(label, count, pct) {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label"><span>${label}</span><span>${count} (${pct}%)</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
    `;
    return row;
  }
});
