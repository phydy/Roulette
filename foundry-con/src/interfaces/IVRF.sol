// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IVRF {
    function requestRandomWords() external returns (uint256 requestId);

    function addAddress(address con_) external;
}
