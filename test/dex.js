const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dex", () => {
  let token, dex, owner, addr1, addr2;
  let supply = 100;
  let price = 100;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = ethers.getContractFactory("Token");
    token = await (await Token).deploy(supply);
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.deploy(token.address, price);
  });

  describe("Sell", () => {
    it("should fail if contract not approved", async () => {
      await expect(dex.sell()).to.revertedWith("no token allowance");
    });
    it("should approve transfer", async () => {
      await token.approve(dex.address, 50);
    });
    it("should not allow transfer for non owner", async () => {
      await expect(dex.connect(addr1).sell()).to.revertedWith("only for owner");
    });
    it("should allow transfer for owner", async () => {
      await expect(dex.sell()).to.changeTokenBalances(
        token,
        [owner.address, dex.address],
        [-50, 50]
      );
    });
  });
  describe("Getters", () => {
    it("should return correct balance", async () => {
      expect(await dex.getTokenBalance()).to.equal(50);
    });
    it("should return correct price", async () => {
      await expect(await dex.getPrice(10)).to.equal(price * 10);
    });
  });
  describe("Buy", () => {
    it("user canot buy tokens, not enough balance", async () => {
      await expect(dex.buy(51)).to.rejectedWith("not enough tokens");
    });
    it("user canot buy tokens, price incorrect", async () => {
      await expect(dex.buy(50, { value: price })).to.be.rejectedWith("invalid price");
    });
    it("user canot buy tokens, not enough balance", async () => {
      await expect(dex.connect(addr1).buy(25, { value: 25 * price })).to.changeTokenBalances(
        token,
        [addr1.address, dex.address],
        [25, -25]
      );
    });
  });
  describe("Withdraw tokens", () => {
    it("non owner cannot withdraw tokens", async () => {
      await expect(dex.connect(addr1).withdrawTokens()).to.revertedWith("only for owner");
    });
    it("owner can withdraw tokens", async () => {
      await expect(dex.withdrawTokens()).to.changeTokenBalances(
        token,
        [owner.address, dex.address],
        [25, -25]
      );
    });
  });
  describe("Withdraw funds", () => {
    it("non owner cannot withdraw funds", async () => {
      await expect(dex.connect(addr1).withdrawFunds()).to.revertedWith("only for owner");
    });
    it("owner can withdraw tokens", async () => {
      await expect(dex.withdrawFunds()).to.changeEtherBalances(
        [owner.address, dex.address],
        [25 * price, -(25 * price)]
      );
    });
  });
});
