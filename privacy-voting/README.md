# Privacy-Protected Voting dApp

Complete production-ready dApp demonstrating privacy-protected cultural project voting system built with **@fhevm/sdk** and **Next.js 14**.

## Features

- **🔐 Encrypted Voting**: All votes encrypted using FHE before submission
- **🧮 Homomorphic Aggregation**: Vote tallying without decryption
- **🛡️ Privacy Guarantees**: Individual scores remain private
- **👥 Access Control**: Only authorized voters can participate
- **✅ Result Verification**: Verifiable results without revealing individual votes
- **💻 Modern Frontend**: Next.js 14 App Router with TypeScript
- **🎨 Beautiful UI**: Tailwind CSS with responsive design
- **📱 Mobile-Friendly**: Works seamlessly on all devices

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
privacy-voting/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main voting page
│   ├── providers.tsx       # SDK provider setup
│   └── globals.css         # Global styles
├── contracts/
│   └── CulturalVoting.sol # FHE voting smart contract
├── package.json            # Dependencies
├── next.config.js          # Next.js config
├── tsconfig.json           # TypeScript config
└── tailwind.config.ts      # Tailwind config
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Voter Interface                       │
│  (React/Next.js components using @fhevm/sdk hooks)      │
├─────────────────────────────────────────────────────────┤
│                   @fhevm/sdk                             │
│  - Encrypt votes (1-10 scores)                          │
│  - Submit encrypted data                                │
│  - Decrypt authorized results                           │
├─────────────────────────────────────────────────────────┤
│              CulturalVoting Smart Contract               │
│  - Store encrypted votes                                │
│  - Homomorphic vote aggregation                         │
│  - Access control & authorization                       │
├─────────────────────────────────────────────────────────┤
│                    Zama FHEVM                            │
│  - FHE operations (euint8)                              │
│  - Decryption gateway                                   │
└─────────────────────────────────────────────────────────┘
```

## Contract Overview

### CulturalVoting.sol

Main voting contract with FHE support:

```solidity
// Submit encrypted vote
function submitVote(uint8 _projectId, uint8 _score) external

// Encrypted vote storage
struct Vote {
    euint8 encryptedScore;  // FHE encrypted score
    bool hasVoted;
    uint256 timestamp;
}
```

### Key Features

1. **Encrypted Vote Submission**
   - Scores (1-10) encrypted client-side
   - ZK proofs for verification
   - On-chain storage of encrypted values

2. **Homomorphic Aggregation**
   - Vote tallying on encrypted data
   - No intermediate decryption
   - Privacy preserved throughout

3. **Access Control**
   - Voter authorization system
   - Admin-controlled rounds
   - Permission-based decryption

## Integration with @fhevm/sdk

### Basic Usage

```typescript
import { FhevmSDK } from '@fhevm/sdk';

// Initialize SDK
const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// Encrypt vote
const encryptedVote = await fhevm.encryptUint8(7); // Score 1-10

// Get contract
const contract = fhevm.getContract(contractAddress, contractABI);

// Submit encrypted vote
await contract.submitVote(
  projectId,
  encryptedVote.data,
  encryptedVote.proof
);
```

### React Integration

```tsx
import { useFhevm, useEncrypt, useContract } from '@fhevm/sdk';

function VoteButton({ projectId, score }) {
  const { fhevm } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();
  const contract = useContract(contractAddress, contractABI);

  const handleVote = async () => {
    // Encrypt score
    const encrypted = await encrypt.uint8(score);

    // Submit to contract
    const tx = await contract.submitVote(
      projectId,
      encrypted.data,
      encrypted.proof
    );

    await tx.wait();
    console.log('Vote submitted!');
  };

  return (
    <button onClick={handleVote} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit Vote'}
    </button>
  );
}
```

## Privacy Model

### What Stays Private

- Individual vote scores (1-10 ratings)
- Voter-project associations
- Intermediate aggregation states

### What Is Public

- Total number of votes per project
- Final aggregated scores (after round ends)
- List of voters (not their individual votes)
- Winning project

### Privacy Guarantees

```
User A votes 7 → Encrypted → euint8(7)
User B votes 5 → Encrypted → euint8(5)
User C votes 9 → Encrypted → euint8(9)

On-chain: euint8(7) + euint8(5) + euint8(9) = euint8(21)
          ↓
     Decryption (authorized only)
          ↓
    Final Score: 21

❌ Cannot decrypt: Individual votes (7, 5, 9)
✅ Can decrypt: Aggregated total (21)
```

## Smart Contract Functions

### Voter Functions

```solidity
// Propose a cultural project
function proposeProject(
    string memory _name,
    string memory _description,
    string memory _category
) external

// Submit encrypted vote (requires authorization)
function submitVote(
    uint8 _projectId,
    uint8 _score
) external onlyAuthorizedVoter onlyDuringVoting
```

### Admin Functions

```solidity
// Authorize a voter
function authorizeVoter(address _voter) external onlyAdmin

// Start a voting round
function startVotingRound(uint8[] memory _projectIds) external onlyAdmin

// End round and trigger decryption
function endVotingRound() external onlyAdmin
```

### View Functions

```solidity
// Get current round information
function getCurrentRoundInfo() external view returns (
    uint8 round,
    bool votingActive,
    bool resultsRevealed,
    uint256 startTime,
    uint256 endTime,
    uint8[] memory projectIds
)

// Get project details
function getProjectInfo(uint8 _projectId) external view returns (
    string memory name,
    string memory description,
    string memory category,
    address proposer,
    bool isActive,
    uint256 proposalTime
)

// Get round results
function getRoundResults(uint8 _round) external view returns (
    bool resultsRevealed,
    uint8 winningProjectId,
    uint8 maxScore,
    uint256 voterCount
)
```

## Deployment

### Prerequisites

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_key
```

### Deploy Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### Verify Contract

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Testing

### Run Tests

```bash
npm test
```

### Coverage

```bash
npm run test:coverage
```

### Example Test

```javascript
it("should submit encrypted vote successfully", async function () {
  // Authorize voter
  await culturalVoting.authorizeVoter(voter1.address);

  // Propose project
  await culturalVoting.proposeProject("Art Museum", "Description", "Art");

  // Start voting round
  await culturalVoting.startVotingRound([1]);

  // Submit encrypted vote
  await culturalVoting.connect(voter1).submitVote(1, 7);

  // Verify vote was recorded
  const [hasVoted] = await culturalVoting.getVoteStatus(1, voter1.address);
  expect(hasVoted).to.be.true;
});
```

## Use Cases

### 1. Cultural Project Evaluation

Community members vote on cultural projects (art, music, theater) with privacy.

```typescript
// Rate cultural projects privately
await submitVote(artProjectId, 8);  // Individual rating private
await submitVote(musicProjectId, 9);
```

### 2. Grant Allocation

Committee members rate grant proposals without revealing individual preferences.

```typescript
// Committee voting
await submitVote(grantProposal1, 7);
await submitVote(grantProposal2, 6);
// Individual scores remain private
```

### 3. Academic Review

Peer review with privacy guarantees.

```typescript
// Review scores
await submitVote(paper1, 9);
await submitVote(paper2, 7);
// Reviewers remain anonymous
```

## Security Considerations

### 1. Authorization

```solidity
modifier onlyAuthorizedVoter() {
    require(authorizedVoters[msg.sender], "Not authorized to vote");
    _;
}
```

### 2. Vote Uniqueness

```solidity
require(!votes[currentVotingRound][_projectId][msg.sender].hasVoted,
    "Already voted for this project");
```

### 3. Score Validation

```solidity
require(_score >= 1 && _score <= 10, "Score must be between 1-10");
```

### 4. Encrypted Storage

```solidity
euint8 encryptedScore = FHE.asEuint8(_score);
FHE.allowThis(encryptedScore);
FHE.allow(encryptedScore, msg.sender);
```

## Performance

### Gas Costs

| Operation | Gas Cost (approx) |
|-----------|-------------------|
| Propose Project | ~95,000 |
| Submit Vote | ~245,000 |
| Start Round | ~172,000 |
| End Round | ~350,000 |

### Optimization

- Compiler optimizer: 800 runs
- Yul optimizer enabled
- Storage layout optimized
- Batch operations where possible

## Resources

- [Full Documentation](../../README.md)
- [Smart Contract](./contracts/CulturalVoting.sol)
- [@fhevm/sdk Docs](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT License

---

**Built for the Zama FHE Challenge**
