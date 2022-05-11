FROM amd64/node:14-alpine3.14 AS deps
WORKDIR /blockchain

COPY package.json package-lock.json ./
RUN npm clean-install

FROM amd64/node:14-alpine3.14 AS runner

WORKDIR /blockchain

COPY --from=deps /blockchain/node_modules ./node_modules
COPY . .

CMD ["npm", "test"]
