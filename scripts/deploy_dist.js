const hre = require("hardhat");
require("dotenv").config();

async function main() {

  const VRF_ADDRESS = process.env.VRF;
  const TOKEN = process.env.TOKEN;


  const Dist = await hre.ethers.getContractFactory("WinningDistributor");
  const dist = await Dist.deploy(TOKEN);

  await dist.deployed();

  console.log(
    `deployed to ${dist.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});