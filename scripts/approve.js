
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();
const {
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

require("dotenv").config();


async function main() {

  const TOKEN = process.env.TOKEN;

  const ROULETE = "0x2Ca18E89ef555392f03cE6d46f79EC303E0D9398";



  const Token = await hre.ethers.getContractFactory("ERC20");

  const token = Token.attach(TOKEN);

  const signer = await ethers.getSigner();

  console.log("approving...")
  //await token.connect(signer).approve(ROULETE, ethers.utils.parseEther("100000"));

  const allowance = await token.connect(signer).approve(ROULETE, ethers.utils.parseEther("1000"));

  await allowance;
 

  console.log(`allowance: ${allowance}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  