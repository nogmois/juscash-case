# JusCash Case – Automação e Gerenciamento de Publicações do DJE

Este repositório monolito integra três serviços principais para automatizar a coleta, gerenciamento e visualização de publicações do Diário da Justiça Eletrônico (DJE) de São Paulo:

- **backend-api**: API em Node.js + Express para CRUD, filtros, autenticação e atualização de status das publicações.
- **juscash-frontend**: SPA React (Vite) com interface Kanban, telas de login/cadastro e modal de detalhes das publicações.
- **tjsp-scraper**: Scraper em Python com SQLAlchemy para extrair dados do DJE e popular o banco.

Todos os serviços são orquestrados via Docker Compose junto com um banco PostgreSQL.

---

## 📂 Estrutura do Repositório

```text
/ (raiz)
├── backend-api/       # API Node.js + Express
│   ├── Dockerfile     # Imagem Docker da API
│   └── src/…          # Código-fonte da API
│
├── juscash-frontend/  # Frontend React (Vite)
│   ├── Dockerfile     # Imagem Docker do Frontend
│   └── src/…          # Código-fonte do React
│
├── tjsp-scraper/      # Scraper Python + SQLAlchemy
│   ├── Dockerfile     # Imagem Docker do Scraper
│   └── src/…          # Código-fonte do Scraper
│
├── docs/              # Documentação em PDF e diagramas
├── docker-compose.yml # Orquestração de containers
├── .gitignore         # Regras de ignore globais
├── .env.example       # Exemplo de variáveis de ambiente centralizado
└── README.md          # Este arquivo
```

---

## 🔧 Clonando o Repositório

Para obter o código localmente:

```bash
git clone https://github.com/nogmois/juscash-case.git
cd juscash-case
```

---

## 🚀 Pré-requisitos

- **Docker** (>= 20.x)
- **Docker Compose** (>= 1.29.x)

> **Não é necessário** ter Node.js, Python ou PostgreSQL instalados localmente; tudo roda em containers.

---

## ⚙️ Configuração de Ambiente

Todas as variáveis de ambiente estão centralizadas em um único arquivo na raiz do projeto. Crie o `.env` copiando e adequando o exemplo:

```bash
cp .env.example .env
```

Edite o `.env` para incluir todos os parâmetros necessários:

```dotenv
# Banco de Dados (PostgreSQL)
DB_HOST=db
DB_PORT=5432
DB_NAME=juscash_db
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_SECRET=seu_jwt_secret_aqui

# Frontend
VITE_API_URL=http://localhost:3000

# Scraper
DATABASE_URL=postgresql://postgres:postgres@db:5432/juscash_db
```

O Docker Compose carregará automaticamente este arquivo e injetará as variáveis em cada serviço.

---

## ▶️ Executando em Desenvolvimento

No diretório raiz, execute:

```bash
docker-compose up --build
```

Este comando irá:

1. Criar um container PostgreSQL (porta **5432**)
2. Buildar e iniciar a API (porta **8012**)
3. Buildar e iniciar o Frontend (porta **5173**)
4. Buildar e executar o Scraper (coleta inicial) e, em seguida, permanece rodando para agendamentos

A primeira execução do scraper popula o banco; coletas seguintes são disparadas automaticamente conforme o cron interno.

Para parar e remover containers:

```bash
docker-compose down
```

---

## 🔗 Endpoints Principais

### API (Node.js + Express)

Base URL: `http://localhost:8012`

- **GET** `/api/publications` — Lista todas as publicações (suporta filtros: processo, data, status)
- **PATCH** `/api/publications/:id/status` — Atualiza status (`new`, `read`, `sent_adv`, `done`)
- **Swagger UI**: `http://localhost:8012/api/docs`

### Frontend (React)

Base URL: `http://localhost:5173`

- Tela de Login e Cadastro
- Kanban para gerenciar publicações por status
- Modal de detalhes com informações completas de cada publicação

---

## 📝 Documentação

Na pasta `docs/` você encontra:

- **Manual do Produto** (PDF): Visão funcional e fluxo de uso para usuários finais.
- **Documentação Técnica** (PDF):

  - Especificação OpenAPI/Swagger
  - Diagrama de banco de dados
  - Fluxos de scraping e automação
  - Instruções de deploy
