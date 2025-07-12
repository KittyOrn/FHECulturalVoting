const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Main deployment script for the Cultural Voting Platform
 * Deploys the CulturalVoting contract to the specified network
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Starting Cultural Voting Platform Deployment");
  console.log("=".repeat(60));

  // Get network information
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log("\n📋 Deployment Configuration:");
  console.log("-".repeat(60));
  console.log(`Network: ${network}`);
  console.log(`Deployer address: ${deployer.address}`);

  // Get deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("-".repeat(60));

  // Check if deployer has sufficient balance
  if (balance === 0n) {
    console.error("\n❌ Error: Deployer account has no ETH. Please fund the account.");
    process.exit(1);
  }

  console.log("\n🚀 Deploying CulturalVoting Contract...");

  // Deploy the contract
  const CulturalVoting = await hre.ethers.getContractFactory("CulturalVoting");

  console.log("⏳ Contract deployment in progress...");
  const culturalVoting = await CulturalVoting.deploy();

  await culturalVoting.waitForDeployment();
  const contractAddress = await culturalVoting.getAddress();

  console.log("\n✅ Deployment Successful!");
  console.log("=".repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Transaction Hash: ${culturalVoting.deploymentTransaction().hash}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${network}`);
  console.log(`Block Number: ${culturalVoting.deploymentTransaction().blockNumber || 'Pending'}`);
  console.log("=".repeat(60));

  // Verify initial contract state
  console.log("\n🔍 Verifying Initial Contract State...");
  const admin = await culturalVoting.admin();
  const currentRound = await culturalVoting.currentVotingRound();
  const totalProjects = await culturalVoting.totalProjects();

  console.log(`Admin Address: ${admin}`);
  console.log(`Current Voting Round: ${currentRound}`);
  console.log(`Total Projects: ${totalProjects}`);

  // Save deployment information
  const deploymentInfo = {
    network: network,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: culturalVoting.deploymentTransaction().hash,
    blockNumber: culturalVoting.deploymentTransaction().blockNumber,
    admin: admin,
    initialRound: currentRound.toString(),
    compiler: {
      version: "0.8.24",
      optimizer: true,
      runs: 200
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Display next steps
  console.log("\n📝 Next Steps:");
  console.log("-".repeat(60));
  console.log("1. Verify the contract on Etherscan:");
  console.log(`   npm run verify`);
  console.log("\n2. Interact with the contract:");
  console.log(`   npm run interact`);
  console.log("\n3. View on Block Explorer:");

  if (network === "sepolia") {
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (network === "mainnet") {
    console.log(`   https://etherscan.io/address/${contractAddress}`);
  } else {
    console.log(`   Network: ${network}`);
  }
  console.log("=".repeat(60));

  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment Failed!");
    console.error(error);
    process.exit(1);
  });
