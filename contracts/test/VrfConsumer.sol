// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import {IRoulet} from "../interfaces/IRoulette.sol";

/**
 * @title The VRFConsumerV2 contract
 * @notice A contract that gets random values from Chainlink VRF V2
 */
contract VRFConsumerV2 is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;

    // Your subscription ID.
    uint64 immutable s_subscriptionId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 immutable s_keyHash;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 immutable s_callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 immutable s_requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 public immutable s_numWords = 2;

    address s_owner;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        address requestor; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests;

    uint256 public lastRequestId;

    uint256[] public requestIds;

    event ReturnedRandomness(uint256[] randomWords);

    mapping(uint256 => address) public tableId;

    /**
     * @notice Constructor inherits VRFConsumerBaseV2
     *
     * @param subscriptionId - the subscription ID that this contract uses for funding requests
     * @param vrfCoordinator - coordinator, check https://docs.chain.link/docs/vrf-contracts/#configurations
     * @param keyHash - the gas lane to use, which specifies the maximum gas price to bump to
     */

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        address link,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_keyHash = keyHash;
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    function addRoulette(uint256 id_, address roulete_) external {
        tableId[id_] = roulete_;
    }

    /**
     * @notice Requests randomness
     * Assumes the subscription is funded sufficiently; "Words" refers to unit of data in Computer Science
     */
    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            s_requestConfirmations,
            s_callbackGasLimit,
            s_numWords
        );

        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            requestor: msg.sender,
            fulfilled: false
        });

        requestIds.push(requestId);
        lastRequestId = requestId;
    }

    /**
     * @notice Callback function used by VRF Coordinator
     *
     * @param _requestId - id of the request
     * @param randomWords - array of random results from VRF Coordinator
     */
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory randomWords
    ) internal override {
        require(
            s_requests[_requestId].requestor != address(0),
            "request not found"
        );
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = randomWords;
        uint256 number = randomWords[0] + randomWords[1];

        uint8 finalNumber = uint8(number % 37);

        IRoulet(s_requests[_requestId].requestor).setNumber(finalNumber);

        emit ReturnedRandomness(randomWords);
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
