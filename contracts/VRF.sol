// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import {IRoulet} from "./interfaces/IRoulette.sol";

contract VRFv2Consumer is VRFConsumerBaseV2, ConfirmedOwner {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        address requestor; // whether a requestId exists
        uint8 finalNumber;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256 public lastRequestId;

    bytes32 public keyHash;

    uint32 public callbackGasLimit = 2500000;

    // The default is 3, but you can set this higher.
    uint16 private constant requestConfirmations = 3;

    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 private constant numWords = 2;

    constructor(
        uint64 subscriptionId,
        bytes32 keyHash_,
        address vrfAddress,
        address owner_
    ) VRFConsumerBaseV2(vrfAddress) ConfirmedOwner(owner_) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfAddress);
        s_subscriptionId = subscriptionId;
        keyHash = keyHash_;
        //transferOwnership(owner_);
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            finalNumber: 0,
            requestor: msg.sender,
            fulfilled: false
        });
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(
            s_requests[_requestId].requestor != address(0),
            "request not found"
        );
        s_requests[_requestId].fulfilled = true;
        uint256 number = _randomWords[0] + _randomWords[1];
        uint256 _num = number % 37;
        uint8 _finalNumber = uint8(_num);
        s_requests[_requestId].finalNumber = _finalNumber;

        //IRoulet(s_requests[_requestId].requestor).setNumber(finalNumber);

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function addcallbackGas(uint32 newAmount) external {
        callbackGasLimit = newAmount;
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint8 finalNumber) {
        require(
            s_requests[_requestId].requestor != address(0),
            "request not found"
        );
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.finalNumber);
    }
}
