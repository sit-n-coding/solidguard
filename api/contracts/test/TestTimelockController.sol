pragma solidity ^0.8.0;

import '../src/SolidGuardPauseable.sol';
import './openzeppelin-24a0bc/security/TimelockController.sol';

contract TestTimelockController is TimelockController, SolidGuardPauseable {

    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors) 
    TimelockController(minDelay, proposers, executors) {}

    function isOperationReady(bytes32 id) public view override returns (bool ready) {
        return super.isOperationReady(id) && !isSGPaused();
    }
}