ARG BLOCKCHAIN_PORT

FROM amd64/node:14-alpine3.14 AS deps
WORKDIR /blockchain

COPY ./package.json ./package-lock.json ./
RUN npm clean-install

FROM amd64/node:14-alpine3.14 AS builder
WORKDIR /blockchain

COPY ./hardhat.config.ts ./
COPY ./contracts ./contracts

COPY --from=deps /blockchain/node_modules ./node_modules
COPY --from=deps /blockchain/package.json ./package.json

RUN npm run build


FROM amd64/node:14-alpine3.14 AS runner
WORKDIR /blockchain

ENV NODE_ENV production

RUN addgroup --system --gid 1001 js
RUN adduser --system --uid 1001 hardhat

COPY --chown=hardhat:js ./deploy/ ./deploy

COPY --from=builder --chown=hardhat:js /blockchain/node_modules ./node_modules
COPY --from=builder --chown=hardhat:js /blockchain/package.json ./package.json
COPY --from=builder --chown=hardhat:js /blockchain/hardhat.config.ts ./hardhat.config.ts
COPY --from=builder --chown=hardhat:js /blockchain/contracts ./contracts
COPY --from=builder --chown=hardhat:js /blockchain/artifacts ./artifacts
COPY --from=builder --chown=hardhat:js /blockchain/cache ./cache

RUN mkdir .openzeppelin
RUN chown hardhat:js .openzeppelin

USER hardhat

EXPOSE ${BLOCKCHAIN_PORT}

CMD ["npx", "hardhat", "run", "./deploy/main/solid-guard-manager.deploy.ts", "--network", "providerNetwork"]
