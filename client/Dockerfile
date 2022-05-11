# Source https://github.com/vercel/next.js/tree/352e60deddab9667d045b4eca2a77ef25a8adbaa/examples/with-docker
FROM amd64/node:14-alpine3.14 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /client
ARG NEXT_PUBLIC_API_HOST

COPY package.json package-lock.json ./
RUN npm clean-install

# Rebuild the source code only when needed
FROM amd64/node:14-alpine3.14 AS builder
WORKDIR /client
COPY --from=deps /client/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM amd64/node:14-alpine3.14 AS runner
WORKDIR /client

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /client/next.config.js ./
COPY --from=builder /client/public ./public
COPY --from=builder /client/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /client/.next/static ./.next/static

USER nextjs

EXPOSE ${PORT}

CMD ["node", "server.js"]
