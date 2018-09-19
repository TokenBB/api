FROM node:carbon-alpine as development

USER node
RUN mkdir -p /home/node/client
WORKDIR /home/node/client
COPY ./package*.json ./
RUN npm install
COPY . .
COPY ./_secure-random.patch.js ./node_modules/secure-random/lib/secure-random.js

FROM development as production

USER node
WORKDIR /home/node/client
RUN npm run build
