const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
  const voters = accounts.slice(0, 3);
  const nonVoters = accounts.slice(3);

  it("...should store votes.", async () => {
    const votingInstance = await Voting.deployed();

    await votingInstance.vote(0, { from: voters[0] });
    await votingInstance.vote(0, { from: voters[1] });
    await votingInstance.vote(1, { from: voters[2] });

    const count0 = (await votingInstance.answers(0)).count;
    const count1 = (await votingInstance.answers(1)).count;

    assert.equal(count0, 2, "Vote for index 0 was not counted.");
    assert.equal(count1, 1, "Vote for index 1 was not counted.");
  });

  it("...fail when trying to vote twice.", async () => {
    const votingInstance = await Voting.deployed();

    try {
      await votingInstance.vote(0, { from: voters[0] });
      assert.fail("The vote was counted twice, it should've reverted!");
    } catch(error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got '" + error.message + "' instead");
    }

  });

  it("...fail if voter is not registered", async () => {
    const votingInstance = await Voting.deployed();
    try {
      await votingInstance.vote(0, { from: nonVoters[0] });
      assert.fail("The voter is not registered, it should've reverted!");
    } catch(error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got '" + error.message + "' instead");
    }
  });

  it("...get correct vote count", async () => {
    const votingInstance = await Voting.deployed();
    const votedCount = await votingInstance.getVotedCount();
    assert.equal(votedCount, 3, "Vote count is not the same");
  })

  it("...get correct most voted answer", async () => {
    const votingInstance = await Voting.deployed();
    const mostVoted = await votingInstance.getMostVoted();
    const answer = await votingInstance.answers(0);
    assert.equal(mostVoted.count, 2);
    assert.equal(mostVoted.answer, answer.answer);
  })
});