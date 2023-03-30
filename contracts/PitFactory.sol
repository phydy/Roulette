//SPDX-License-Identifier: MI
pragma solidity ^0.8.13;

//import {Roulette} from "./Roulette.sol";
//
//interface IVRF {
//    function addAddress(address _con) external;
//}
//
//interface IDistibutor {
//    function addAddress(address _con) external;
//}
//
//interface IERC20 {
//    function transfer(address to_, uint256 amount_) external returns (bool);
//
//    function transferFrom(
//        address from_,
//        address to_,
//        uint256 amount_
//    ) external returns (bool);
//
//    function approve(address spender, uint256 amount_) external;
//}
//
//error Transfer__Failed();
//
//contract PitFactory {
//    uint256 public pitCount;
//
//    struct Pit {
//        address owner;
//        uint256 floatBalance;
//        address[] roulettes;
//    }
//
//    mapping(uint256 => Pit) public idToPit;
//
//    address public tokenPlayed;
//
//    address private vrf;
//
//    address private dist;
//
//    event PitAdded(uint256 indexed pitId, address indexed _creator);
//
//    event TableAdded(
//        uint256 indexed pitId_,
//        uint256 indexed tableId_,
//        address indexed con_
//    );
//
//    constructor(address token_, address vrf_, address dist_) {
//        pitCount = 1;
//        tokenPlayed = token_;
//        vrf = vrf_;
//        dist = dist_;
//    }
//
//    function _tokenTransfer(uint256 amount_) internal {
//        bool success = IERC20(tokenPlayed).transferFrom(
//            msg.sender,
//            address(this),
//            amount_
//        );
//
//        if (!success) {
//            revert Transfer__Failed();
//        }
//    }
//
//    function initPit(
//        uint256 startingBalance_
//    ) external returns (uint256 pitId_) {
//        _tokenTransfer(startingBalance_);
//        pitId_ = pitCount;
//
//        idToPit[pitId_] = Pit({
//            owner: msg.sender,
//            floatBalance: startingBalance_,
//            roulettes: new address[](0)
//        });
//        pitCount += 1;
//        emit PitAdded(pitId_, msg.sender);
//    }
//
//    function createTable(
//        uint256 pitId_,
//        uint256 float_
//    ) external returns (address roul) {
//        Pit memory pitInfo = idToPit[pitId_];
//
//        require(msg.sender == pitInfo.owner);
//        require(float_ < pitInfo.floatBalance);
//        uint256 tableId_ = pitInfo.roulettes.length;
//        Roulette roulette = new Roulette(tableId_);
//        bool success = IERC20(tokenPlayed).transfer(address(roulette), float_);
//        if (!success) {
//            revert Transfer__Failed();
//        }
//        roulette.initTable(vrf, dist, tokenPlayed, float_);
//        idToPit[pitId_].floatBalance -= float_;
//        idToPit[pitId_].roulettes.push(address(roulette));
//        roul = address(roulette);
//
//        emit TableAdded(pitId_, tableId_, roul);
//    }
//
//    function addAddressTodistAndvrf(uint256 pitId_, uint256 index_) external {
//        Pit memory pitInfo = idToPit[pitId_];
//
//        require(msg.sender == pitInfo.owner);
//        address toAdd = idToPit[pitId_].roulettes[index_];
//        IVRF(vrf).addAddress(toAdd);
//        IDistibutor(dist).addAddress(toAdd);
//    }
//
//    function fundPit(uint256 pitId_, uint256 amount_) external {
//        require(msg.sender == idToPit[pitId_].owner);
//        _tokenTransfer(amount_);
//        idToPit[pitId_].floatBalance += amount_;
//    }
//
//    function deFundPit(uint256 pitId_, uint256 amount_) external {
//        Pit memory pitInfo = idToPit[pitId_];
//        require(msg.sender == pitInfo.owner);
//        require(pitInfo.floatBalance >= amount_);
//        bool success = IERC20(tokenPlayed).transfer(msg.sender, amount_);
//
//        if (!success) {
//            revert Transfer__Failed();
//        }
//        idToPit[pitId_].floatBalance -= amount_;
//    }
//
//    function fundTable(
//        uint256 pitId_,
//        uint256 amount_,
//        uint256 index_
//    ) external {
//        Pit memory pitInfo = idToPit[pitId_];
//        require(msg.sender == pitInfo.owner);
//        require(pitInfo.floatBalance >= amount_);
//
//        address receiver = viewAddressAt(pitId_, index_);
//        bool success = IERC20(tokenPlayed).transfer(msg.sender, amount_);
//
//        if (!success) {
//            revert Transfer__Failed();
//        }
//        idToPit[pitId_].floatBalance -= amount_;
//        Roulette(receiver).fund(amount_);
//    }
//
//    function deFundTable(
//        uint256 pitId_,
//        uint256 amount_,
//        uint256 index_
//    ) external {
//        Pit memory pitInfo = idToPit[pitId_];
//        require(msg.sender == pitInfo.owner);
//
//        address receiver = viewAddressAt(pitId_, index_);
//
//        Roulette(receiver).deFund(amount_);
//        idToPit[pitId_].floatBalance += amount_;
//    }
//
//    function viewAddressAt(
//        uint256 pitId_,
//        uint256 index_
//    ) public view returns (address table) {
//        table = idToPit[pitId_].roulettes[index_];
//    }
//}
//
