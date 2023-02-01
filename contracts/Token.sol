// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint supply) ERC20("Token", "tkn") {
        _mint(msg.sender, supply);
    }
}
