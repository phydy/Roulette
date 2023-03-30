// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import {SuperfluidTester} from "./SuperfluidTester.sol";
import {ISuperToken} from "@superfluid/interfaces/superfluid/ISuperToken.sol";
import {TestToken} from "../src/TestToken.sol";
import {ISuperTokenFactory} from "@superfluid/interfaces/superfluid/ISuperTokenFactory.sol";
import {SuperTokenV1Library} from "@superfluid/apps/SuperTokenV1Library.sol";

import {PitFactory} from "../src/PitFactory.sol";

import {Roulette} from "../src/Roulette.sol";

import {LinkToken} from "../src/test/LinkToken.sol";

import {MockVRFCoordinatorV2} from "../src/test/VRFCordinatorMock.sol";

import {VRFConsumerV2} from "../src/test/VrfConsumer.sol";

import {WinningDistributor} from "../src/WinningDistributor.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract RouletteTest is SuperfluidTester {
    using SuperTokenV1Library for ISuperToken;

    PitFactory public pitFactory;
    Roulette public roulette;
    TestToken private token;
    ISuperTokenFactory public factory;
    LinkToken public link;

    MockVRFCoordinatorV2 public vrfCoordinator;
    VRFConsumerV2 public vrfConsumer;

    WinningDistributor public dist;
    //Cheats internal constant cheats = Cheats(HEVM_ADDRESS);

    uint64 subId;
    bytes32 keyHash;

    address sf_admin = makeAddr("superfluid_admin");
    address token_holder = makeAddr("token_holder");

    address player1 = makeAddr("player1");
    address player2 = makeAddr("player2");

    address player3 = makeAddr("player3");

    uint96 constant FUND_AMOUNT = 1 * 10 ** 18;

    address public _roul;

    constructor() SuperfluidTester(sf_admin) {}

    function setUp() public {
        vm.startPrank(token_holder);
        token = new TestToken();

        link = new LinkToken();

        factory = sf.host.getSuperTokenFactory();
        token.initialize(
            address(factory),
            "Sal Token",
            "SSTN",
            token_holder,
            4000000 ether
        );

        dist = new WinningDistributor(address(token));
        vrfCoordinator = new MockVRFCoordinatorV2();
        subId = vrfCoordinator.createSubscription();
        vrfCoordinator.fundSubscription(subId, FUND_AMOUNT);
        vrfConsumer = new VRFConsumerV2(
            subId,
            address(vrfCoordinator),
            address(link),
            keyHash
        );
        vrfCoordinator.addConsumer(subId, address(vrfConsumer));
        pitFactory = new PitFactory(
            address(token),
            address(vrfConsumer),
            address(dist)
        );

        vrfConsumer.transferOwnership(address(pitFactory));
        dist.transferOwnership(address(pitFactory));

        ISuperToken(address(token)).approve(
            address(pitFactory),
            3_500_000 ether
        );

        uint256 pitId_ = pitFactory.initPit(3_000_000 ether);
        _roul = pitFactory.createTable(pitId_, 1_000_000 ether);

        roulette = Roulette(_roul);

        ISuperToken(address(token)).transfer(player1, 1000 ether);
        ISuperToken(address(token)).transfer(player2, 1000 ether);
        ISuperToken(address(token)).transfer(player3, 1000 ether);

        vm.stopPrank();
    }

    function testPitDeployed() public {
        assertTrue(address(roulette) == _roul);
    }

    event BetPlaced(
        string indexed _bet,
        address indexed player_,
        uint256 indexed amount_
    );

    function testPlacePlay() public {
        //startSpin
        uint256 _spin = roulette.startSpin();
        assertTrue(_spin == 1);

        //place bet
        //starightup

        vm.startPrank(player1);

        //approve tokens
        IERC20(address(token)).approve(address(roulette), 50 ether);

        vm.expectEmit(true, true, true, true);

        emit BetPlaced("corner", player1, 50 ether);

        roulette.placeConer([1, 2, 4, 5], 50 ether);
    }
}
