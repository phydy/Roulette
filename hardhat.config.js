require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()

const COMPILER_SETTINGS = {
    optimizer: {
        enabled: true,
        runs: 200,
    },
    metadata: {
        bytecodeHash: "none",
    },
}

const POLYGON_MAINNET_RPC_URL =
    process.env.POLYGON_MAINNET_RPC_URL
const MUMBAI_RPC_URL =
    process.env.MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
// Your API key for Etherscan, obtain one at https://etherscan.io/
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
const REPORT_GAS = process.env.REPORT_GAS || false
const FORKING_BLOCK_NUMBER = parseInt(process.env.FORKING_BLOCK_NUMBER) || 0
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity:{
    compilers: [
      {
        version: "0.8.17",
        COMPILER_SETTINGS
      }
    ] 
  },
  networks: {
    hardhat: {
        hardfork: "merge",
        // If you want to do some forking set `enabled` to true
        forking: {
            url: POLYGON_MAINNET_RPC_URL,
            blockNumber: FORKING_BLOCK_NUMBER,
            enabled: false,
        },
        chainId: 31337,
    },
    localhost: {
        chainId: 31337,
    },
    polygon: {
        url: POLYGON_MAINNET_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        chainId: 137,
    },
    mumbai: {
        url: MUMBAI_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        chainId: 80001,
    },
},
defaultNetwork: "hardhat",
etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
        // npx hardhat verify --list-networks
        polygon: POLYGONSCAN_API_KEY,
        polygonMumbai: POLYGONSCAN_API_KEY,
    },
},
gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
},
paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
},
mocha: {
    timeout: 300000, // 300 seconds max for running tests
}
};
