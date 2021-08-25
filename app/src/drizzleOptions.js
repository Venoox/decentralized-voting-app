import Web3 from "web3";
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import Voting from "./contracts/Voting.json";

const godwokenRpcUrl = "https://godwoken-testnet-web3-rpc.ckbapp.dev";
const providerConfig = {
  rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
  ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
  web3Url: godwokenRpcUrl
};

const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);

const options = {
  web3: {
    block: false,
    customProvider: new Web3(provider),
  },
  contracts: [Voting],
};

export default options;
