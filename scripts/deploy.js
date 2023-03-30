
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

  const Token = await hre.ethers.getContractFactory("ERC20");

  const token = Token.attach(TOKEN);

  const waitBlockConfirmations = developmentChains.includes(network.name)
  ? 1
  : VERIFICATION_BLOCK_CONFIRMATIONS

  console.log("deploying table");

  const Roulette = await hre.ethers.getContractFactory("Roulette");
  const roulete = await Roulette.deploy(TOKEN);
//VRF_ADDRESS, DIST, TOKEN, ethers.utils.formatEther("100000000000000000000"));
  await roulete.deployed();

  await roulete.deployTransaction.wait(waitBlockConfirmations);
  console.log(
    `deployed to ${roulete.address}`
  );
  //run("verify:verify", {
  //    address: roulete.address,
  //    constructorArguments: [TOKEN],
  //});
//
  const signer = await ethers.getSigner();

  console.log("approving...")
  await token.connect(signer).approve(roulete.address, ethers.utils.parseEther("100000"));


  const allowance = await token.allowance(signer.address, roulete.address);

  await allowance;

  //setTimeout(console.log("waiting for allowance"), 10000);
  console.log(`allowance: ${allowance}`);


  
  const subscriptionId = 636;
  const vrfCoordinatorAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
  const KEY_HASH = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";

  console.log("deployin vrf");

  const randomNumberConsumerV2Factory = await ethers.getContractFactory("VRFv2Consumer")
  const randomNumberConsumerV2 = await randomNumberConsumerV2Factory.deploy(
      subscriptionId,
      KEY_HASH,
      vrfCoordinatorAddress,
      roulete.address
  )
  await randomNumberConsumerV2.deployed();


  await randomNumberConsumerV2.deployTransaction.wait(waitBlockConfirmations)

  console.log(
      `Random Number Consumer deployed to ${randomNumberConsumerV2.address} on ${network.name}`
  )

  //run("verify:verify", {
  //    address: randomNumberConsumerV2.address,
  //    constructorArguments: [subscriptionId, KEY_HASH, vrfCoordinatorAddress, roulete.address],
  //});


  console.log("deploying dist")
  const Dist = await hre.ethers.getContractFactory("WinningDistributor");
  const dist = await Dist.deploy(TOKEN, roulete.address);

  await dist.deployed();
  await dist.deployTransaction.wait(waitBlockConfirmations);
//run("verify:verify", {
//    address: dist.address,
//    constructorArguments: [TOKEN, roulete.address],
//});
//
  console.log(
    `deployed to ${dist.address}`
  );


  await roulete.initTable(randomNumberConsumerV2.address, dist.address, ethers.utils.parseEther("100000"));



  //0xb037CDaD32ae19A0e48651bB4FCcbA2B435Ac589
  //0x6ea9bC67427b247F6D4E15AabEaAa79BE65Db548
  //0x1c62c5960d4A468e19516B9D56a5F22f9c3d3468
//


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
