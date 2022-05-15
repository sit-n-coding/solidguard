<div align="center">
  <p align="center">
    <img src="docs/img/solidguard-v1.png" width="200" alt="SolidGuard Logo" />
  </p>
</div>

# v1.0.1

**Date:** May 15, 2022

**Security:**
* Add SSL to the reverse proxy. SolidGuard should now be safe to deploy for production!

# v1.0.0

**Date:** May 10, 2022

**Features:**
* Add new homepage + about us.
* Add an exploits dashboard.

**Bug Fixes:**
* Add backend and frontend integration to all features implemented in Prototype v1.2
* Fix docker deployment.

**Security:**
* Replace JWT authentication with Session/Cookie authentication.
* Replace email with username for authentication.
* Add NGINX Proxy. No longer need to access the API and client on separate hosts!
* Update SolidGuardManager smart contract to be upgradeable.
* Disabled CORS.
* Add rate limiting on requests.

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