<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>Setup for solidguard-client</h1>
</div>

**Version:** `v1.0.2`

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
  - [1. Environment Variables Setup](#1-environment-variables-setup)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Running the client server](#3-running-the-client-server)

## Environment Variables
* **solidguard-api** - SolidGuard API, see [here](api.md) on instructions on how to deploy locally.
  * `NEXT_PUBLIC_API_HOST` URL on where the API is hosted. Only fill this in if deploying the API and Client locally! i.e `http://localhost:3001`.

## Local Setup

### 1. Environment Variables Setup
Fill in the following environment variables in a new file called `.env`. Examples of these variables can be seen in [`.env.example`](../.env.example), and information can be seen [here](#environment-variables).

### 2. Install dependencies

```bash
yarn install
```

### 3. Running the client server

Run the frontend either by:

```bash
yarn run dev
```

Or 

```bash
yarn run build
yarn start
```

[Back to top](#table-of-contents)
