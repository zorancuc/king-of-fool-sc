import * as dotenv from 'dotenv'
dotenv.config()

import { HardhatUserConfig } from 'hardhat/types'
import { task } from 'hardhat/config'

// Plugins

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-abi-exporter'
import 'hardhat-gas-reporter'
import 'hardhat-contract-sizer'
import '@tenderly/hardhat-tenderly'
import '@openzeppelin/hardhat-upgrades'
import '@typechain/hardhat'

// Networks

const secret: string = process.env.PRIVATE_KEY as string;
const etherscanKey: string = process.env.ETHERSCAN_API_KEY as string;

task('accounts', 'Prints the list of accounts', async (taskArgs, bre) => {
  const accounts = await bre.ethers.getSigners()
  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

// Config

const config: HardhatUserConfig = {
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './build/contracts',
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
      loggingEnabled: false,
      gas: 12000000,
      gasPrice: 'auto',
      blockGasLimit: 12000000,
      accounts: {
        mnemonic: 'myth like bonus scare over problem client lizard pioneer submit female collect',
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [secret],
    },
    ganache: {
      chainId: 1337,
      url: 'http://localhost:8545',
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    showTimeSpent: true,
    currency: 'USD',
    outputFile: 'reports/gas-report.log',
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5',
  },
  abiExporter: {
    path: './build/abis',
    clear: false,
    flat: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: true,
  },
}

export default config
