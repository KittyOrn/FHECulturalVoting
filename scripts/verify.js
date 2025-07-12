const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Contract verification script for Etherscan
 * Verifies the deployed CulturalVoting contract
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Contract Verification Script");
  console.log("=".repeat(60));

  const network = hre.network.name;
  console.log(`\n📋 Network: ${network}`);

  // Load deployment information
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`\n❌ Error: Deployment file not found for network '${network}'`);
    console.error(`Expected file: ${deploymentFile}`);
    console.error(`\nPlease deploy the contract first using: npm run deploy`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`\n📄 Contract Address: ${contractAddress}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);

  // Verify on Etherscan
  if (network === "hardhat" || network === "localhost") {
    console.log("\n⚠️  Skipping verification: Local network detected");
    console.log("Etherscan verification is only available for public networks");
    process.exit(0);
  }

  console.log("\n🔍 Starting Etherscan Verification...");
  console.log("-".repeat(60));

  try {
    // Verify the contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // CulturalVoting has no constructor arguments
    });

    console.log("\n✅ Verification Successful!");
    console.log("=".repeat(60));
    console.log(`Contract verified on Etherscan`);

    if (network === "sepolia") {
      console.log(`\n🔗 View on Etherscan:`);
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else if (network === "mainnet") {
      console.log(`\n🔗 View on Etherscan:`);
      console.log(`https://etherscan.io/address/${contractAddress}#code`);
    }

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationTime = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("=".repeat(60));

  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("\n✅ Contract is already verified on Etherscan");

      if (network === "sepolia") {
        console.log(`\n🔗 View on Etherscan:`);
        console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
      } else if (network === "mainnet") {
        console.log(`\n🔗 View on Etherscan:`);
        console.log(`https://etherscan.io/address/${contractAddress}#code`);
      }
    } else {
      console.error("\n❌ Verification Failed!");
      console.error(error.message);
      process.exit(1);
    }
  }
}

// Execute verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Script Failed!");
    console.error(error);
    process.exit(1);
  });
