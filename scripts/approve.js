
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

  const ROULETE = "0xDB4cF637B30fDCB1403A4282F2E694cEF8d6ca00";



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
  