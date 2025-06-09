# frontend/Dockerfile

FROM node:18-alpine
WORKDIR /app

# copie o package.json e o lock correto
COPY package.json package-lock.json ./

# instale as deps com npm
RUN npm install

# copie o resto do código
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
