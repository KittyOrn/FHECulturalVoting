const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

/**
 * Interactive script for managing the Cultural Voting Platform
 * Provides a CLI interface for common contract operations
 */

let contract;
let signer;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify question function
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function loadContract() {
  const network = hre.network.name;
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`\n❌ Error: Deployment file not found for network '${network}'`);
    console.error(`Please deploy the contract first using: npm run deploy`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  [signer] = await hre.ethers.getSigners();
  const CulturalVoting = await hre.ethers.getContractFactory("CulturalVoting");
  contract = CulturalVoting.attach(contractAddress);

  console.log(`\n✅ Connected to contract at: ${contractAddress}`);
  console.log(`Network: ${network}`);
  console.log(`Signer: ${signer.address}`);
}

async function displayMenu() {
  console.log("\n" + "=".repeat(60));
  console.log("Cultural Voting Platform - Interactive Menu");
  console.log("=".repeat(60));
  console.log("1. View Contract Status");
  console.log("2. Propose New Project");
  console.log("3. Authorize Voter");
  console.log("4. Start Voting Round");
  console.log("5. Submit Vote");
  console.log("6. End Voting Round");
  console.log("7. View Round Results");
  console.log("8. View Project Details");
  console.log("9. Check Voter Authorization");
  console.log("0. Exit");
  console.log("=".repeat(60));
}

async function viewContractStatus() {
  console.log("\n📊 Contract Status");
  console.log("-".repeat(60));

  const admin = await contract.admin();
  const currentRound = await contract.currentVotingRound();
  const totalProjects = await contract.totalProjects();
  const roundInfo = await contract.getCurrentRoundInfo();

  console.log(`Admin: ${admin}`);
  console.log(`Current Round: ${currentRound}`);
  console.log(`Total Projects: ${totalProjects}`);
  console.log(`\nCurrent Round Info:`);
  console.log(`  Voting Active: ${roundInfo.votingActive}`);
  console.log(`  Results Revealed: ${roundInfo.resultsRevealed}`);
  console.log(`  Project IDs: ${roundInfo.projectIds.join(", ") || "None"}`);
}

