/* ==========================================================================
   denuncia.js — formulário de registro de denúncia
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const selCategoria = document.getElementById('categoria');
  const selSubcategoria = document.getElementById('subcategoria');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');
  const form = document.getElementById('form-denuncia');
  const painelForm = document.getElementById('painel-form');
  const painelResultado = document.getElementById('painel-resultado');

  // Popular categorias
  Object.keys(DA.CATEGORIAS).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selCategoria.appendChild(opt);
  });

  selCategoria.addEventListener('change', () => {
    const cat = selCategoria.value;
    selSubcategoria.innerHTML = '';
    if (!cat) {
      selSubcategoria.disabled = true;
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Selecione primeiro uma categoria';
      selSubcategoria.appendChild(opt);
      return;
    }
    selSubcategoria.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione uma subcategoria…';
    selSubcategoria.appendChild(placeholder);
    DA.CATEGORIAS[cat].forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      selSubcategoria.appendChild(opt);
    });
  });

  // Dropzone simulada
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      const names = Array.from(fileInput.files).map(f => f.name).join(', ');
      fileList.textContent = `Selecionado(s): ${names}`;
    } else {
      fileList.textContent = 'Nenhum arquivo selecionado — anexos são simulados neste protótipo.';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const protocolo = DA.gerarProtocolo();
    const codigoAcesso = DA.gerarCodigoAcesso();
    const arquivos = fileInput.files.length ? Array.from(fileInput.files).map(f => f.name) : [];

    const denuncia = {
      protocolo,
      codigoAcesso,
      categoria: selCategoria.value,
      subcategoria: selSubcategoria.value,
      dataOcorrencia: document.getElementById('data-ocorrencia').value,
      horario: document.getElementById('horario').value,
      urgencia: document.getElementById('urgencia').value,
      local: document.getElementById('local').value.trim(),
      descricao: document.getElementById('descricao').value.trim(),
      envolvidos: document.getElementById('envolvidos').value.trim(),
      complementar: document.getElementById('complementar').value.trim(),
      arquivos,
      status: 'recebido',
      dataRegistro: DA.nowISO(),
      historico: [
        { data: DA.nowISO(), status: 'recebido', obs: 'Denúncia registrada pelo canal anônimo.' }
      ]
    };

    DA.addDenuncia(denuncia);

    document.getElementById('res-protocolo').textContent = protocolo;
    document.getElementById('res-codigo').textContent = codigoAcesso;
    painelForm.style.display = 'none';
    painelResultado.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
