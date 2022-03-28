<div align="center">
  <p align="center">
    <img src="docs/img/solidguard-prototype-v1-2.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>solidguard-backend</h1>
</div>

**Version:** `prototype-v1.2`

SolidGuard is a Blockchain Security tool catered towards organizations who manages decentralized applications on the Ethereum blockchain. It is an attack database for documenting all major hacks that happened in the blockchain, and is also used to notify or pause decentralized applications affected by the attacks published in the database.

This repository contains all the smart contracts and scripts used to run the server for this application.

### Usage
* [server-setup.md](docs/server-setup.md) on how to set up the backend server, and how to test it locally.
* [dapp-setup.md](docs/dapp-setup.md) on how to make your application pauseable by the SolidGuardManager.
* See Swagger Docs, hosted on `/api` for API documentation.
* [Mozilla Public License v2.0](LICENSE.md) for code usage.

### Disclaimer
Since this is a prototype, there are security vulnerabilities and bugs that are present in the codebase. There is very little to no proper error handling too, so most endpoints, when inputted incorrectly, will either return 500 or cause another part of the program to break. This repository should be used as a Proof of Concept and not for production use.

### Credits
* **UI/UX Designer:** Angela Shen.
* **Graphic Designer:** Amy Li.
* **Frontend Engineer:** Vivek Kandathil, Peter Pham.
* **Backend Engineer:** Jan Garong, Meixuan (Mexi) Lu, Ruo Ning (Nancy) Qiu.
* **DevOps Engineer:** Si (Leo) Wang.

### Sources
* [nestjs-prisma-starter](https://github.com/notiz-dev/nestjs-prisma-starter) by [notiz-dev](https://github.com/notiz-dev).
