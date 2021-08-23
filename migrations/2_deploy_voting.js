const Voting = artifacts.require("Voting");

module.exports = function(deployer, network, accounts) {
    const voters = accounts.slice(0, 3);
    const currTime = Math.round(Date.now() / 1000)
    const startTime = currTime - 5
    const endTime = currTime + 60 * 10
    deployer.deploy(Voting, "Do you support EIP-1559?", ["Yes", "No"], voters, startTime, endTime);
};