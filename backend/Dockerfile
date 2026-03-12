FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=3000
ENV DB_PATH=/app/data/trainia.db

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "src/server.js"]
