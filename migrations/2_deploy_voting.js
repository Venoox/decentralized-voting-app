const Voting = artifacts.require("Voting");

module.exports = function(deployer, network, accounts) {
    const voters = accounts.slice(0, 3);
    deployer.deploy(Voting, "Ali se razresi Janeza Janso?", ["Da", "Ne"], voters, 1625653213, 1628331613);
};