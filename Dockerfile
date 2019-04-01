FROM node:11-alpine

RUN mkdir -p /home/node/postman-to-k6/node_modules && chown -R node:node /home/node/postman-to-k6
WORKDIR /home/node/postman-to-k6
COPY package*.json ./
USER node
COPY --chown=node:node . .
RUN npm install --production

ENTRYPOINT ["node", "bin/postman-to-k6.js"]