async function proposeProject() {
  console.log("\n📝 Propose New Project");
  console.log("-".repeat(60));

  const name = await question("Project Name: ");
  const description = await question("Project Description: ");
  const category = await question("Project Category: ");

  console.log("\n⏳ Submitting proposal...");
  const tx = await contract.proposeProject(name, description, category);
  await tx.wait();

  console.log(`✅ Project proposed successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

async function authorizeVoter() {
  console.log("\n👤 Authorize Voter");
  console.log("-".repeat(60));

  const voterAddress = await question("Voter Address: ");

  console.log("\n⏳ Authorizing voter...");
  const tx = await contract.authorizeVoter(voterAddress);
  await tx.wait();

  console.log(`✅ Voter authorized successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

async function startVotingRound() {
  console.log("\n🗳️  Start Voting Round");
  console.log("-".repeat(60));

  const totalProjects = await contract.totalProjects();
  console.log(`Total available projects: ${totalProjects}`);

  const projectIdsInput = await question("Enter project IDs (comma-separated): ");
  const projectIds = projectIdsInput.split(",").map(id => parseInt(id.trim()));

  console.log("\n⏳ Starting voting round...");
  const tx = await contract.startVotingRound(projectIds);
  await tx.wait();

  console.log(`✅ Voting round started successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

async function submitVote() {
  console.log("\n✍️  Submit Vote");
  console.log("-".repeat(60));

  const roundInfo = await contract.getCurrentRoundInfo();
  console.log(`Available projects: ${roundInfo.projectIds.join(", ")}`);

  const projectId = await question("Project ID to vote for: ");
  const score = await question("Score (1-10): ");

  console.log("\n⏳ Submitting vote...");
  const tx = await contract.submitVote(parseInt(projectId), parseInt(score));
  await tx.wait();

  console.log(`✅ Vote submitted successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

async function endVotingRound() {
  console.log("\n🏁 End Voting Round");
  console.log("-".repeat(60));

  const confirm = await question("Are you sure you want to end the current voting round? (yes/no): ");

  if (confirm.toLowerCase() === "yes") {
    console.log("\n⏳ Ending voting round...");
    const tx = await contract.endVotingRound();
    await tx.wait();

    console.log(`✅ Voting round ended successfully!`);
    console.log(`Transaction Hash: ${tx.hash}`);
  } else {
    console.log("❌ Operation cancelled");
  }
}

async function viewRoundResults() {
  console.log("\n🏆 View Round Results");
  console.log("-".repeat(60));

  const roundNumber = await question("Round Number: ");
  const results = await contract.getRoundResults(parseInt(roundNumber));

  console.log(`\nRound ${roundNumber} Results:`);
  console.log(`  Results Revealed: ${results.resultsRevealed}`);
  console.log(`  Winning Project ID: ${results.winningProjectId}`);
  console.log(`  Max Score: ${results.maxScore}`);
  console.log(`  Total Voters: ${results.voterCount}`);

  if (results.resultsRevealed && results.winningProjectId > 0) {
    const projectInfo = await contract.getProjectInfo(results.winningProjectId);
    console.log(`\nWinning Project:`);
    console.log(`  Name: ${projectInfo.name}`);
    console.log(`  Description: ${projectInfo.description}`);
    console.log(`  Category: ${projectInfo.category}`);
  }
}

async function viewProjectDetails() {
  console.log("\n📋 View Project Details");
  console.log("-".repeat(60));

  const projectId = await question("Project ID: ");
  const projectInfo = await contract.getProjectInfo(parseInt(projectId));

  console.log(`\nProject #${projectId}:`);
  console.log(`  Name: ${projectInfo.name}`);
  console.log(`  Description: ${projectInfo.description}`);
  console.log(`  Category: ${projectInfo.category}`);
  console.log(`  Proposer: ${projectInfo.proposer}`);
  console.log(`  Active: ${projectInfo.isActive}`);
  console.log(`  Proposal Time: ${new Date(Number(projectInfo.proposalTime) * 1000).toLocaleString()}`);
}

async function checkVoterAuthorization() {
  console.log("\n🔍 Check Voter Authorization");
  console.log("-".repeat(60));

  const voterAddress = await question("Voter Address: ");
  const isAuthorized = await contract.isAuthorizedVoter(voterAddress);

  console.log(`\nVoter ${voterAddress}:`);
  console.log(`  Authorized: ${isAuthorized ? "✅ Yes" : "❌ No"}`);
}

async function main() {
  console.log("=".repeat(60));
  console.log("Cultural Voting Platform - Interactive Console");
  console.log("=".repeat(60));

  await loadContract();

  let running = true;

  while (running) {
    await displayMenu();
    const choice = await question("\nSelect an option: ");

    try {
      switch (choice) {
        case "1":
          await viewContractStatus();
          break;
        case "2":
          await proposeProject();
          break;
        case "3":
          await authorizeVoter();
          break;
        case "4":
          await startVotingRound();
          break;
        case "5":
          await submitVote();
          break;
        case "6":
          await endVotingRound();
          break;
        case "7":
          await viewRoundResults();
          break;
        case "8":
          await viewProjectDetails();
          break;
        case "9":
          await checkVoterAuthorization();
          break;
        case "0":
          console.log("\n👋 Goodbye!");
          running = false;
          break;
        default:
          console.log("\n❌ Invalid option. Please try again.");
      }
    } catch (error) {
      console.error("\n❌ Error:", error.message);
    }

    if (running) {
      await question("\nPress Enter to continue...");
    }
  }

  rl.close();
  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Script Failed!");
  console.error(error);
  rl.close();
  process.exit(1);
});
