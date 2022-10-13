const { ethers } = require("hardhat");

async function main() {
  const implementationFactory = await ethers.getContractFactory(
    "EventImplementation"
  );

  const implementationContract = await implementationFactory.deploy();
  await implementationContract.deployed();

  console.log("Contract deployed to address:", implementationContract.address);

  const eventFactory = await ethers.getContractFactory("EventFactory");
  const eventFactoryContract = await eventFactory.deploy(
    implementationContract.address
  );
  await implementationContract.deployed();
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
