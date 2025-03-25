const hre = require("hardhat");

async function main() {
  // Deploy the GameFactory contract
  const GameFactory = await hre.ethers.getContractFactory("GameFactory");
  const gameFactory = await GameFactory.deploy();
  await gameFactory.deploymentTransaction().wait();

  console.log(`GameFactory deployed to: ${gameFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});