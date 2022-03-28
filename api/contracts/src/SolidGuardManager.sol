// SPDX-License-Identifier: MPL-2.0
// Name: SolidGuardManager
// GitHub: https://github.com/SolidGuard
// Version: prototype-v1.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISolidGuardPauseable {
    function isSGPaused() external view returns (bool);
    function setSGPaused(bool _sgPaused) external;
}

contract SolidGuardManager is Ownable {
    uint constant public price = 0.01 ether;
    mapping(address => uint) public pauses;
    event Deposit(address _dApp, uint _pauses);

    function getPauses(address _dApp) external view returns (uint) {
        return pauses[_dApp];
    }

    function batchPause(address[] memory _dApps) external onlyOwner {
        for (uint i = 0; i < _dApps.length; i++){
            pauses[_dApps[i]]--;
            ISolidGuardPauseable(_dApps[i]).setSGPaused(true);
        }
    }

    function deposit(address[] memory _dApps, uint[] memory _pauses) external payable {
        // check matching input
        require(_dApps.length == _pauses.length, "SolidGuardManager: Input size mismatch.");

        // calculate the price
        uint totalPauses = 0;
        for (uint i = 0; i < _pauses.length; i++){
            totalPauses += _pauses[i];
            pauses[_dApps[i]] += _pauses[i];
            emit Deposit( _dApps[i], _pauses[i]);
        }

        // pay owner
        require(msg.value >= price * totalPauses, "SolidGuardManager: Not enough ether.");
        (bool sent, ) = payable(owner()).call{value: price * totalPauses}("");
        require(sent, "SolidGuardManager: Deposit failed.");
    }
}