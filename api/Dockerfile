ARG PORT

FROM amd64/node:14-alpine3.14 AS deps
WORKDIR /api

COPY package.json package-lock.json ./
RUN npm clean-install
COPY prisma ./prisma/
RUN npx prisma generate


FROM amd64/node:14-alpine3.14 AS builder
WORKDIR /api

COPY --from=deps /api/node_modules ./node_modules
COPY . .

RUN npm run build


FROM amd64/node:14-alpine3.14 AS runner
WORKDIR /api

RUN apk update \
    && apk --no-cache add postgresql-client \
    && apk --no-cache add --virtual \
        builds-deps \
        build-base \
        python3

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 prisma

COPY --from=builder --chown=prisma:nodejs /api/node_modules ./node_modules
COPY --from=builder --chown=prisma:nodejs /api/dist ./dist
COPY --from=builder --chown=prisma:nodejs /api/prisma ./prisma
COPY --from=builder --chown=prisma:nodejs /api/package.json ./package.json

USER prisma

EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main"]
