// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SolidGuardPauseableInit.sol";

contract ZeroApp is SolidGuardPauseableInit {

    modifier onlyUnpaused() {
        require(!isSGPaused(), "ZeroApp: Paused by SolidGuard");
        _;
    }

    constructor(address _solidGuardManager) 
    SolidGuardPauseableInit(_solidGuardManager) {
    }

    function zero() external view onlyUnpaused returns (uint){
        return 0;
    }
}