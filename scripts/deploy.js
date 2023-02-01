// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(1000);
  await token.deployed();
  await deplomentInfo(token, "tokenDeployment");
  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy(token.address, 50);
  await dex.deployed();
  await deplomentInfo(dex, "dexDeployment");
}

async function deplomentInfo(contract, filename) {
  const data = {
    contract: {
      address: contract.address,
      signer: contract.signer,
      abi: contract.interface.format(),
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(`${filename}.json`, content, { encoding: "utf-8" });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
