FROM node:carbon-alpine

USER node

WORKDIR /home/node/tokenbb/server

COPY ./package.json .
RUN npm install
COPY . .

CMD [ "node", "index.js" ]
