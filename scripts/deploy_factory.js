// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();
const {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

async function main() {

  const VRF_ADDRESS = process.env.VRF;
  const DIST = process.env.DIST;
  const TOKEN = process.env.TOKEN;

  const Factory = await hre.ethers.getContractFactory("PitFactory");

  const factory = await Factory.deploy(TOKEN, VRF_ADDRESS, DIST,);

  await factory.deployed();

  const Token = await hre.ethers.getContractFactory("ERC20");

  const token = Token.attach(TOKEN);

  console.log("approving...")
  await token.approve(factory.address, ethers.utils.parseEther("10000"));

  
  //await factory.initPit(ethers.utils.parseEther("10000"));

  const signer = await ethers.getSigner();

  await factory.connect(signer).createTable(1, ethers.utils.parseEther("9000"));



  //const Roulette = await hre.ethers.getContractFactory("Roulete");
  //const roulete = await Roulette.deploy(1);
////VRF_ADDRESS, DIST, TOKEN, ethers.utils.formatEther("100000000000000000000"));
  //await roulete.deployed();

  console.log(
    `deployed to ${factory.address}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
