FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 8000

CMD ["npm", "server.js"]
