<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>SolidGuard Deployment</h1>
</div>

**Version**: `v1.0.3`

## Table of Contents
- [*Save* and the connected server should be created. The next time you visit the pgAdmin page, you should see the server already present.](#save-and-the-connected-server-should-be-created-the-next-time-you-visit-the-pgadmin-page-you-should-see-the-server-already-present)
      - [4.1 metabase](#41-metabase)
      - [4.2 portainer-ce](#42-portainer-ce)

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
 * `METABASE_SECRET=<any string that is >= 16 chars>`

**Note:** Make sure at this point that you don't have any `.env` files in the `client` or `api` folder, and only one `.env` file at the root directory!

### 3. HTTPS Configuration
To ensure this is production ready. You will need the certificate and private key to enable HTTPS. Typically you'd want to generate these files with [certbot](https://certbot.eff.org/), see [here](ssl.md) on how to do this, but if you want to just test the app locally, you will need to run
```bash
openssl req -x509 -nodes -newkey rsa:4096 -keyout solidguard.key -out solidguard.crt
```
Make sure these files are saved in the `proxy/certs` folder!

### 4. Deploying via docker-compose
All you need to do to deploy the web application is with the following command:
```bash
docker-compose up --build
```
#### 4.1 metabase

You will need to set `METABASE_SECRET`, which is recommended to be the output of the following command:
```
openssl rand -base64 32
```

Once you are done that, you just need to access https://localhost/metabase/ and set up your account first before exposing it to the internet. When launching it for the first time, it is normal for it to take a long time to start.

**Note:** It is normal if it takes a long time for Metabase to set up, and it may not seem that the /metabase/ webpage is not working. You may need to restart and monitor the logs to make sure it works.

#### 4.2 portainer-ce

Portainer Community Edition will be used to manage all containers used. Before you expose this application to the internet, you must first configure the admin user in https://localhost/portainer/. 

**Note:** if you're running this entire applicaton locally, you will also see other images and volumes from other Docker projects you've used on this computer. This is normal since the app is looking through `/var/run/docker.sock` to retrieve information of your containers in Docker. This won't be the case when this application is hosted in its own virtual machine. Since this project will be hosted on one virtual machine, this is okay, but if we were to scale out the application so that all the containers can't be stored in one virtual machine, we'll need to use another service or look for SaaS for logging (i.e. Sentry, Kibana, Grafana).
