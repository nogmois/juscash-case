# Scraper DJE - Juscash

## 1. Visão geral do projeto

Este repositório contém um **scraper Python** para automatizar a extração de publicações do Diário da Justiça Eletrônico (DJE) do Tribunal de Justiça de São Paulo (TJSP). O script:

- Realiza buscas avançadas por intervalo de datas e palavras-chave (por exemplo, "RPV" e "pagamento pelo INSS").
- Coleta links das páginas de consulta e faz download dos PDFs.
- Extrai texto dos PDFs e parseia dados de processo, datas, valores (principal, juros, honorários) e partes envolvidas.
- Persiste os registros no banco de dados PostgreSQL, evitando duplicatas e salvando em lotes.
- Oferece agendamento via APScheduler para execução diária automática.

## 2. Requisitos para execução local

- **Python 3.8+**
- **pip** (gerenciador de pacotes Python)
- **PostgreSQL** rodando e acessível
- Variáveis de ambiente configuradas em um arquivo `.env`

## 3. Instruções de instalação e execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/juscash-scraper.git
   cd juscash-scraper
   ```

2. **Crie e ative um ambiente virtual** (recomendado)

   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Linux/macOS
   .\.venv\Scripts\activate  # Windows
   ```

3. **Instale as dependências**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure variáveis de ambiente** criando um arquivo `.env` na raiz:

   ```env
   DATABASE_URL=postgresql://<usuário>:<senha>@<host>:<porta>/<nome_banco>
   ```

5. **Inicialize o banco de dados** (cria tabelas definidas em `models.py`)

   ```bash
   python scripts/init_db.py
   ```

6. **Execute o scraper manualmente**

   ```bash
   python run_scraper.py
   ```

7. **Agendamento automático** (opcional)

   ```bash
   python scheduler.py
   ```

   - Agenda o scraper para rodar diariamente às 06:00 (fuso America/Sao_Paulo).

## 4. Exemplos de uso

### Executar busca em lote

```bash
python run_scraper.py
# Saída esperada:
# [INFO] Total de resultados: 120, páginas estimadas: 12
# [1/120] https://...popup... → processando e salvando
# [BATCH SAVED] 50 publicações
# [FINAL BATCH SAVED] 20 publicações
# [DONE] Raspagem finalizada.
```

### Iniciar agendador

```bash
python scheduler.py
# APScheduler iniciará e executará scrape_page() todo dia às 06:00
```

## 5. Explicação do fluxo de trabalho do scraper

1. **Inicialização**

   - Ao importar `src.scraper`, as tabelas são criadas via `Base.metadata.create_all(bind=engine)`.

2. **Geração de payload e busca inicial**

   - Navega até a página de busca avançada, coleta campos do formulário e popula datas, caderno e termos.
   - Envia requisição POST para `consultaAvancada.do` e obtém primeira página.

3. **Navegação paginada**

   - Lê o total de resultados e calcula quantas páginas de 10 resultados existem.
   - Para cada página, faz POST em `trocaDePagina.do` e coleta links de popup.

4. **Download e extração de texto**

   - Para cada link, gera a URL do PDF, faz download, extrai texto com `pdfminer.six`.

5. **Parse de campos**

   - Regex para capturar número do processo, data de disponibilização, autor, advogados.
   - Função `extract_money_after_label` busca valores monetários específicos e converte para `Decimal`.

6. **Persistência em lote**

   - Verifica duplicatas (por `process_number`).
   - Acumula objetos `Publication` em memória e salva no banco quando atinge `batch_size`.
   - Finaliza salvando o batch restante.

7. **Agendamento**

   - `scheduler.py` usa `APScheduler` para agendar `scrape_page()` diariamente às 06:00 no fuso de São Paulo.

---

_Desenvolvido por Murilo — Senior Full Stack Developer_
