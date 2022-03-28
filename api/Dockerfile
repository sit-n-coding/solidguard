FROM amd64/node:14-alpine3.14
WORKDIR /backend

# install dependencies
RUN apk update
RUN apk add postgresql-client
RUN apk add dos2unix
RUN apk --no-cache add --virtual builds-deps build-base python3

# install node dependencies and build application
COPY ./package.json ./
COPY ./prisma ./prisma/
RUN npm i
COPY . .
RUN npx prisma generate
RUN npm run build

# format script
RUN chmod +x ./prisma/wait-for-postgres.sh
RUN dos2unix ./prisma/wait-for-postgres.sh

# wait for postgres, then migrate and run build
EXPOSE ${PORT}
CMD sh ./prisma/wait-for-postgres.sh npx prisma migrate deploy && node dist/src/main