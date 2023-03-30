// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IDistibutor {
    function reduceShare(
        address subscriber,
        uint256 units_,
        uint32 indexID
    ) external;

    function addShare(
        address subscriber,
        uint256 units_,
        uint32 indexID
    ) external;

    function distribute(uint32 indexID, uint256 spreaderTokenBalance) external;

    function createIndex(uint32 indexID) external;

    function deleteShares(address subscriber, uint32 indexID) external;

    function addAddress(address con_) external;
}
