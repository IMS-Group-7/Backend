FROM node:16-alpine3.15 as development

WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm cache clean --force
RUN npm install

COPY ./app ./

RUN npm install -g typescript && tsc

FROM node:16-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./app/package*.json ./
COPY ./app/.env ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
