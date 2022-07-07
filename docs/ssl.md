<div align="center">
  <p align="center">
    <img src="./img/solidguard-v1.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>SSL Certificate Generation</h1>
</div>

**Note:** This will be updated once we have a more elegant and automated solution of deploying.

1. Install docker on your desired Virtual Machine
2. Setup a static IP address on your virtual machine if you haven't done so already.
3. In your DNS provider, create a record, such as:
   * Host name:
   * Type A
   * TTL: 3600
   * Data: The static IP address.
4. Go into the `/certbot` folder and run `generate-certs.sh` with the following environment variables:
   * `DOMAIN_EMAIL` email to be notified on when to renew certificates
   * `DOMAIN` the domain you are trying to register.
    You will also need to change in the shell script, `solidguard.org` to the `DOMAIN` you are using.
5. You should see some new certificates in the `/proxy/certs/` folder! Run the entire application! Go [here](./deploy.md) for instructions on how to deploy.
