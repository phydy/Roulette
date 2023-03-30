const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config")

require("dotenv").config()

async function main() {

    const FACTORY = "";

    const randomNumberConsumerV2Factory = await ethers.getContractFactory("VRFv2Consumer")
    const randomNumberConsumerV2 = randomNumberConsumerV2Factory.attach(procee.env.VRF);

    const Dist = await hre.ethers.getContractFactory("WinningDistributor");
    const dist = Dist.attach(process.env.DIST);

    const signer = await ethers.getSigner();
    await randomNumberConsumerV2.connect(signer).transferOwnerShip(FACTORY);

    await dist.connect(signer).transferOwnerShip(FACTORY);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  