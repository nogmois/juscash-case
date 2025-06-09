# Juscash Backend API

## 1. Visão geral do projeto

A API backend do **Juscash** gerencia usuários e publicações do Diário da Justiça Eletrônico (DJE). Ela oferece:

- Autenticação segura via JWT (cadastro e login)
- Endpoints REST para buscar, filtrar e atualizar o status de publicações judiciais
- Integração com o front-end Kanban por meio do campo `status`

## 2. Requisitos para execução local

- **Node.js** v16+
- **npm** v8+ ou **Yarn**
- **PostgreSQL** (v12+)
- Arquivo de ambiente `.env` configurado

## 3. Instruções de instalação e execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/juscash-backend.git
   cd juscash-backend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou yarn install
   ```

3. **Configure as variáveis de ambiente** criando um arquivo `.env` na raiz:

   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=juscash
   DB_USER=usuario
   DB_PASS=senha
   JWT_SECRET=uma_chave_super_secreta
   PORT=3000
   ```

4. **Verifique o banco de dados**: certifique-se de que o PostgreSQL está rodando e que o banco existe.
5. **Inicie a API**

   ```bash
   npm start
   # ou yarn start
   ```

6. **Acesse** `http://localhost:3000` para verificar se está rodando.

## 4. Exemplos de requisições à API

### Cadastro de usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Murilo","email":"murilo@ex.com","password":"Secreta123!"}'
```

### Login

```bash
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"murilo@ex.com","password":"Secreta123!"}'
# Retorna: { "access_token": "<token>" }
```

### Listar/Filtrar publicações

```bash
curl "http://localhost:3000/api/publications?status=new&query=1234&from=2025-01-01&to=2025-01-31" \
  -H "Authorization: Bearer <token>"
```

### Buscar publicação por ID

```bash
curl http://localhost:3000/api/publications/1 \
  -H "Authorization: Bearer <token>"
```

### Atualizar status de publicação

```bash
curl -X PATCH http://localhost:3000/api/publications/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"status":"read"}'
```

## 5. Explicação do fluxo de trabalho do Kanban

No front-end, as publicações transitam por quatro colunas de acordo com o campo `status`:

1. **new**: Publicações novas
2. **read**: Publicações lidas
3. **sent_adv**: Enviadas para ADV
4. **done**: Concluídas

### Regras de movimentação

- **Movimento à frente**: apenas para a próxima fase (`new → read → sent_adv → done`).
- **Retorno permitido**: somente de `sent_adv` para `read`.
- Movimentos inválidos são bloqueados no front-end antes de chamar a API.

O backend aceita qualquer status válido do enum (`new`, `read`, `sent_adv`, `done`), enquanto o front-end aplica as regras de fluxo acima.
