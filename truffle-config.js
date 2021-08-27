const path = require("path");
const { PolyjuiceHDWalletProvider } = require('@polyjuice-provider/truffle');
const { PolyjuiceHttpProvider } = require("@polyjuice-provider/web3");
const CONFIG = require('./app/src/config');

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const providerConfig = {
    rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
    ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
    web3Url: godwokenRpcUrl
};


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    godwoken: {
      provider: function() {
        const polyjuiceHttpProvider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        return new PolyjuiceHDWalletProvider(
        [
          { 
            mnemonic: CONFIG.MNEMONIC,
            providerOrUrl: polyjuiceHttpProvider
          }
        ],
        providerConfig)
      },
      network_id: "*",
      gas: 6000000
    },
    compilers: {
      solc: {
        version: "0.8.6",
      }
   },
  }
};
