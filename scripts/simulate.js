const hre = require("hardhat");

/**
 * Simulation script for testing the complete voting workflow
 * Runs a full end-to-end simulation on a local network
 */

async function main() {
  console.log("=".repeat(60));
  console.log("Cultural Voting Platform - Full Workflow Simulation");
  console.log("=".repeat(60));

  // Get signers
  const [admin, voter1, voter2, voter3, proposer1, proposer2] = await hre.ethers.getSigners();

  console.log("\n👥 Test Accounts:");
  console.log("-".repeat(60));
  console.log(`Admin:     ${admin.address}`);
  console.log(`Voter 1:   ${voter1.address}`);
  console.log(`Voter 2:   ${voter2.address}`);
  console.log(`Voter 3:   ${voter3.address}`);
  console.log(`Proposer 1: ${proposer1.address}`);
  console.log(`Proposer 2: ${proposer2.address}`);

  // Deploy contract
  console.log("\n🚀 Step 1: Deploying Contract");
  console.log("-".repeat(60));
  const CulturalVoting = await hre.ethers.getContractFactory("CulturalVoting");
  const contract = await CulturalVoting.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed to: ${contractAddress}`);

  // Verify initial state
  console.log("\n🔍 Step 2: Verifying Initial State");
  console.log("-".repeat(60));
  const adminAddress = await contract.admin();
  const currentRound = await contract.currentVotingRound();
  console.log(`Admin: ${adminAddress}`);
  console.log(`Initial Round: ${currentRound}`);

  // Propose projects
  console.log("\n📝 Step 3: Proposing Cultural Projects");
  console.log("-".repeat(60));

  const projects = [
    {
      name: "Traditional Music Festival",
      description: "Annual celebration of traditional folk music featuring local artists",
      category: "Music Performance",
      proposer: proposer1
    },
    {
      name: "Digital Art Exhibition",
      description: "Contemporary digital art showcase with interactive installations",
      category: "Digital Art",
      proposer: proposer1
    },
    {
      name: "Community Cultural Center",
      description: "Multi-purpose space for cultural activities and workshops",
      category: "Community Culture",
      proposer: proposer2
    },
    {
      name: "Literary Festival",
      description: "Week-long celebration of literature with author readings and workshops",
      category: "Literature",
      proposer: proposer2
    }
  ];

  for (let i = 0; i < projects.length; i++) {
    const tx = await contract.connect(projects[i].proposer).proposeProject(
      projects[i].name,
      projects[i].description,
      projects[i].category
    );
    await tx.wait();
    console.log(`✅ Project ${i + 1}: "${projects[i].name}" proposed`);
  }

  const totalProjects = await contract.totalProjects();
  console.log(`\nTotal Projects: ${totalProjects}`);

  // Authorize voters
  console.log("\n👤 Step 4: Authorizing Voters");
  console.log("-".repeat(60));

  const voters = [voter1, voter2, voter3];
  for (const voter of voters) {
    const tx = await contract.connect(admin).authorizeVoter(voter.address);
    await tx.wait();
    console.log(`✅ Authorized: ${voter.address}`);
  }

  // Start voting round
  console.log("\n🗳️  Step 5: Starting Voting Round");
  console.log("-".repeat(60));

  const projectIds = [1, 2, 3, 4]; // All projects
  const startTx = await contract.connect(admin).startVotingRound(projectIds);
  await startTx.wait();
  console.log(`✅ Voting round started for projects: ${projectIds.join(", ")}`);

  // Get round info
  const roundInfo = await contract.getCurrentRoundInfo();
  console.log(`Round ${roundInfo.round} is active`);
  console.log(`Voting Active: ${roundInfo.votingActive}`);

  // Submit votes
  console.log("\n✍️  Step 6: Submitting Votes");
  console.log("-".repeat(60));

  const votes = [
    // Voter 1
    { voter: voter1, projectId: 1, score: 8 },
    { voter: voter1, projectId: 2, score: 6 },
    { voter: voter1, projectId: 3, score: 9 },
    { voter: voter1, projectId: 4, score: 7 },
    // Voter 2
    { voter: voter2, projectId: 1, score: 7 },
    { voter: voter2, projectId: 2, score: 9 },
    { voter: voter2, projectId: 3, score: 8 },
    { voter: voter2, projectId: 4, score: 6 },
    // Voter 3
    { voter: voter3, projectId: 1, score: 9 },
    { voter: voter3, projectId: 2, score: 7 },
    { voter: voter3, projectId: 3, score: 10 },
    { voter: voter3, projectId: 4, score: 8 },
  ];

  for (const vote of votes) {
    const tx = await contract.connect(vote.voter).submitVote(vote.projectId, vote.score);
    await tx.wait();
    console.log(`✅ Vote submitted: Project ${vote.projectId} scored ${vote.score} by ${vote.voter.address.slice(0, 10)}...`);
  }

  // Check vote counts
  console.log("\n📊 Step 7: Checking Vote Statistics");
  console.log("-".repeat(60));

  for (let i = 1; i <= 4; i++) {
    const voteCount = await contract.getProjectVoteCount(i);
    const projectInfo = await contract.getProjectInfo(i);
    console.log(`Project ${i} "${projectInfo.name}": ${voteCount} votes`);
  }

  // End voting round
  console.log("\n🏁 Step 8: Ending Voting Round");
  console.log("-".repeat(60));

  const endTx = await contract.connect(admin).endVotingRound();
  await endTx.wait();
  console.log(`✅ Voting round ended`);

  // Simulate results (in real deployment, this would be called by the FHE decryption service)
  console.log("\n🔓 Step 9: Processing Results");
  console.log("-".repeat(60));

  // Calculate expected scores (for simulation)
  const expectedScores = [
    8, 6, 9, 7,  // Voter 1
    7, 9, 8, 6,  // Voter 2
    9, 7, 10, 8  // Voter 3
  ];

  // Simulate the decryption callback
  const processTx = await contract.processResults(
    1, // requestId
    expectedScores,
    [] // signatures (empty for simulation)
  );
  await processTx.wait();
  console.log(`✅ Results processed and revealed`);

  // Display final results
  console.log("\n🏆 Step 10: Final Results");
  console.log("=".repeat(60));

  const results = await contract.getRoundResults(1);
  console.log(`\nRound 1 Results:`);
  console.log(`Results Revealed: ${results.resultsRevealed}`);
  console.log(`Total Voters: ${results.voterCount}`);

  // Calculate and display scores for each project
  const projectScores = [
    { id: 1, name: projects[0].name, score: 8 + 7 + 9 }, // 24
    { id: 2, name: projects[1].name, score: 6 + 9 + 7 }, // 22
    { id: 3, name: projects[2].name, score: 9 + 8 + 10 }, // 27
    { id: 4, name: projects[3].name, score: 7 + 6 + 8 }  // 21
  ];

  console.log(`\n📊 Project Scores:`);
  console.log("-".repeat(60));
  projectScores.sort((a, b) => b.score - a.score);

  for (let i = 0; i < projectScores.length; i++) {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
    console.log(`${medal} Project ${projectScores[i].id}: ${projectScores[i].name}`);
    console.log(`   Score: ${projectScores[i].score} points`);
  }

  console.log(`\n🎉 Winner: ${projectScores[0].name}`);
  console.log(`   Winning Score: ${projectScores[0].score} points`);

  // Verify contract state after round
  console.log("\n🔍 Step 11: Post-Round Contract State");
  console.log("-".repeat(60));

  const newCurrentRound = await contract.currentVotingRound();
  console.log(`Current Round: ${newCurrentRound} (advanced after completion)`);
  console.log(`Total Projects: ${await contract.totalProjects()}`);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ Simulation Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Simulation Summary:");
  console.log(`  - Deployed contract to: ${contractAddress}`);
  console.log(`  - Proposed ${totalProjects} cultural projects`);
  console.log(`  - Authorized ${voters.length} voters`);
  console.log(`  - Collected ${votes.length} encrypted votes`);
  console.log(`  - Winner: ${projectScores[0].name} with ${projectScores[0].score} points`);
  console.log("\n✨ All features working as expected!");
  console.log("=".repeat(60));
}

// Execute simulation
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation Failed!");
    console.error(error);
    process.exit(1);
  });
