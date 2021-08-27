import Web3 from "web3";
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import Voting from "./contracts/Voting.json";
import CONFIG from './config';

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const providerConfig = {
    rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
    ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
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
