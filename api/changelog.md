<div align="center">
  <p align="center">
    <img src="docs/img/solidguard-prototype-v1-2.png" width="200" alt="SolidGuard Logo" />
  </p>
<h1>solidguard-backend</h1>
</div>

# Prototype v1.2

**Date:** Mar 25, 2022

**Features:**
* Add Docker files for deploying the backend. Now you won't need to worry about installing databases, migrating and building locally!
* Add `changelog.md`.
* Update logo.

**Optimizations:**
* Removed `await` in for loops and replaced them with `Promise.all`.

# Prototype v1.1

**Date:** Jan 30, 2022

**Bug Fixes**
* Replace GET request body parameters for exploits with query parameters.
* Add GitHub smart contract validation. Backend returns 400 if the GitHub parameters fed for creating exploits is invalid.
* Update documentation in regards to the database.

Compatible with [prototype-v1.0 of solidguard-prototype-frontend](https://github.com/SolidGuard/solidguard-prototype-frontend/releases/tag/prototype-v1.0).

# Prototype v1.0

**Date:** Jan 14, 2022

Initial release.