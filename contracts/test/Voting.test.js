const { expect } = require("chai");
const hre = require("hardhat");

describe("Voting", function () {
  let voting;

  beforeEach(async function () {
    // Get the contract factory
    const Voting = await hre.ethers.getContractFactory("Voting");

    // Deploy the contract
    voting = await Voting.deploy();

    // Wait for the contract to be deployed
    await voting.waitForDeployment();
  });

  it("should add candidates correctly", async function () {
    const candidates = await voting.getCandidates();
    expect(candidates.length).to.equal(2);
    expect(candidates[0].name).to.equal("Alice");
    expect(candidates[1].name).to.equal("Bob");
  });

  it("should allow voting", async function () {
    await voting.vote(1); // Vote for Alice (candidate ID 1)
    const candidates = await voting.getCandidates();
    expect(candidates[0].voteCount).to.equal(1);
  });

  it("should not allow double voting", async function () {
    await voting.vote(1); // Vote for Alice (candidate ID 1)
    await expect(voting.vote(1)).to.be.revertedWith("You have already voted.");
  });

  it("should not allow voting for an invalid candidate", async function () {
    await expect(voting.vote(0)).to.be.revertedWith("Invalid candidate ID."); // Invalid candidate ID
    await expect(voting.vote(3)).to.be.revertedWith("Invalid candidate ID."); // Invalid candidate ID
  });
});