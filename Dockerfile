
FROM node:latest

WORKDIR /devburger-api

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["node", "src/server.js"]

EXPOSE 3200