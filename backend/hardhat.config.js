// ethers i još neke zgodne stvari
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { API_URL, PRIVATE_KEY } = process.env;
/*
The Config API will be available in the global environment, with functions for defining tasks. 
You can also import the API with require("hardhat/config") if you prefer to keep things explicit, 
and take advantage of your editor's autocomplete.
*/
const { task } = require("hardhat/config");

// radilo bi i bez ovoga jer se injecta hre u runtime ali eksplicitno deklariram jer mi smeta error od lintera
const { ethers } = require("hardhat");

// htio sam kreirati task da vidim kako funkcionira
task("accounts", "List of local test accounts", async () => {
  const accounts = await ethers.getSigners();
  // console.log(accounts[0]);
  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
