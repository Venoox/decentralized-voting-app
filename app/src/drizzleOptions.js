import Web3 from "web3";
import Voting from "./contracts/Voting.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [Voting],
};

export default options;
