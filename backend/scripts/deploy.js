// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

//u toolboxu se dodoje ethers objekt na hre
require("@nomicfoundation/hardhat-toolbox");

const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [owner, randomPerson] = await ethers.getSigners();
  const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
  const helloWorldContract = await helloWorldFactory.deploy(
    "Poruka za construktor"
  );
  await helloWorldContract.deployed();

  console.log("Contract deployed to:", helloWorldContract.address);
  console.log("Contract deployed by:", owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});