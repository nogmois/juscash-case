# JusCash Case – Automação e Gerenciamento de Publicações do DJE

Este repositório monolito contém três serviços:

- **backend-api**: API em Node.js + Express para gerenciar publicações
- **juscash-frontend**: SPA React para interface Kanban, login, cadastro e detalhes
- **tjsp-scraper**: Scraper Python para extrair publicações do DJE e popular o banco

Todos os serviços são orquestrados via Docker-Compose junto com um banco PostgreSQL.

---

## 📂 Estrutura do repositório

/ ← raiz do monorepo
├── backend-api/ # API Node.js + Express
│ ├── Dockerfile
│ └── src/… # código-fonte da API
│
├── juscash-frontend/# Frontend React (Vite)
│ ├── Dockerfile
│ └── src/… # código-fonte do React
│
├── tjsp-scraper/ # Scraper Python + SQLAlchemy
│ ├── Dockerfile
│ └── src/… # código-fonte do scraper
│
├── docker-compose.yml # orquestra todos os serviços + Postgres
├── .gitignore
└── README.md

yaml
Copiar
Editar

---

## 🚀 Pré-requisitos

- Docker (>= 20.x)
- Docker-Compose (>= 1.29.x)

> **Não é necessário** ter Node, Python ou PostgreSQL instalados localmente — tudo roda em containers.

---

## ⚙️ Variáveis de ambiente

Cada serviço carrega um arquivo `.env` em sua pasta. Você pode copiar o `.env.example` correspondente e ajustá-lo:

```bash
# No backend-api/
cp backend-api/.env.example backend-api/.env

# No juscash-frontend/
cp juscash-frontend/.env.example juscash-frontend/.env

# No tjsp-scraper/
cp tjsp-scraper/.env.example tjsp-scraper/.env
Ajuste as variáveis conforme necessário (ex.: URLs, credenciais, tokens JWT).

▶️ Como rodar em modo desenvolvimento
No diretório raiz do projeto, execute:

bash
Copiar
Editar
docker-compose up --build
Isso vai:

Subir o PostgreSQL (porta 5432)

Buildar e rodar a API (porta 8012)

Buildar e rodar o Frontend (porta 5173)

Buildar e rodar o Scraper (roda uma vez e encerra)

A primeira execução do scraper vai popular a base; agendamentos subsequentes (via cron interno) continuarão rodando conforme especificado.

Para parar tudo:

bash
Copiar
Editar
docker-compose down
🔗 Endpoints principais
API (Express) em http://localhost:8012

GET /api/publications

PATCH /api/publications/:id/status

Swagger UI: http://localhost:8012/api/docs

Frontend (React) em http://localhost:5173

Login, Cadastro, Kanban e Modal de Detalhes
```

📝 Documentação
Dentro da pasta /docs (ou link no Google Drive), você encontra:

Manual de Produto (PDF)

Documentação Técnica (PDF):

OpenAPI/Swagger

Diagrama do banco de dados

Fluxos de scraping e automação

Instruções de deploy
