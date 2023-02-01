const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  let token, owner, addr1, addr2;
  let supply = 100;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = ethers.getContractFactory("Token");
    token = await (await Token).deploy(supply);
  });

  describe("Deployment", () => {
    it("should assign suply to owner", async () => {
      const ownerSupply = await token.balanceOf(owner.address);
      expect(ownerSupply).to.equal(supply);
    });
  });

  describe("Transactions", () => {
    it("should transfer token between accounts", async () => {
      await expect(token.transfer(addr1.address, 10)).to.changeTokenBalances(
        token,
        [owner, addr1],
        [-10, 10]
      );
    });
    it("should not transfer token, not enough balance", async () => {
      await expect(token.connect(addr1).transfer(addr1.address, 10)).to.be.reverted;
    });
  });
});
