// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract SolidGuardPauseableInit {

    bool public sgPaused;
    address immutable public solidGuardManager;
    event SGPaused(bool _sgPaused);

    constructor(address _solidGuardManager) {
        solidGuardManager = _solidGuardManager;
    }

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