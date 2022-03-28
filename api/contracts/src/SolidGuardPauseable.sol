// SPDX-License-Identifier: MIT
// Name: SolidGuardPauseable
// GitHub: https://github.com/SolidGuard
// Version: prototype-v1.0

pragma solidity ^0.8.0;

abstract contract SolidGuardPauseable {

    bool public sgPaused = false;
    address constant solidGuardManager = 0x0000000000000000000000000000000000000000;
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