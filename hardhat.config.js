/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

module.exports = {
  solidity: "0.8.27",
  defaultNetwork: "sepolia",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
  },
  networks: {
    localhost:{
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${process.env.METAMASK_PRIVATE_KEY}`]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${process.env.METAMASK_PRIVATE_KEY}`]
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts"
  }
};