/* ==========================================================================
   data.js
   Camada de dados do protótipo. Sem backend real: tudo é persistido em
   localStorage (denúncias e administradores) e sessionStorage (sessão do
   administrador logado), simulando um banco de dados e uma sessão de API.
   ========================================================================== */

const DA = (() => {
  const KEY_DENUNCIAS = 'da_denuncias';
  const KEY_ADMINS = 'da_admins';
  const KEY_SESSION = 'da_session';

  const CATEGORIAS = {
    'Corrupção': ['Desvio de verba pública', 'Propina / suborno', 'Nepotismo', 'Fraude em licitação'],
    'Segurança pública': ['Tráfico de drogas', 'Porte ilegal de arma', 'Violência doméstica', 'Perturbação do sossego'],
    'Meio ambiente': ['Descarte irregular de resíduos', 'Poluição de curso d’água', 'Desmatamento', 'Maus-tratos a animais'],
    'Crimes cibernéticos': ['Golpe / phishing', 'Perfil falso', 'Vazamento de dados', 'Extorsão online'],
    'Trabalhista': ['Trabalho análogo à escravidão', 'Trabalho infantil', 'Assédio no ambiente de trabalho'],
    'Outros': ['Não identificado', 'Outra situação']
  };

  function uid() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function gerarProtocolo() {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `DEN-${n}`;
  }

  function gerarCodigoAcesso() {
    return uid();
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function formatarData(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  const STATUS_LABEL = {
    recebido: 'Recebido',
    analise: 'Em análise',
    investigacao: 'Em investigação',
    concluida: 'Concluída',
    arquivada: 'Arquivada'
  };

  const STATUS_ORDER = ['recebido', 'analise', 'investigacao', 'concluida', 'arquivada'];

  function seed() {
    if (!localStorage.getItem(KEY_DENUNCIAS)) {
      const exemplo = [
        {
          protocolo: 'DEN-849201',
          codigoAcesso: 'A1B2C3',
          categoria: 'Corrupção',
          subcategoria: 'Desvio de verba pública',
          dataOcorrencia: '2026-02-10',
          horario: '14:30',
          urgencia: 'alta',
          local: 'Secretaria de Obras, Setor Financeiro',
          descricao: 'Relato de pagamentos a fornecedor sem prestação de serviço correspondente, identificado em notas fiscais duplicadas.',
          envolvidos: 'Servidor do setor de compras (nome não confirmado)',
          complementar: 'Documentos podem ser solicitados junto ao protocolo interno nº 2026/014.',
          arquivos: ['notas_fiscais.pdf'],
          status: 'investigacao',
          dataRegistro: '2026-02-15T09:12:00.000Z',
          historico: [
            { data: '2026-02-15T09:12:00.000Z', status: 'recebido', obs: 'Denúncia registrada pelo canal anônimo.' },
            { data: '2026-02-16T11:40:00.000Z', status: 'analise', obs: 'Triagem inicial concluída, encaminhada ao setor de crimes contra a administração.' },
            { data: '2026-02-18T08:05:00.000Z', status: 'investigacao', obs: 'Apuração aberta com a Delegacia Especializada.' }
          ]
        },
        {
          protocolo: 'DEN-302918',
          codigoAcesso: 'D4E5F6',
          categoria: 'Meio ambiente',
          subcategoria: 'Descarte irregular de resíduos',
          dataOcorrencia: '2026-02-25',
          horario: '19:00',
          urgencia: 'media',
          local: 'Margem do Rio Tamanduateí, próximo à Av. Central',
          descricao: 'Descarte recorrente de resíduos de construção civil às margens do rio, atraindo insetos e mau cheiro na região.',
          envolvidos: 'Caminhão branco sem identificação visível',
          complementar: '',
          arquivos: [],
          status: 'recebido',
          dataRegistro: '2026-02-28T20:03:00.000Z',
          historico: [
            { data: '2026-02-28T20:03:00.000Z', status: 'recebido', obs: 'Denúncia registrada pelo canal anônimo.' }
          ]
        }
      ];
      localStorage.setItem(KEY_DENUNCIAS, JSON.stringify(exemplo));
    }
    if (!localStorage.getItem(KEY_ADMINS)) {
      const admins = [
        { nome: 'Administrador Central', usuario: 'admin', senha: '123456', setor: 'Geral / Triagem', permissao: 'geral' },
        { nome: 'Agente Carlos Eduardo', usuario: 'carlos.agente', senha: '123456', setor: 'Crimes Ambientais', permissao: 'agente' }
      ];
      localStorage.setItem(KEY_ADMINS, JSON.stringify(admins));
    }
  }

  function getDenuncias() {
    return JSON.parse(localStorage.getItem(KEY_DENUNCIAS) || '[]');
  }

  function saveDenuncias(list) {
    localStorage.setItem(KEY_DENUNCIAS, JSON.stringify(list));
  }

  function addDenuncia(d) {
    const list = getDenuncias();
    list.unshift(d);
    saveDenuncias(list);
  }

  function findDenuncia(protocolo) {
    return getDenuncias().find(d => d.protocolo.toUpperCase() === String(protocolo).toUpperCase());
  }

  function updateDenunciaStatus(protocolo, novoStatus, obs) {
    const list = getDenuncias();
    const item = list.find(d => d.protocolo === protocolo);
    if (!item) return null;
    item.status = novoStatus;
    item.historico.push({ data: nowISO(), status: novoStatus, obs: obs || '' });
    saveDenuncias(list);
    return item;
  }

  function getAdmins() {
    return JSON.parse(localStorage.getItem(KEY_ADMINS) || '[]');
  }

  function saveAdmins(list) {
    localStorage.setItem(KEY_ADMINS, JSON.stringify(list));
  }

  function addAdmin(a) {
    const list = getAdmins();
    list.push(a);
    saveAdmins(list);
  }

  function checkLogin(usuario, senha) {
    return getAdmins().find(a => a.usuario === usuario && a.senha === senha) || null;
  }

  function setSession(admin) {
    sessionStorage.setItem(KEY_SESSION, JSON.stringify({ usuario: admin.usuario, nome: admin.nome, setor: admin.setor, permissao: admin.permissao }));
  }

  function getSession() {
    const raw = sessionStorage.getItem(KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    sessionStorage.removeItem(KEY_SESSION);
  }

  function requireSession(redirectTo) {
    const s = getSession();
    if (!s) {
      window.location.href = redirectTo || 'login.html';
    }
    return s;
  }

  return {
    CATEGORIAS, STATUS_LABEL, STATUS_ORDER,
    gerarProtocolo, gerarCodigoAcesso, nowISO, formatarData,
    seed,
    getDenuncias, saveDenuncias, addDenuncia, findDenuncia, updateDenunciaStatus,
    getAdmins, saveAdmins, addAdmin, checkLogin,
    setSession, getSession, clearSession, requireSession
  };
})();

DA.seed();
