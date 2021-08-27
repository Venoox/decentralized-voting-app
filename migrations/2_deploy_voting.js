const Voting = artifacts.require("Voting");
const { AddressTranslator } = require('nervos-godwoken-integration');

const addressTranslator = new AddressTranslator();

module.exports = function(deployer, network, accounts) {
    const voters = accounts.slice(0, 3).map(addr => addressTranslator.ethAddressToGodwokenShortAddress(addr));
    const currTime = Math.round(Date.now() / 1000)
    const startTime = currTime - 5
    const endTime = currTime + 60 * 60 * 24
    deployer.deploy(Voting, "Do you support EIP-1559?", ["Yes", "No"], voters, startTime, endTime);
};