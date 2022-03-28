import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-etherscan';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {},
    ...(process.env.PROVIDER_URL ? {providerNetwork: {
      url: process.env.PROVIDER_URL,
      ...(process.env.DEPLOY_PRIVATE_KEY ? { accounts: [process.env.DEPLOY_PRIVATE_KEY]} : {}),
    }} : {}),
  }
};

export default config;