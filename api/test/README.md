<div align="center">
  <p align="center">
    <img src="../docs/img/solidguard-prototype-v1-2.png" width="200" alt="SolidGuard Logo"/>
  </p>
<h1>SolidGuard Tests</h1>
</div>

## Running in Docker
```bash
docker-compose up --build \
  --abort-on-container-exit \
  --exit-code-from api
```
## Running locally
```bash
npm test
```
