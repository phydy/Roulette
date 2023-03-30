// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.0;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {PureSuperToken} from "@custom/PureSuperToken.sol";

import {ISuperToken} from "@superfluid/interfaces/superfluid/ISuperToken.sol";

/// @title Burnable and Mintable Pure Super Token
/// @author jtriley.eth
/// @notice This does not perform checks when burning
contract TestToken is PureSuperToken {

}
