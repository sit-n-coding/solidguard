<div align="center">
  <p align="center">
    <img src="./docs/img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>SolidGuard</h1>
</div>

**Version**: `v1.0`

SolidGuard is a Blockchain Security tool catered towards organizations who manages decentralized applications on the Ethereum blockchain. It is an attack database for documenting all major hacks that happened in the blockchain, and is also used to notify or pause decentralized applications that contain vulnerabilities published in the database.

This repository contains everything needed to run the server (minus the prerequisites)!

## Full Deployment

### 0. Prerequisites
You will need the following:
* Docker: Installed on your computer.
* Etherscan: Third party API keys.
* Infura/Alchemy: Ethereum Provider.

### 1. Deploying Smart Contracts.
First, you will need to follow the instructions used to deploy [the SolidGuardManager](./docs/blockchain.md). Once you are done, you should have the address to the proxy of the SolidGuardManager, which should be used in step 2. Make sure when you're doing this, you are inside the `blockchain` directory!

### 2. Environment variables for the Web Application
Next, you will need to populate the `.env` file in the root folder of the solidguard repository. This is identical to the environment variables in [the api](./docs/api.md#environment-variables), but with `CORS=false`, and `SECURE=true` if HTTPS is enabled on the proxy.

**Note:** Make sure you don't have any `.env` files in the `client` or `api` folder, and only one `.env` file at the root directory!

### 3. Deploying the Web Application
All you need to do to deploy the web application is with the following command:
```bash
docker-compose up --build
```

## Development
To learn more on how to contribute to this repository, see [`dev.md`](./docs/dev.md).

## Credits
* **Lead Software Engineer:** Jan Garong.
* **Lead Designer:** Angela Shen.
* **Graphic Designers:** Amy Li, Jackie.
* **Frontend Engineers:** Vivek Kandathil, Peter Pham.
* **Backend Engineers:** Meixuan (Mexi) Lu, Ruo Ning (Nancy) Qiu.
* **DevOps Engineers:** Si (Leo) Wang, Stephen Guo.
