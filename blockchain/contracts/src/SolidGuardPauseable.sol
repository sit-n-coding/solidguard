// SPDX-License-Identifier: MPL-2.0
// Name: SolidGuardPauseable
// GitHub: https://github.com/SolidGuard
// Version: v1.0

pragma solidity ^0.8.0;

abstract contract SolidGuardPauseable {

    bool public sgPaused = false;
    address constant solidGuardManager = 0xC53Ec029Fa3B311971257d91c96Ab60EAc65Ae0b;
    event SGPaused(bool _sgPaused);

    function isSGPaused() public view returns (bool) {
        return sgPaused;
    }

    function setSGPaused(bool _sgPaused) external {
        require(msg.sender == solidGuardManager, "SolidGuardPauseable: Must be solidGuardManager to pause contract.");
        _setSGPaused(_sgPaused);
    }

    function _setSGPaused(bool _sgPaused) internal {
        sgPaused = _sgPaused;
        emit SGPaused(_sgPaused);
    }
}