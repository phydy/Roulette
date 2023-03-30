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

  const factory = Factory.attach("0x093DF00a52806bb214BFF2955201A27c36CEd755");//deploy(TOKEN, VRF_ADDRESS, DIST);

  //await factory.deployed();

  console.log(
    `deployed to ${factory.address}`
  );

  const Token = await hre.ethers.getContractFactory("ERC20");

  const token = Token.attach(TOKEN);

  console.log("approving...")
  //await token.approve(factory.address, ethers.utils.parseEther("10000"));

  
  console.log("initing..")
  await factory.initPit(ethers.utils.parseEther("10000"));

  const signer = await ethers.getSigner();

  console.log("creating..")
  await factory.connect(signer).createTable(1, ethers.utils.parseEther("9000"));

  console.log('adding addresses');

  await factory.addAddressTodistAndvrf(1, 0);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
