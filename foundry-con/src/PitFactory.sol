// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {Roulette} from "./Roulette.sol";

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IRoulet} from "./interfaces/IRoulette.sol";

import {IVRF} from "./interfaces/IVRF.sol";

import {IDistibutor} from "./interfaces/IDistibutor.sol";

error Transfer__Failed();

contract PitFactory {
    uint256 public pitCount;

    struct Pit {
        address owner;
        uint256 floatBalance;
        address[] roulettes;
    }

    mapping(uint256 => Pit) public idToPit;

    IERC20 public tokenPlayed;

    IVRF private vrf;

    IDistibutor private dist;

    event PitAdded(uint256 indexed pitId, address indexed _creator);

    event TableAdded(
        uint256 indexed pitId_,
        uint256 indexed tableId_,
        address indexed con_
    );

    constructor(address token_, address vrf_, address dist_) {
        pitCount = 1;
        tokenPlayed = IERC20(token_);
        vrf = IVRF(vrf_);
        dist = IDistibutor(dist_);
    }

    function _tokenTransfer(uint256 amount_) internal {
        bool success = tokenPlayed.transferFrom(
            msg.sender,
            address(this),
            amount_
        );

        if (!success) {
            revert Transfer__Failed();
        }
    }

    function initPit(
        uint256 startingBalance_
    ) external returns (uint256 pitId_) {
        _tokenTransfer(startingBalance_);
        pitId_ = pitCount;

        idToPit[pitId_] = Pit({
            owner: msg.sender,
            floatBalance: startingBalance_,
            roulettes: new address[](0)
        });
        pitCount += 1;
        emit PitAdded(pitId_, msg.sender);
    }

    function createTable(
        uint256 pitId_,
        uint256 float_
    ) external returns (address roul) {
        Pit memory pitInfo = idToPit[pitId_];

        require(msg.sender == pitInfo.owner, "not the owner");
        require(float_ < pitInfo.floatBalance);
        uint256 tableId_ = pitInfo.roulettes.length;
        Roulette roulette = new Roulette(tableId_);
        bool success = tokenPlayed.transfer(address(roulette), float_);
        if (!success) {
            revert Transfer__Failed();
        }
        roulette.initTable(
            address(vrf),
            address(dist),
            address(tokenPlayed),
            float_
        );
        idToPit[pitId_].floatBalance -= float_;
        idToPit[pitId_].roulettes.push(address(roulette));
        vrf.addAddress(address(roulette));
        dist.addAddress(address(roulette));
        roul = address(roulette);

        emit TableAdded(pitId_, tableId_, roul);
    }

    function fundPit(uint256 pitId_, uint256 amount_) external {
        require(msg.sender == idToPit[pitId_].owner, "not the owner");
        _tokenTransfer(amount_);
        idToPit[pitId_].floatBalance += amount_;
    }

    function deFundPit(uint256 pitId_, uint256 amount_) external {
        Pit memory pitInfo = idToPit[pitId_];
        require(msg.sender == pitInfo.owner, "not the owner");
        require(pitInfo.floatBalance >= amount_, "amount");
        bool success = tokenPlayed.transfer(msg.sender, amount_);

        if (!success) {
            revert Transfer__Failed();
        }
        idToPit[pitId_].floatBalance -= amount_;
    }

    function fundTable(
        uint256 pitId_,
        uint256 amount_,
        uint256 index_
    ) external {
        Pit memory pitInfo = idToPit[pitId_];
        require(msg.sender == pitInfo.owner, "not the owner");
        require(pitInfo.floatBalance >= amount_, "amount");

        address receiver = viewAddressAt(pitId_, index_);
        bool success = tokenPlayed.transfer(msg.sender, amount_);

        if (!success) {
            revert Transfer__Failed();
        }
        idToPit[pitId_].floatBalance -= amount_;
        IRoulet(receiver).fund(amount_);
    }

    function deFundTable(
        uint256 pitId_,
        uint256 amount_,
        uint256 index_
    ) external {
        Pit memory pitInfo = idToPit[pitId_];
        require(msg.sender == pitInfo.owner, "not the owner");

        address receiver = viewAddressAt(pitId_, index_);

        IRoulet(receiver).deFund(amount_);
        idToPit[pitId_].floatBalance += amount_;
    }

    function viewAddressAt(
        uint256 pitId_,
        uint256 index_
    ) public view returns (address table) {
        table = idToPit[pitId_].roulettes[index_];
    }
}
