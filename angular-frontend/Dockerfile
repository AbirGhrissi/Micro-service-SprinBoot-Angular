FROM node:18-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "start"]  # Lance sur le port 4200 par défaut

# Étape de production
FROM node:20.19-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --production
COPY . .
RUN npm install -g @angular/cli
RUN npm run build
CMD ["npm", "start"]  # Ou utilisez un serveur HTTP comme 'serve'