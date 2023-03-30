const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config")

async function main() {
    //const VRFCoordinatorV2Mock
    const subscriptionId = 636;
    const vrfCoordinatorAddress = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    const KEY_HASH = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";

    //const keyHash = networkConfig[chainId]["keyHash"]

    const randomNumberConsumerV2Factory = await ethers.getContractFactory("VRFv2Consumer")
    const randomNumberConsumerV2 = await randomNumberConsumerV2Factory.deploy(
        subscriptionId,
        KEY_HASH,
        vrfCoordinatorAddress
    );

    await randomNumberConsumerV2.deployed();

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    await randomNumberConsumerV2.deployTransaction.wait(waitBlockConfirmations)

    console.log(
        `Random Number Consumer deployed to ${randomNumberConsumerV2.address} on ${network.name}`
    )

    await run("verify:verify", {
        address: randomNumberConsumerV2.address,
        constructorArguments: [subscriptionId, KEY_HASH, vrfCoordinatorAddress],
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  