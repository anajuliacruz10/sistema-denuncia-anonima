# Denúncia Anônima — Sistema Web de Denúncias Anônimas

Protótipo acadêmico de um sistema web de denúncias anônimas, desenvolvido com
**HTML5, CSS3 e JavaScript puro** (sem frameworks e sem backend). Os dados são
simulados com `localStorage`/`sessionStorage`, funcionando inteiramente no
navegador — ideal para publicação estática no **GitHub Pages**.

## Estrutura e organização dos arquivos

```
denuncia-anonima/
├── index.html                 → Tela inicial (institucional)
├── denuncia.html               → Formulário de registro de denúncia (Denunciante)
├── consultar.html              → Consulta de andamento por protocolo (Denunciante)
├── admin/
│   ├── login.html              → Acesso restrito (Administrador)
│   ├── dashboard.html          → Painel com indicadores (Administrador)
│   ├── denuncias.html          → Listagem, filtros e gestão de status (Administrador)
│   └── administradores.html    → Cadastro da equipe de administração (Administrador)
├── css/
│   └── style.css               → Estilos globais (tokens de cor, tipografia, componentes)
├── js/
│   ├── data.js                 → Camada de dados: seed, CRUD em localStorage, sessão
│   ├── main.js                 → Comportamento do site público (menu, link ativo)
│   ├── denuncia.js              → Lógica do formulário de denúncia
│   ├── consultar.js             → Lógica da consulta de protocolo
│   ├── admin-login.js           → Autenticação do painel
│   ├── admin-common.js          → Guarda de sessão + identidade do agente + logout
│   ├── admin-dashboard.js       → Cálculo e renderização dos indicadores
│   ├── admin-denuncias.js       → Filtros, tabela e modal de gestão de status
│   └── admin-administradores.js → Cadastro e listagem de administradores
└── README.md
```

HTML, CSS e JavaScript ficam em arquivos totalmente separados, e o JavaScript
é modularizado por página/responsabilidade — `data.js` concentra tudo o que é
persistência e é reaproveitado por todas as demais páginas, evitando
duplicação de código entre os perfis de Denunciante e Administrador.

## Perfis de acesso e funcionalidades

### Usuário / Denunciante (área pública, sem login)
- **Tela inicial**: apresentação do canal, garantias de sigilo e atalhos para
  registrar ou consultar uma denúncia.
- **Registrar denúncia** (`denuncia.html`): formulário com categoria e
  subcategoria dependentes, data/horário do fato, nível de urgência, local,
  descrição, envolvidos, anexos (simulados) e informações complementares. Ao
  enviar, o sistema gera automaticamente um **protocolo** (`DEN-XXXXXX`) e um
  **código de acesso** exclusivos — únicos dados que permitem localizar a
  denúncia depois, sem qualquer identificação do denunciante.
- **Consultar denúncia** (`consultar.html`): informando protocolo + código de
  acesso, o denunciante visualiza o status atual e a linha do tempo completa
  do andamento da apuração.

### Administrador da Delegacia (área restrita, com login)
- **Login** (`admin/login.html`): acesso com usuário e senha
  (`admin` / `123456` nos dados de exemplo). A sessão é mantida via
  `sessionStorage` e protegida em todas as páginas internas.
- **Dashboard** (`admin/dashboard.html`): indicadores gerais (total,
  recebidas, em análise, em investigação, concluídas, arquivadas),
  distribuição por nível de urgência e top categorias mais denunciadas.
- **Denúncias** (`admin/denuncias.html`): listagem completa com filtros por
  protocolo, categoria, status e urgência; cada denúncia pode ser aberta em
  um modal de gestão para **atualizar o status** e registrar uma observação,
  que fica salva na linha do tempo vista pelo denunciante.
- **Administradores** (`admin/administradores.html`): cadastro de novos
  agentes/administradores (nome, usuário, setor e nível de permissão) e
  listagem da equipe com acesso ao painel.

## Otimização de recursos

- `css/style.css` e `js/data.js`/`js/main.js` são **compartilhados** entre
  todas as páginas dos dois perfis — não há CSS ou lógica de dados duplicada.
- A navegação, os componentes (cartões, tabelas, badges, formulários) e os
  tokens de cor seguem o mesmo sistema visual em todo o site, garantindo
  consistência entre a área do Denunciante e a área do Administrador.
- O layout é responsivo (menu retrátil em telas pequenas, grids que se
  reorganizam em coluna única) e os estados de foco são visíveis para
  acessibilidade via teclado.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta para a
   branch `main` (o arquivo `index.html` precisa ficar na raiz do
   repositório).
2. No GitHub, acesse **Settings → Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde a publicação — o GitHub fornecerá a URL pública do site
   (algo como `https://seu-usuario.github.io/nome-do-repositorio/`).

## Observações do protótipo

- Não há backend real: todos os dados (denúncias e administradores) são
  armazenados no `localStorage` do navegador, e a sessão do administrador no
  `sessionStorage`. Ao limpar os dados do navegador, o sistema volta ao
  estado inicial de exemplo.
- O upload de evidências é simulado (os nomes dos arquivos selecionados são
  exibidos, mas nada é enviado a um servidor).
