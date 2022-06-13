<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>Contribution Notes</h1>
</div>

**Version:** `v1.0.2`

## Local Deployment
For more information on how to deploy these services without Docker, see:
* [blockchain](./blockchain.md)
* [api](./api.md)
* [client](./client.md)

These methods of deploying should not be used in production!

## Known Issues

### Security
* Passwords should be salted + hashed.

### Scalability
Currently our logging system relies on portainer-ce which reads files of the currently hosted virtual machine. We will need to look for alternatives if we ever want to scale to a larger audience, as we will then need to rely on many virtual machines to support our server.
