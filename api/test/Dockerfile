FROM amd64/node:14-alpine3.14 AS deps
WORKDIR /api

COPY package.json package-lock.json ./
RUN npm clean-install

FROM amd64/node:14-alpine3.14 AS runner

WORKDIR /api

COPY --from=deps /api/node_modules ./node_modules
COPY . .

CMD ["sh", "-c", "npm run migrate:dev && exec npm run test"]
