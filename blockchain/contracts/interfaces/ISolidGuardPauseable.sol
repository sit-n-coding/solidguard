// SPDX-License-Identifier: MPL-2.0
// Name: SolidGuardManager
// GitHub: https://github.com/SolidGuard
// Version: prototype-v1.0

pragma solidity ^0.8.0;

interface ISolidGuardPauseable {
    function isSGPaused() external view returns (bool);
    function setSGPaused(bool _sgPaused) external;
}