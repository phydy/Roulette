// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IRoulet {
    function setNumber(uint8 number_) external;

    function initTable(
        address vrfCon_,
        address _dist,
        address token_,
        uint256 float_
    ) external;

    function fund(uint256 amount_) external;

    function deFund(uint256 amount_) external;
}
