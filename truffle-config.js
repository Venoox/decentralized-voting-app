const path = require("path");
const { PolyjuiceHDWalletProvider } = require('@polyjuice-provider/truffle');
const { PolyjuiceHttpProvider } = require("@polyjuice-provider/web3");

const godwokenRpcUrl = "https://godwoken-testnet-web3-rpc.ckbapp.dev";
const providerConfig = {
  rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
  ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
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
    godswoken: {
      provider: function() {
        const polyjuiceHttpProvider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        return new PolyjuiceHDWalletProvider(
        [
          { 
            mnemonic: "melt kind chicken alert fiscal plug zero hint magic hat faculty swallow",
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
