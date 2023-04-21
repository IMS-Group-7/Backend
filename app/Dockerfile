FROM node:16-alpine3.15 as development

WORKDIR /usr/src/app

COPY ./app/package*.json ./

RUN npm install

COPY ./app ./

RUN npx prisma generate

RUN npm run build

FROM node:16-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./app/package*.json ./
COPY ./app/.env ./

RUN npm install --only=production
RUN npx prisma generate

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]

# Prisma migrate build
FROM node:16-alpine3.15 as migrate
WORKDIR /usr/src/app
COPY ./app/package*.json ./
RUN npm install
COPY ./app ./
COPY --from=development /usr/src/app/node_modules/prisma /usr/src/app/node_modules/prisma
COPY --from=development /usr/src/app/node_modules/@prisma /usr/src/app/node_modules/@prisma