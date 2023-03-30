// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IVRF {
    function requestRandomWords() external returns (uint256 requestId);

    function addAddress(address con_) external;

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint8 finalNumber);

    function addcallbackGas(uint32 newAmount) external;
}
