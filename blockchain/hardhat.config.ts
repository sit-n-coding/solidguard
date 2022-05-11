import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';

let providerNetwork: {url: string, accounts: string[]} | null = null;
if (!!process.env.PROVIDER_URL && !!process.env.DEPLOY_PRIVATE_KEY) {
  providerNetwork = {
    url: process.env.PROVIDER_URL,
    accounts: [process.env.DEPLOY_PRIVATE_KEY]
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.3",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {},
    ...(providerNetwork ? { providerNetwork } : {}),
  }
};

export default config;