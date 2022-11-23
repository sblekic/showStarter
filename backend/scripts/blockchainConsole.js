/*
umjesto da svaki put otvorim console za interakciju sa ugovorom pišem ovdje
ovdje pretpostavljam da sam vec deploy-ao impl ugovor
*/
const { ethers } = require("hardhat");

async function main() {
  const eventFactoryC = await ethers.getContractAt(
    "EventFactory",
    "0x066093f34dfbb5135AB1c597b88d3c22bDce0626"
  );
  const eventAdd = await eventFactoryC.getEventAddress(0);
  console.log(eventAdd);
  const beaconAdd = await eventFactoryC.getEventBeacon();
  console.log("beacon address", beaconAdd);
  const event = await ethers.getContractAt("EventImplementation", eventAdd);
  const response = await event.getEventName();
  console.log(response);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
