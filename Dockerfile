FROM node:24.13.1-bookworm-slim

WORKDIR /home/app

COPY package*.json .

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "./src/index.js"]