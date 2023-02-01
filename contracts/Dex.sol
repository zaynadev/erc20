// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    IERC20 public token;
    uint price;
    address owner;

    constructor(IERC20 _token, uint _price) {
        token = _token;
        price = _price;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only for owner");
        _;
    }

    function sell() external onlyOwner {
        uint allowance = token.allowance(msg.sender, address(this));
        require(allowance > 0, "no token allowance");
        bool sent = token.transferFrom(msg.sender, address(this), allowance);
        require(sent, "failed to send");
    }

    function withdrawTokens() external onlyOwner {
        uint balance = getTokenBalance();
        token.transfer(msg.sender, balance);
    }

    function withdrawFunds() external onlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "failed to send");
    }

    function getPrice(uint tokens) public view returns (uint) {
        return tokens * price;
    }

    function buy(uint tokens) external payable {
        require(tokens <= getTokenBalance(), "not enough tokens");
        uint _price = getPrice(tokens);
        require(_price == msg.value, "invalid price");
        token.transfer(msg.sender, tokens);
    }

    function getTokenBalance() public view returns (uint) {
        return token.balanceOf(address(this));
    }
}
