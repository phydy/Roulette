// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {IVRF} from "./interfaces/IVRF.sol";

import {IDistibutor} from "./interfaces/IDistibutor.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error Transfer__Failed();

contract Roulette is Ownable {
    //spin tracker
    uint256 public spinCount;

    uint256 constant MAX_SPIN_TIME = 10;

    IVRF private vrfCon;

    IDistibutor private dist;

    uint256 public immutable tableId;
    uint8[] private winningNumbers;
    uint256 public float;
    uint256 public inPlay;

    struct SpinInfo {
        bool numberRequested;
        bool hasBeenDecided;
        bool winnersAdded;
        uint8 winningNumber;
        uint256 startTime;
        uint256 totalPlayed;
        uint256 possibleWinning;
        uint256 amountWon;
    }

    IERC20 public tokenPlayed;

    uint256 public constant STRAIGHT_UP_PAY = 35;

    uint256 public constant SPLIT_PAY = 17;

    uint256 public constant STREET_PAY = 11;

    uint256 public constant COURNER_PAY = 8;

    uint256 public constant SIX_LINE_PAY = 5;

    uint256 public constant DOZONE_COLUMN = 2;

    /**
     * errors
     */

    string public constant SPIN_NOT_ENED = "1";

    mapping(uint256 => SpinInfo) public spinInfo;

    //all addresses in the current spin
    mapping(uint256 => address[]) private spinAddresses;

    //if an address is already on the spin
    mapping(uint256 => mapping(address => bool)) private isAdded;

    //amountTo be won by an address
    mapping(uint8 => mapping(uint256 => mapping(address => uint256)))
        public numberAddressAmount;

    string private constant WRONG_NUMBER = "WRONG_NUMBER";

    event SpinStarted(uint256 indexed spin_);

    event SetNumber(uint256 indexed spin_, uint8 indexed number_);

    event WinnersAdded(uint256 indexed spin_);

    event BetPlaced(
        string indexed _bet,
        address indexed player_,
        uint256 indexed amount_
    );

    event StraigtPlaced(
        string indexed _bet,
        address indexed player_,
        uint256[] indexed amount_
    );

    constructor(uint256 tableId_) {
        tableId = tableId_;
    }

    function initTable(
        address vrfCon_,
        address _dist,
        address token_,
        uint256 float_
    ) external {
        require(spinCount == 0);
        vrfCon = IVRF(vrfCon_);
        dist = IDistibutor(_dist);
        tokenPlayed = IERC20(token_);
        float = float_;
    }

    function startSpin() external returns (uint256 spin_) {
        uint256 spin = spinCount;

        if (spin == 0) {
            spinInfo[1] = SpinInfo({
                numberRequested: false,
                hasBeenDecided: false,
                winnersAdded: false,
                winningNumber: 0,
                startTime: block.timestamp,
                totalPlayed: 0,
                possibleWinning: 0,
                amountWon: 0
            });
            spinCount = 1;
        } else {
            //require(;
            (, , bool hasEnded) = _checkSpin();

            require(hasEnded, SPIN_NOT_ENED);
            spinInfo[spin + 1] = SpinInfo({
                numberRequested: false,
                hasBeenDecided: false,
                winnersAdded: false,
                winningNumber: 0,
                startTime: block.timestamp,
                totalPlayed: 0,
                possibleWinning: 0,
                amountWon: 0
            });
            spinCount += 1;
        }
        spin_ = spinCount;
        emit SpinStarted(spin + 1);
    }

    function setNumber(uint8 number_) external {
        (bool requested, bool decided, bool hasEnded) = _checkSpin();

        require(requested && decided && !hasEnded);

        uint256 _spinCount = spinCount;

        SpinInfo storage spin = spinInfo[_spinCount];
        spin.hasBeenDecided = true;
        spin.winningNumber = number_;
        emit SetNumber(_spinCount, number_);
    }

    function getWinningNumber() external {
        uint256 spin = spinCount;
        SpinInfo memory _spinInfo = spinInfo[spin];
        require(_spinInfo.startTime + MAX_SPIN_TIME >= block.timestamp);
        vrfCon.requestRandomWords();
        spinInfo[spin].numberRequested = true;
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

    function placeStaightUps(
        uint8[] memory number,
        uint256[] memory amounts
    ) external {
        uint256 spinCount_ = spinCount;
        uint256 float_ = float;
        for (uint8 i = 0; i < number.length; ) {
            require(number[i] < 37, WRONG_NUMBER);
            uint256 possibleWin = ((amounts[i] * STRAIGHT_UP_PAY) + amounts[i]);
            require(float_ > possibleWin, "reduce amount");
            _tokenTransfer(amounts[i]);
            numberAddressAmount[number[i]][spinCount_][
                msg.sender
            ] += possibleWin;
            _addAmounts(amounts[i], possibleWin);
            inPlay += (amounts[i] + possibleWin);
            float -= possibleWin;
            unchecked {
                i++;
            }
        }

        emit StraigtPlaced("straight", msg.sender, amounts);
    }

    function placeConer(uint8[4] memory number, uint256 amount) external {
        uint256 possibleWin = ((amount * COURNER_PAY) + amount);
        uint256 spinCount_ = spinCount;
        require(float > possibleWin, "reduce amount");
        require(
            (number[3] - number[0] == 4 && number[2] - number[1] == 2) ||
                (number[0] == 0 &&
                    number[1] == 1 &&
                    number[2] == 2 &&
                    number[3] == 3)
        );
        _tokenTransfer(amount);
        for (uint8 i = 0; i < number.length; ) {
            require(number[i] < 37, WRONG_NUMBER);
            numberAddressAmount[number[i]][spinCount_][
                msg.sender
            ] += possibleWin;

            unchecked {
                i++;
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;

        emit BetPlaced("corner", msg.sender, amount);
    }

    function placeStreet(uint8[3] memory number, uint256 amount) external {
        uint256 possibleWin = ((amount * STREET_PAY) + amount);
        uint256 spinCount_ = spinCount;
        require(float > possibleWin, "reduce amount");
        require(
            (number[2] - number[0] == 2 && number[2] - number[1] == 1) ||
                (number[0] == 0 &&
                    ((number[2] == 3 && number[1] == 2) ||
                        (number[2] == 2 && number[1] == 1)))
        );
        _tokenTransfer(amount);
        for (uint8 i = 0; i < number.length; ) {
            require(number[i] < 37, WRONG_NUMBER);
            numberAddressAmount[number[i]][spinCount_][
                msg.sender
            ] += possibleWin;
            unchecked {
                i++;
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("street", msg.sender, amount);
    }

    function placeSplit(uint8[2] memory number, uint256 amount) external {
        uint256 possibleWin = ((amount * SPLIT_PAY) + amount);
        uint256 spinCount_ = spinCount;
        require(float > possibleWin, "reduce amount");
        require(
            number[1] - number[0] == 3 ||
                number[1] - number[0] == 1 ||
                (number[0] == 0 &&
                    (number[1] == 1 || number[1] == 2 || number[1] == 3))
        );
        _tokenTransfer(amount);
        for (uint8 i = 0; i < number.length; ) {
            require(number[i] < 37, WRONG_NUMBER);
            numberAddressAmount[number[i]][spinCount_][
                msg.sender
            ] += possibleWin;
            unchecked {
                i++;
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("split", msg.sender, amount);
    }

    function placeSixLine(uint8[6] memory number, uint256 amount) external {
        uint256 possibleWin = ((amount * SIX_LINE_PAY) + amount);
        uint256 spinCount_ = spinCount;
        require(float > possibleWin, "reduce amount");
        require(
            number[5] - number[0] == 5 &&
                number[3] - number[2] == 1 &&
                number[4] - number[1] == 3
        );
        _tokenTransfer(amount);
        for (uint8 i = 0; i < number.length; ) {
            require(number[i] < 37, WRONG_NUMBER);
            numberAddressAmount[number[i]][spinCount_][
                msg.sender
            ] += possibleWin;

            unchecked {
                i++;
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("six", msg.sender, amount);
    }

    function placeNumberSide(uint8 side_, uint256 amount) external {
        uint256 possibleWin = (amount * 2);
        uint256 spinCount_ = spinCount;
        require(float > possibleWin, "reduce amount");
        _tokenTransfer(amount);
        if (side_ == 1) {
            for (uint8 i = 1; i < 19; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else {
            for (uint8 i = 19; i < 37; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("H_L", msg.sender, amount);
    }

    function placeColor(uint8 color_, uint256 amount) external {
        uint256 possibleWin = (amount * 2);
        uint256 spinCount_ = spinCount;
        _tokenTransfer(amount);
        if (color_ == 1) {
            for (uint8 i = 1; i < 19; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else {
            for (uint8 i = 19; i < 37; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("color", msg.sender, amount);
    }

    function placeDozone(uint8 dozone_, uint256 amount) external {
        uint256 possibleWin = ((amount * DOZONE_COLUMN) + amount);
        uint256 spinCount_ = spinCount;

        require(float > possibleWin, "reduce amount");
        _tokenTransfer(amount);
        if (dozone_ == 1) {
            for (uint8 i = 1; i < 12; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else if (dozone_ == 2) {
            for (uint8 i = 13; i < 21; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else {
            for (uint8 i = 25; i < 37; ) {
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("dozen", msg.sender, amount);
    }

    function _addAmounts(uint256 played_, uint256 possibleWin_) internal {
        uint256 count = spinCount;
        spinInfo[count].totalPlayed = played_;
        spinInfo[count].possibleWinning = possibleWin_;
    }

    function placeColumn(uint8 column_, uint256 amount) external {
        uint256 spinCount_ = spinCount;

        uint256 possibleWin = ((amount * DOZONE_COLUMN) + amount);
        _tokenTransfer(amount);
        if (column_ == 1) {
            for (uint8 i = 1; i < 37; ) {
                if (i != 1) {
                    require(i % 3 == 1);
                }
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else if (column_ == 2) {
            for (uint8 i = 3; i < 21; ) {
                if (i != 2) {
                    require(i % 3 == 2);
                }
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        } else {
            for (uint8 i = 3; i < 37; ) {
                require(i % 3 == 0);
                numberAddressAmount[i][spinCount_][msg.sender] += possibleWin;

                unchecked {
                    i++;
                }
            }
        }
        _addAmounts(amount, possibleWin);
        inPlay += (amount + possibleWin);
        float -= possibleWin;
        emit BetPlaced("column", msg.sender, amount);
    }

    function addWinnerstodistibution() external {
        uint256 count = spinCount;
        dist.createIndex(uint32(count));
        uint256 amountWon;
        address[] memory players = spinAddresses[count];
        uint8 winningNumber = spinInfo[count].winningNumber;

        for (uint256 i = 0; i < players.length; ) {
            address player = players[i];
            bool added = isAdded[count][player];
            if (added) {
                uint256 amount_ = numberAddressAmount[winningNumber][count][
                    player
                ];
                dist.addShare(player, uint128(amount_), uint32(count));
                amountWon += amount_;
            }
            unchecked {
                i++;
            }
        }
        float += (inPlay - amountWon);
        inPlay += 0;
        spinInfo[count].winnersAdded = true;
        spinInfo[count].amountWon = amountWon;

        bool success = tokenPlayed.transfer(address(dist), amountWon);

        if (!success) {
            revert Transfer__Failed();
        }

        emit WinnersAdded(count);
    }

    function fund(uint256 amount_) external onlyOwner {
        float += amount_;
    }

    function deFund(uint256 amount_) external onlyOwner {
        require(amount_ >= float);
        bool success = tokenPlayed.transfer(owner(), amount_);

        if (!success) {
            revert Transfer__Failed();
        }
        float -= amount_;
    }

    function _checkSpin()
        internal
        view
        returns (bool requested, bool decided, bool hasEnded)
    {
        SpinInfo memory _spinInfo = spinInfo[spinCount];

        requested = _spinInfo.numberRequested;
        decided = _spinInfo.hasBeenDecided;
        hasEnded = _spinInfo.winnersAdded;
    }
}
