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
│   ├── .env.example   # Variáveis de ambiente da API
│   └── src/…          # Código-fonte da API
│
├── juscash-frontend/  # Frontend React (Vite)
│   ├── Dockerfile     # Imagem Docker do Frontend
│   ├── .env.example   # Variáveis de ambiente do Frontend
│   └── src/…          # Código-fonte do React
│
├── tjsp-scraper/      # Scraper Python + SQLAlchemy
│   ├── Dockerfile     # Imagem Docker do Scraper
│   ├── .env.example   # Variáveis de ambiente do Scraper
│   └── src/…          # Código-fonte do Scraper
│
├── docs/              # Documentação em PDF e diagramas
├── docker-compose.yml # Orquestração de containers
├── .gitignore         # Regras de ignore globais
└── README.md          # Este arquivo
```

---

## 🚀 Pré-requisitos

- **Docker** (>= 20.x)
- **Docker Compose** (>= 1.29.x)

> **Não é necessário** ter Node.js, Python ou PostgreSQL instalados localmente; tudo roda em containers.

---

## ⚙️ Configuração de Ambiente

Cada serviço possui um arquivo de exemplo de variáveis de ambiente:

```bash
# Na raiz do projeto
cp backend-api/.env.example backend-api/.env
cp juscash-frontend/.env.example juscash-frontend/.env
cp tjsp-scraper/.env.example tjsp-scraper/.env
```

Edite os `.env` conforme necessário (URLs, credenciais, tokens, etc.).

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
