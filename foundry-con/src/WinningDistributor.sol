// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ISuperfluid, ISuperToken} from "@superfluid/apps/SuperAppBase.sol";
import {IInstantDistributionAgreementV1} from "@superfluid/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {SuperTokenV1Library} from "@superfluid/apps/SuperTokenV1Library.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WinningDistributor is Ownable {
    /// @notice Super token to be distributed.
    ISuperToken public spreaderToken;

    /// @notice SuperToken Library
    using SuperTokenV1Library for ISuperToken;

    mapping(address => bool) private canDoStuff;

    modifier onlyAllowed() {
        require(canDoStuff[msg.sender]);
        _;
    }

    constructor(address _spreaderToken) {
        spreaderToken = ISuperToken(_spreaderToken);

        // Creates the IDA Index through which tokens will be distributed
    }

    function createIndex(uint32 indexID) external onlyAllowed {
        spreaderToken.createIndex(indexID);
    }

    function addAddress(address con_) external onlyOwner {
        canDoStuff[con_] = true;
    }

    // ---------------------------------------------------------------------------------------------
    // IDA OPERATIONS

    /// @notice Takes the entire balance of the designated spreaderToken in the contract and distributes it out to unit holders w/ IDA
    function distribute(
        uint32 indexID,
        uint256 spreaderTokenBalance
    ) external onlyAllowed {
        //uint256 spreaderTokenBalance = spreaderToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = spreaderToken
            .calculateDistribution(
                address(this),
                indexID,
                spreaderTokenBalance
            );

        spreaderToken.distribute(indexID, actualDistributionAmount);
    }

    /// @notice lets an account gain a single distribution unit
    /// @param subscriber subscriber address whose units are to be incremented
    function addShare(
        address subscriber,
        uint256 units_,
        uint32 indexID
    ) external onlyAllowed {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            indexID,
            subscriber
        );

        // Update to current amount + 1
        spreaderToken.updateSubscriptionUnits(
            indexID,
            subscriber,
            uint128(currentUnitsHeld + units_)
        );
    }

    /// @notice lets an account lose a single distribution unit
    /// @param subscriber subscriber address whose units are to be decremented
    function reduceShare(
        address subscriber,
        uint256 units_,
        uint32 indexID
    ) external onlyAllowed {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            indexID,
            subscriber
        );
        //Update to current amount - 1 (reverts if currentUnitsHeld - 1 < 0, so basically if currentUnitsHeld = 0)
        spreaderToken.updateSubscriptionUnits(
            indexID,
            subscriber,
            uint128(currentUnitsHeld + units_)
        );
    }

    /// @notice allows an account to delete its entire subscription this contract
    /// @param subscriber subscriber address whose subscription is to be deleted
    function deleteShares(
        address subscriber,
        uint32 indexID
    ) external onlyAllowed {
        spreaderToken.deleteSubscription(address(this), indexID, subscriber);
    }
}
