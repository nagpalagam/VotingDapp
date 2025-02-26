const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy the contract
  const voting = await Voting.deploy();

  // Wait for the contract to be deployed
  await voting.waitForDeployment();

  // Get the contract address
  const contractAddress = await voting.getAddress();
  console.log("Voting contract deployed to:", contractAddress);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });