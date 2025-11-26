# 🚀 Quick Reference Guide

## Overview

This privacy-protected voting platform now features enterprise-grade reliability with refund mechanisms, timeout protection, and asynchronous Gateway callbacks.

---

## 🎯 Core Workflows

### Workflow 1: Normal Voting → Results

```
1. Admin: startVotingRound([projectIds], duration)
2. Voter: submitVote(projectId, score) [payable]
3. Voter: Multiple votes allowed for different projects
4. Admin: endVotingRound() [after voting period ends]
5. Gateway: Decrypts asynchronously
6. Contract: processResults(requestId, scores, signatures)
7. Admin/Voters: View results via getRoundResults()
```

### Workflow 2: Voting → Timeout → Refund

```
1. Same as Workflow 1, steps 1-4
2. Gateway: [No callback or delayed callback]
3. Wait: 1 hour passes
4. Anyone: handleDecryptionTimeout()
5. Contract: Refunds automatically enabled
6. Voter: claimRefund(round, projectId)
7. Voter: Receives stake back
```

### Workflow 3: Check Refund Status

```
1. Voter: hasClaimedRefundStatus(round, voterAddress)
2. Voter: getVoteRefundableStake(round, projectId, voterAddress)
3. Contract: Returns stake amount or zero
```

---

## 💰 Refund Mechanism

### How It Works

```solidity
// Voter submits vote with optional stake for protection
submitVote(projectId, score) payable

// If Gateway decryption fails or times out:
handleDecryptionTimeout() // Anyone can call after 1 hour

// Voter can then recover stake:
claimRefund(round, projectId)
```

### Key Points

- **Optional**: Staking is optional (payable parameter)
- **Protected**: Stakes are only returned if decryption fails
- **Timeout**: After 1 hour, anyone can trigger timeout handling
- **One-Time**: Each voter can claim refund once per round
- **Automatic**: No manual intervention needed

---

## ⏰ Timeout Protection Timeline

```
Time 0:     endVotingRound() called
            └─ decryptionRequestTime = block.timestamp

Time 0-1h:  Waiting for Gateway callback
            └─ Normal processing continues

Time 1h:    handleDecryptionTimeout() becomes available
            └─ Anyone can call it

Result:     Refunds automatically enabled
            └─ Voters can claim stakes
```

---

## 🔄 Gateway Callback Pattern

### Request Phase

```solidity
// Inside _requestResultsDecryption():
uint256 requestId = FHE.requestDecryption(cts, this.processResults.selector);
round.decryptionRequestId = requestId;
round.decryptionRequestTime = block.timestamp;
roundByRequestId[requestId] = currentVotingRound;
// emits: DecryptionRequested(round, requestId, timestamp)
```

### Callback Phase

```solidity
// Gateway calls back:
processResults(requestId, decryptedScores, signatures) external

// Inside callback:
uint8 round = roundByRequestId[requestId];  // Correlation
// Verify signatures
// Calculate results
// Finalize voting round
// emits: ResultsRevealed(round, winner, maxScore)
```

### Tracking

```solidity
// Check status anytime:
getDecryptionStatus(round)
// Returns: (requestId, requestTime, failed, refundsEnabled)
```

---

## 🔒 Security Features

### Input Validation Limits

```
Score:              1-10 (required)
Projects:           1-100 per round
Voters:             1-1000 per round (bounded)
Duration:           5 minutes - 30 days
Stake:              Any amount >= 0
```

### Permission Model

```
Admin Only:
  - proposeProject()
  - authorizeVoter()
  - revokeVoter()
  - startVotingRound()
  - endVotingRound()

Authorized Voters Only:
  - submitVote()

Anyone Can:
  - claimRefund()
  - handleDecryptionTimeout()
  - View functions (getters)
```

### Overflow Protection

```solidity
// Problem: uint8 max = 255
// With 1000 voters, scores can exceed 255

// Solution:
uint16 projectScore = 0;      // Use uint16 (max 65535)
projectScore += decryptedScores[i];  // Safe accumulation
if (projectScore <= type(uint8).max) {
    maxTotalScore = uint8(projectScore);  // Safe cast
}
```

---

## 📊 Data Structures

### Vote Struct

```solidity
struct Vote {
    euint8 encryptedScore;      // FHE encrypted 1-10 score
    bool hasVoted;              // Already voted?
    uint256 timestamp;          // When voted
    uint256 refundableStake;    // ETH amount (optional)
}
```

### VotingRound Struct

```solidity
struct VotingRound {
    uint8[] projectIds;              // Projects being voted on
    bool votingActive;               // Can vote?
    bool resultsRevealed;            // Results finalized?
    uint256 startTime;               // When voting started
    uint256 endTime;                 // When voting ends
    address[] voters;                // Unique voters in round
    uint8 winningProjectId;          // Winner (after reveal)
    uint8 maxScore;                  // Winning score
    uint256 decryptionRequestId;     // Gateway request ID
    uint256 decryptionRequestTime;   // When requested
    bool decryptionFailed;           // Failed flag
    bool refundsEnabled;             // Can claim refunds?
}
```

---

## 🔑 Key Constants

```solidity
DECRYPTION_TIMEOUT = 1 hours           // When timeout triggers
VOTING_ROUND_MAX_DURATION = 30 days    // Maximum voting period
PRIVACY_MULTIPLIER = 1000              // For obfuscation
MAX_PROJECTS = 100                     // Loop safety bound
MAX_VOTERS_PER_ROUND = 1000            // Loop safety bound
```

---

## 📞 Function Reference

### For Voters

#### submitVote

```solidity
function submitVote(uint8 _projectId, uint8 _score)
    external
    payable
    onlyAuthorizedVoter
    onlyDuringVoting
```

- **Parameters**:
  - `_projectId`: Which project (1-based)
  - `_score`: Vote score (1-10)
  - `value`: Optional ETH stake for refund protection

- **Requirements**:
  - Must be authorized voter
  - Voting round must be active
  - Score must be 1-10
  - Must not have voted for this project
  - Voting period must not be expired

- **Effects**:
  - Encrypts and stores vote
  - Records stake
  - Sets FHE permissions
  - Emits VoteSubmitted

#### claimRefund

```solidity
function claimRefund(uint8 _round, uint8 _projectId)
    external
```

- **Parameters**:
  - `_round`: Which voting round
  - `_projectId`: Which project to claim for

- **Requirements**:
  - Refunds must be enabled
  - Must not have claimed already
  - Must have voted in this round

- **Effects**:
  - Marks refund as claimed
  - Transfers stake back
  - Emits RefundIssued

### For Administrators

#### startVotingRound

```solidity
function startVotingRound(uint8[] memory _projectIds, uint256 _duration)
    external
    onlyAdmin
```

- **Parameters**:
  - `_projectIds`: Array of valid project IDs
  - `_duration`: Voting period in seconds

- **Requirements**:
  - No voting already active
  - Projects must exist and be active
  - Duration must be 5 minutes - 30 days
  - Max 100 projects

#### endVotingRound

```solidity
function endVotingRound()
    external
    onlyAdmin
```

- **Requirements**:
  - Voting must be active
  - Results not already revealed
  - Voting period must have ended

- **Effects**:
  - Deactivates voting
  - Requests decryption
  - Stores request ID and timestamp
  - Emits DecryptionRequested

#### handleDecryptionTimeout

```solidity
function handleDecryptionTimeout()
    external
```

- **Requirements**:
  - Decryption was requested
  - Results not already revealed
  - 1 hour has passed since request

- **Effects**:
  - Marks decryption as failed
  - Enables refunds
  - Emits DecryptionTimeout
  - Emits DecryptionFailed

### Gateway (External)

#### processResults

```solidity
function processResults(
    uint256 requestId,
    uint8[] calldata decryptedScores,
    bytes[] calldata signatures
)
    external
```

- **Called By**: Gateway oracle
- **Parameters**:
  - `requestId`: From decryption request
  - `decryptedScores`: Decrypted vote scores
  - `signatures`: Verification signatures

- **Requirements**:
  - RequestId must be valid
  - Results not already revealed
  - Signatures must be provided

- **Effects**:
  - Correlates requestId to round
  - Verifies signatures
  - Calculates winning project
  - Finalizes round
  - Emits ResultsRevealed

### View Functions

```solidity
// Get all info about a round
function getRoundResults(uint8 _round)
    external view
    returns (bool, uint8, uint8, uint256)

// Get decryption status
function getDecryptionStatus(uint8 _round)
    external view
    returns (uint256, uint256, bool, bool)

// Check if user can claim refund
function hasClaimedRefundStatus(uint8 _round, address _voter)
    external view
    returns (bool)

// Get amount of refundable stake
function getVoteRefundableStake(uint8 _round, uint8 _projectId, address _voter)
    external view
    returns (uint256)

// Check voting status
function hasUserVotedForProject(uint8 _projectId, address _voter)
    external view
    returns (bool)
```

---

## 🎓 Usage Examples

### Example 1: Submit Vote with Stake

```solidity
// Authorize voter first (admin)
culturalVoting.authorizeVoter(voterAddress);

// Voter submits vote with 0.1 ETH protection stake
culturalVoting.submitVote{value: 0.1 ether}(
    projectId = 1,
    score = 8
);
```

### Example 2: Handle Timeout Scenario

```javascript
// After 1+ hour from endVotingRound():
const tx = await culturalVoting.handleDecryptionTimeout();
await tx.wait();

// Now refunds enabled, voter claims:
const refundTx = await culturalVoting.claimRefund(round, projectId);
await refundTx.wait();
```

### Example 3: Check Status

```javascript
const status = await culturalVoting.getDecryptionStatus(round);
console.log('Request ID:', status.requestId);
console.log('Failed:', status.failed);
console.log('Refunds Enabled:', status.refundsEnabled);

const stake = await culturalVoting.getVoteRefundableStake(round, projectId, voter);
console.log('Refundable Amount:', ethers.formatEther(stake));
```

---

## 🐛 Troubleshooting

### Issue: "Voting not active"
**Cause**: Not during voting period
**Solution**: Check `endTime` hasn't passed, or wait for admin to start new round

### Issue: "Already voted for this project"
**Cause**: Voter tried to vote twice for same project
**Solution**: Vote for different projects, or wait for next round

### Issue: "Not authorized to vote"
**Cause**: Admin hasn't authorized this voter
**Solution**: Contact admin to run `authorizeVoter(voterAddress)`

### Issue: "Timeout not reached"
**Cause**: Less than 1 hour passed since `endVotingRound()`
**Solution**: Wait 1 hour, then call `handleDecryptionTimeout()`

### Issue: "Already claimed refund"
**Cause**: Refund already claimed for this round
**Solution**: Cannot claim twice per round; wait for next voting round

---

## 📈 Gas Optimization Tips

1. **Batch Votes**: Submit multiple votes in one transaction when possible
2. **Check Status**: Use view functions (free) before state-changing operations
3. **Plan Timing**: Submit votes before voting period ends to avoid rush
4. **Monitor Timeout**: Check decryption status periodically to ensure processing
5. **Optimize Refs**: Minimize storage reads in loops

---

## 📚 Additional Resources

- `IMPLEMENTATION_COMPLETE.md`: Full implementation details
- `ENHANCEMENT_SUMMARY.md`: Feature documentation
- `README.md`: Complete architecture guide
- `contracts/CulturalVoting.sol`: Fully commented source

---

**Happy Voting! 🗳️**

*Questions? Refer to documentation or review contract comments* 📖
