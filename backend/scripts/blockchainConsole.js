/*
umjesto da svaki put otvorim console za interakciju sa ugovorom pišem ovdje
ovdje pretpostavljam da sam vec deploy-ao impl ugovor
*/
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
  await eventFactoryContract.deployed();

  await eventFactoryContract.createEvent({
    price: 3,
    name: "exit fest",
  });


  // eventAddr mi je adresa proxy ugovora; dignem instancu proxy ugovora koristeći impl ugovor koji mi je dostupan;
  // trebao bi postojati neki video gdje tip radi slicnu stvar na remix ide

  // const event = await ethers.getContractAt("EventImplementation", eventAddr);
  // const response = await event.name();
  // console.log(response);

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
