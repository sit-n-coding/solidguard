<div align="center">
  <p align="center">
    <img src="./docs/img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>SolidGuard Deployment</h1>
</div>

**Version**: `v1.0.1`

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
  - [0. Prerequisites](#0-prerequisites)
  - [1. Deploying Smart Contracts.](#1-deploying-smart-contracts)
  - [2. Environment variables for the Web Application](#2-environment-variables-for-the-web-application)
  - [3. HTTPS Configuration](#3-https-configuration)
  - [4. Deploying via docker-compose](#4-deploying-via-docker-compose)

## Environment Variables
* See [api environment variables](api.md#environment-variables).

### 0. Prerequisites
You will need the following:
* Docker: Installed on your computer.
* Etherscan: Third party API keys.
* Infura/Alchemy: Ethereum Provider.

### 1. Deploying Smart Contracts.
First, you will need to follow the instructions used to deploy [the SolidGuardManager](./docs/blockchain.md). Once you are done, you should have the address to the proxy of the SolidGuardManager, which should be used in step 2. Make sure when you're doing this, you are inside the `blockchain` directory!

### 2. Environment variables for the Web Application
Next, you will need to populate the `.env` file in the root folder of the solidguard repository. This is identical to the environment variables in [the api](./docs/api.md#environment-variables), but with the following changes:
 * `CORS=false`
 * `SECURE=true`
 * `POSTGRES_HOST=postgres`
 * `REDIS_HOST=redis`

**Note:** Make sure at this point that you don't have any `.env` files in the `client` or `api` folder, and only one `.env` file at the root directory!

### 3. HTTPS Configuration
To ensure this is production ready. You will need the certificate and private key to enable HTTPS. Typically you'd want to generate these files with [certbot](https://certbot.eff.org/) or another certificate authority, but locally, you will need to run
```bash
openssl req -x509 -nodes -newkey rsa:4096 -keyout solidguard.key -out solidguard.crt
```
Make sure these files are saved in the `proxy/certs` folder!

### 4. Deploying via docker-compose
All you need to do to deploy the web application is with the following command:
```bash
docker-compose up --build
```
