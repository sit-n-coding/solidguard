<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>Contribution Notes</h1>
</div>

**Version:** `v1.0.1`

## Local Deployment
For more information on how to deploy these services without Docker, see:
* [blockchain](./blockchain.md)
* [api](./api.md)
* [client](./client.md)

These methods of deploying should not be used in production!

## Known Issues
While the functionality of `v1.0` is done in the `api` and `blockchain`, some of the following features have not been integrated in the `client` side yet due to time constraints. Since they only affect the `client`, they can be tested via the Swagger docs:
* Passing in multiple contract names for creating an exploit.
* Pagination in user subscriptions and attack library.
* Missing search functionality in attack library.
