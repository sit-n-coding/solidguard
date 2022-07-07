<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>Setup for solidguard-api</h1>
</div>

**Version:** `v1.0.3`

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
  - [1. Install Databases](#1-install-databases)
  - [2. Environment Variables Setup](#2-environment-variables-setup)
  - [3. Install dependencies](#3-install-dependencies)
  - [4. Prisma Setup](#4-prisma-setup)
  - [5. Start NestJS Server](#5-start-nestjs-server)

## Environment Variables
* `PORT` Where the api will be hosted.
* `ADMIN_USERNAME` Default admin username that is created on startup.
* `ADMIN_PASSWORD` Default admin password that is created on startup.
* **PostgreSQL** - Database used for storing user, exploit and subscription information.
  * `POSTGRES_USER` PostgreSQL user's username (must have write access)
  * `POSTGRES_PASSWORD` PostgreSQL user's password (must have write access)
  * `POSTGRES_DB` PostgreSQL database name.
  * `POSTGRES_HOST` PostgreSQL host. Use `localhost` when running locally, or `postgres` when running via docker-compose.
  * `POSTGRES_PORT` PostgreSQL database port.
  * `POSTGRES_SCHEMA` PostgreSQL schema.
  * `POSTGRES_URL` equivalent to: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}&sslmode=prefer`
* **Redis** - Database used for queues/jobs and session storage.
  * `REDIS_HOST` Host name of the redis database. Use `localhost` when running locally, or `redis` when running via docker-compose.
  * `REDIS_PORT` Port of the redis database.
* **Etherscan** - Third Party API used for getting blockchain information.
  * `ETHERSCAN_URL` Etherscan API URL. Can be mainnet or rinkeby. Dictates which Ethereum network that this application will be scanning/pausing on.
  * `ETHERSCAN_API_KEY` Etherscan API key. You will need to create an account to generate one. See [this](https://info.etherscan.com/api-keys/) for more information.
* **Ethereum** - Blockchain used for SolidGuard. Note that the network referred must be consistent between Etherscan and all blockchain-related environment variables.
  * `DEPLOY_PRIVATE_KEY` Private key used to deploy or has ownership of the SolidGuardManager contract.
  * `PROVIDER_URL` Blockchain provider URL to get information from the blockchain via the `ethers` library. You can use [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) here, just make sure the network it is providing is the same as the Etherscan API URL (i.e. must use a rinkeby provider url if using rinkeby.etherscan).
  * `SGM_ADDRESS` SolidGuardManager's **proxy** smart contract address on the specified blockchain. See [here](blockchain.md) on how to deploy the SolidGuardManager.
* **SendGrid** - Used to send emails/notifications to those subscribing their smart contracts.
  * `SENDGRID_API_KEY` Web API key to send emails on SendGrid.
  * `SENDGRID_DOMAIN` Domain used for sending said emails.

## Local Setup

### 1. Install Databases

Before we proceed, you will need to install PostgreSQL and Redis on your computer, and set up a user with read/write permissions to the database.

There are many ways to install these databases, so I have linked the ones that my colleagues and I have used:
* PostgreSQL (OSX) https://dyclassroom.com/howto-mac/how-to-install-postgresql-on-mac-using-homebrew
* Redis (OSX) https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8
* Redis (Windows) https://stackoverflow.com/questions/6476945/how-do-i-run-redis-on-windows?rq=1


Once you have installed your databases, you will need to access PostgreSQL and run a command that will create a user with read/write access. To create a user for this server, you will need to run the SQL command (works with PostgreSQL 8.1 and above):
```sql
CREATE USER user SUPERUSER PASSWORD 'password';
```
You can customize this command however you'd like, see [this link](https://www.postgresql.org/docs/8.0/sql-createuser.html) for more information.

You will then need to create a database, and fill the name of the database in `POSTGRES_DB`. You can do it by running in psql:
```
createdb <POSTGRES_DB>
```

### 2. Environment Variables Setup
Fill in the following environment variables in a new file called `.env`. Examples of these variables can be seen in [`.env.example`](../.env.example), and information can be seen [here](#environment-variables).

### 3. Install dependencies

Install the dependencies for the Nest application:

```bash
npm install
```

After all dependencies have been installed, it will automatically run `npm run prisma:generate`, which will generate all the entity types used in the server.


### 4. Prisma Setup

To setup Prisma, you will need to run

```bash
npm run migrate:dev
```

to migrate the schemas used in the PostgreSQL database.

### 5. Start NestJS Server

Run Nest Server in Development mode:

```bash
npm start

# watch mode
npm run start:dev
```
Now your server should be up! For instructions on using the APIs, see `/api/` for the Swagger documentation.

[Back to top](#table-of-contents)
