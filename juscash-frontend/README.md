# Juscash Frontend

## 1. Visão geral do projeto

O front-end do **Juscash** é uma aplicação web React que consome a API Node.js/Express para permitir o gerenciamento de publicações do Diário da Justiça Eletrônico (DJE) em formato Kanban. Funcionalidades principais:

- Autenticação de usuários (login e cadastro) via JWT.
- Exibição de publicações em quatro colunas: Novas, Lidas, Enviadas para ADV e Concluídas.
- Drag-and-drop para alterar o status das publicações.
- Filtro de publicações por texto (processo, autor, réu, advogado) e intervalo de datas.
- Modal com detalhes completos de cada publicação (datas, valores, conteúdo).
- Responsividade para desktop e dispositivos móveis.

## 2. Requisitos para execução local

- **Node.js** v16 ou superior
- **npm** v8+ ou **Yarn**
- API backend do Juscash rodando e acessível (configurável em `VITE_API_URL`)

## 3. Instruções de instalação e execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/juscash-frontend.git
   cd juscash-frontend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure a URL da API** criando um arquivo `.env` na raiz:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Inicie em modo de desenvolvimento (hot reload)**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

   Acesse `http://localhost:5173`.

5. **Build para produção**

   ```bash
   npm run build
   # ou
   yarn build
   ```

6. **Preview da build**

   ```bash
   npm run preview
   # ou
   yarn preview
   ```

## 4. Tecnologias e Ferramentas

- **React 18**: biblioteca principal para construção de interfaces
- **Vite**: bundler moderno para desenvolvimento rápido
- **Ant Design**: sistema de design e componentes prontos
- **Axios**: cliente HTTP para comunicação com backend
- **Day.js**: manipulação de datas e fuso-horário (UTC → America/Sao_Paulo) e exibição de tempo relativo
- **React Beautiful DnD**: funcionalidade de drag-and-drop
- **React Router v6**: roteamento e proteção de rotas
- **Environment Variables**: configuração via `VITE_API_URL` para apontar para o backend

## 5. Estrutura do Projeto

```
├── public/
│   └── index.html             # Template HTML com div#root
├── src/
│   ├── assets/                # Imagens e logos (logo-novo.png)
│   ├── components/            # Componentes reutilizáveis
│   │   ├── KanbanBoard.jsx    # Contexto de drag/drop e layout principal
│   │   ├── KanbanColumn.jsx   # Coluna Kanban com scroll infinito
│   │   ├── PublicationCard.jsx# Card individual clicável
│   │   ├── PublicationModal.jsx# Modal de detalhes
│   │   ├── Navbar.jsx         # Cabeçalho com logout
│   │   └── PrivateRoute.jsx   # Proteção de rotas via token JWT
│   ├── pages/                 # Páginas de rota
│   │   ├── Kanban.jsx         # Página principal Kanban
│   │   ├── Login.jsx          # Página de login
│   │   └── Register.jsx       # Página de cadastro
│   ├── routes/                # Definição de rotas da aplicação
│   │   └── AppRoutes.jsx      # Mapeamento de rotas públicas/privadas
│   ├── services/              # Serviços de API
│   │   ├── apiClient.js       # Instância Axios com interceptors
│   │   ├── authService.js     # Login e registro
│   │   └── publicationService.js# Busca e atualização de status
│   ├── App.jsx                # ConfigProvider (Antd locale)
│   └── main.jsx               # Ponto de entrada com ReactDOM
├── .env                       # Variáveis de ambiente
├── package.json               # Dependências e scripts
└── vite.config.js             # Configuração do Vite e aliases
```

## 6. Exemplos de requisições à API

Esses exemplos usam `curl` para interação direta com o backend, mas o front-end encapsula todas essas chamadas.

### Cadastro de usuário

```bash
curl -X POST $VITE_API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Murilo","email":"murilo@ex.com","password":"Secreta123!"}'
```

### Login

```bash
curl -X POST $VITE_API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"murilo@ex.com","password":"Secreta123!"}'
# Retorna: { "access_token": "<token>" }
```

### Buscar publicações com filtro

```bash
curl "$VITE_API_URL/api/publications?status=new&query=1234&from=2025-01-01&to=2025-01-31" \
  -H "Authorization: Bearer <token>"
```

### Atualizar status de publicação

```bash
curl -X PATCH $VITE_API_URL/api/publications/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status":"read"}'
```

## 5. Explicação do fluxo de trabalho do Kanban

No front-end, cada publicação segue o campo `status` e é apresentada em uma das quatro colunas:

1. **new**: Publicações novas
2. **read**: Publicações lidas
3. **sent_adv**: Publicações enviadas para ADV
4. **done**: Publicações concluídas

### Regras de movimentação

- **Avanço**: permitido somente para a coluna imediatamente seguinte (`new → read → sent_adv → done`).
- **Retorno**: somente de `sent_adv` para `read`.
- Qualquer outro movimento é bloqueado no front-end antes da chamada à API.

O front-end utiliza `react-beautiful-dnd` para implementar o drag-and-drop e aplica essas regras antes de chamar o endpoint de atualização de status.

---

_Desenvolvido por Murilo — Senior Full Stack Developer_
