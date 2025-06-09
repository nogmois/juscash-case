# 1) Imagem base com Node.js
FROM node:18-alpine AS build

# 2) Define diretório de trabalho
WORKDIR /usr/src/app

# 3) Copia package.json e lock para instalar deps
COPY package.json package-lock.json ./

# 4) Instala só as dependências de produção
RUN npm install --production

# 5) Copia todo o código fonte
COPY . .

# 6) Variáveis de ambiente padrão
ENV PORT=3000
ENV NODE_ENV=production

# 7) Expõe a porta da API
EXPOSE 3000

# 8) Comando de inicialização
CMD ["node", "src/app.js"]
