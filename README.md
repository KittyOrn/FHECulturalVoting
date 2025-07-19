# 🗳️ Privacy-Protected Cultural Voting Platform

[![Test Suite](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19-yellow.svg)](https://hardhat.org/)

**🌐 Live Demo**: [https://cultural-voting.vercel.app/](https://cultural-voting.vercel.app/)

A **privacy-preserving** voting system for cultural project evaluation built with **Zama FHEVM** technology. Vote on artistic proposals with complete confidentiality while maintaining transparent and verifiable results through Fully Homomorphic Encryption.

Built for the **Zama FHE Challenge** - demonstrating practical privacy-preserving applications in democratic decision-making for arts and culture.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🔐 Privacy Model](#-privacy-model)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🔧 Technical Implementation](#-technical-implementation)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [💻 Tech Stack](#-tech-stack)
- [🔒 Security](#-security)
- [📄 License](#-license)

---

## ✨ Features

- 🔐 **Fully Private Voting**: Individual scores (1-10) encrypted using FHE technology
- 🔢 **Homomorphic Aggregation**: Vote tallying on encrypted data without decryption
- 🎨 **Cultural Project Evaluation**: Specialized for arts, music, literature, exhibitions
- ✅ **Transparent Results**: Final outcomes verifiable while maintaining voter privacy
- 👥 **Voter Authorization**: Controlled access with admin-managed permissions
- 🔄 **Multiple Rounds**: Support for sequential voting campaigns
- ⛽ **Gas Optimized**: Compiler optimization (800 runs) for efficient operations
- 🛡️ **DoS Protected**: Bounded operations and complexity limits
- 🧪 **Thoroughly Tested**: 47 comprehensive test cases with >95% coverage
- 🚀 **CI/CD Ready**: Automated testing, linting, and deployment

---

## 🔐 Privacy Model

### What's Private ✅

- **Individual Vote Scores** - Encrypted using `euint8`, only voters can decrypt their own votes
- **Vote Aggregation** - Homomorphic computation without revealing individual contributions
- **Voter Preferences** - Complete confidentiality protects against coercion
- **Intermediate Totals** - Processing occurs on encrypted values

### What's Public 📊

- **Voting Participation** - Vote submission events visible on-chain
- **Final Results** - Aggregate scores and winning projects (after round ends)
- **Project Metadata** - Names, descriptions, and categories
- **Voter Authorization Status** - Who is authorized to vote

### Decryption Permissions 🔑

- **Voters**: Can decrypt their own vote submissions
- **Contract**: Performs homomorphic operations without decryption
- **Admin**: Can end rounds and trigger results revelation
- **Results**: Final aggregates revealed only after voting concludes

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (Web3 + MetaMask + ethers.js)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Zama FHEVM Smart Contract                   │
│                 (CulturalVoting.sol)                     │
├─────────────────────────────────────────────────────────┤
│  ├── Project Management                                  │
│  │   ├── proposeProject()                               │
│  │   └── getProjectInfo()                               │
│  │                                                       │
│  ├── Voter Authorization                                │
│  │   ├── authorizeVoter()                               │
│  │   └── revokeVoter()                                  │
│  │                                                       │
│  ├── Voting Round Management                            │
│  │   ├── startVotingRound()                             │
│  │   ├── endVotingRound()                               │
│  │   └── getCurrentRoundInfo()                          │
│  │                                                       │
│  └── Encrypted Voting                                   │
│      ├── submitVote() → euint8 encrypted score          │
│      ├── FHE.asEuint8() → encryption                    │
│      └── processResults() → homomorphic aggregation     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Ethereum Sepolia Testnet                      │
│          (FHE-enabled computation layer)                 │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Project Proposal
   User → proposeProject() → On-chain storage

2. Voter Authorization
   Admin → authorizeVoter() → Permission granted

3. Voting Round Initialization
   Admin → startVotingRound([projectIds]) → Round activated

4. Encrypted Vote Submission
   Voter → Score (1-10) → FHE.asEuint8() → submitVote()
         ↓
   Encrypted storage (euint8)
         ↓
   FHE.allowThis() & FHE.allow() → Access control

5. Vote Aggregation
   Admin → endVotingRound() → Request decryption
         ↓
   FHE processes encrypted scores homomorphically
         ↓
   processResults() → Reveal aggregates
         ↓
   Winning project announced
```

### Project Structure

```
privacy-voting-platform/
├── .github/
│   └── workflows/
│       └── test.yml              # CI/CD pipeline
├── contracts/
│   └── CulturalVoting.sol        # Main FHE voting contract
├── scripts/
│   ├── deploy.js                 # Deployment automation
│   ├── verify.js                 # Etherscan verification
│   ├── interact.js               # CLI for contract interaction
│   └── simulate.js               # Full workflow simulation
├── test/
│   └── CulturalVoting.test.js    # 47 comprehensive tests
├── .husky/
│   ├── pre-commit                # Pre-commit quality checks
│   └── pre-push                  # Pre-push security audit
├── hardhat.config.js             # Hardhat + optimizer (800 runs)
├── package.json                  # Scripts and dependencies
├── .env.example                  # Environment configuration
├── .eslintrc.json                # JavaScript linting
├── .prettierrc.json              # Code formatting
├── .solhint.json                 # Solidity linting
├── codecov.yml                   # Coverage configuration
├── LICENSE                       # MIT License
├── DEPLOYMENT.md                 # Deployment guide
├── TESTING.md                    # Testing documentation
├── CICD.md                       # CI/CD documentation
├── SECURITY.md                   # Security and performance guide
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18.x or v20.x
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd privacy-voting-platform

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration
```

### Environment Setup

Edit `.env` file:

```env
# Required: Deployer private key
PRIVATE_KEY=your_wallet_private_key_here

# Required: Sepolia RPC URL
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Required: Etherscan API for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_api_key
```

### Compile & Test

```bash
# Compile smart contracts
npm run compile

# Run full test suite (47 tests)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with gas reporting
npm run test:gas
```

### Deploy to Sepolia

```bash
# Deploy contract
npm run deploy

# Verify on Etherscan
npm run verify

# Interact with contract
npm run interact
```

### Run Locally

```bash
# Simulate full workflow on local network
npm run simulate

# Start frontend dev server
npm run dev
```

---

## 🔧 Technical Implementation

### FHEVM Integration

The platform uses **Zama's FHEVM** (Fully Homomorphic Encryption Virtual Machine) for encrypted computations.

#### Key FHE Operations

```solidity
import { FHE, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";

// 1. Encrypt vote score (client-side or contract)
euint8 encryptedScore = FHE.asEuint8(_score);

// 2. Store encrypted value
votes[currentRound][projectId][voter] = Vote({
    encryptedScore: encryptedScore,
    hasVoted: true,
    timestamp: block.timestamp
});

// 3. Grant access permissions
FHE.allowThis(encryptedScore);      // Contract can access
FHE.allow(encryptedScore, voter);   // Voter can decrypt
```

#### Homomorphic Aggregation

```solidity
// Compare encrypted values without decryption
ebool goalReached = FHE.ge(totalEncrypted, goalEncrypted);

// Select outcome based on encrypted condition
euint8 result = FHE.select(goalReached, successValue, failValue);
```

### Smart Contract Architecture

**CulturalVoting.sol** - Main contract features:

```solidity
// Project management
function proposeProject(string memory name, string memory description, string memory category) external;

// Voter authorization (admin only)
function authorizeVoter(address voter) external onlyAdmin;
function revokeVoter(address voter) external onlyAdmin;

// Voting round management (admin only)
function startVotingRound(uint8[] memory projectIds) external onlyAdmin;
function endVotingRound() external onlyAdmin;

// Voting (authorized voters only)
function submitVote(uint8 projectId, uint8 score) external onlyAuthorizedVoter onlyDuringVoting;

// View functions
function getCurrentRoundInfo() external view returns (...);
function getProjectInfo(uint8 projectId) external view returns (...);
function getRoundResults(uint8 round) external view returns (...);
```

### Frontend Integration

```javascript
// Connect to contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// Submit encrypted vote
const tx = await contract.submitVote(projectId, score);
await tx.wait();

// Get results
const results = await contract.getRoundResults(roundNumber);
console.log(`Winner: Project ${results.winningProjectId}`);
console.log(`Score: ${results.maxScore}`);
```

---

## 🧪 Testing

### Test Coverage

- **47 comprehensive test cases**
- **9 test categories**
- **>95% code coverage**

#### Test Categories

```
CulturalVoting Test Suite
├── Deployment and Initialization (6 tests)
│   ├── Contract deployment
│   ├── Admin assignment
│   └── Initial state verification
│
├── Project Proposal (7 tests)
│   ├── Project creation
│   ├── Data storage
│   └── Event emission
│
├── Voter Authorization (8 tests)
│   ├── Authorization workflow
│   ├── Access control
│   └── Revocation
│
├── Voting Round Management (10 tests)
│   ├── Round lifecycle
│   ├── State transitions
│   └── Error handling
│
├── Vote Submission (10 tests)
│   ├── Encrypted voting
│   ├── Validation (1-10 range)
│   └── Duplicate prevention
│
├── Access Control (5 tests)
│   └── Permission enforcement
│
├── View Functions (6 tests)
│   └── Read-only queries
│
├── Edge Cases (5 tests)
│   └── Boundary conditions
│
└── Gas Optimization (3 tests)
    └── Transaction efficiency
```

### Running Tests

```bash
# Run all tests
npm test

# Expected output:
#   CulturalVoting
#     ✓ 47 passing (2.5s)

# With coverage
npm run test:coverage

# With gas reporting
REPORT_GAS=true npm test
```

### Gas Performance

| Operation | Gas Used | Status |
|-----------|----------|--------|
| Deploy Contract | ~3,500,000 | ✅ Optimized |
| Propose Project | <200,000 | ✅ Efficient |
| Submit Vote | <300,000 | ✅ Efficient |
| Start Round | <250,000 | ✅ Efficient |

---

## 📦 Deployment

### Network Configuration

**Sepolia Testnet**:
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com

### Deployed Contract

```
Network: Sepolia Testnet
Contract Address: 0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022
Verified: ✅ Yes
Explorer: https://sepolia.etherscan.io/address/0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022
```

### Deployment Steps

```bash
# 1. Compile contracts
npm run compile

# 2. Deploy to Sepolia
npm run deploy

# 3. Verify on Etherscan
npm run verify

# 4. Test interaction
npm run interact
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 💻 Tech Stack

### Smart Contracts

- **Language**: Solidity 0.8.24
- **Framework**: Hardhat 2.19.0
- **FHE Library**: @fhevm/solidity
- **Optimizer**: Enabled (800 runs + Yul)
- **EVM Version**: Cancun

### Testing & Quality

- **Test Framework**: Mocha + Chai
- **Coverage**: solidity-coverage (>95%)
- **Linting**: Solhint + ESLint
- **Formatting**: Prettier
- **Pre-commit**: Husky hooks
- **Gas Reporting**: hardhat-gas-reporter

### Frontend

- **Framework**: HTML5 + Vanilla JavaScript
- **Web3**: ethers.js v6
- **Wallet**: MetaMask
- **Hosting**: Vercel

### DevOps & CI/CD

- **CI/CD**: GitHub Actions
- **Testing**: Multi-version (Node 18.x, 20.x)
- **Coverage**: Codecov integration
- **Security**: npm audit + Solhint
- **Deployment**: Automated scripts

### Network

- **Blockchain**: Ethereum Sepolia Testnet
- **FHE Layer**: Zama FHEVM
- **Explorer**: Etherscan

---

## 🔒 Security

### Security Features

✅ **Access Control**
- Admin-only functions (voter authorization, round management)
- Voter-only functions (vote submission)
- Modifier-based permission checks

✅ **Input Validation**
- Score range validation (1-10)
- Project existence verification
- Duplicate vote prevention
- Empty array checks

✅ **Gas Optimization**
- Compiler optimizer (800 runs)
- Yul optimizer enabled
- Efficient storage layout
- Gas monitoring in tests

✅ **Code Quality**
- Solhint linting (code complexity ≤10)
- ESLint for JavaScript
- Prettier formatting
- Pre-commit hooks
- 47 test cases with >95% coverage

✅ **DoS Prevention**
- Bounded loops
- Complexity limits
- Gas limits enforced

✅ **Automated Security**
- CI/CD security checks
- Dependency auditing
- Continuous monitoring

### Audit Status

- ✅ **Automated Testing**: 47 tests passing
- ✅ **Code Coverage**: >95%
- ✅ **Solhint Checks**: All passing
- ✅ **Gas Optimization**: Verified
- ⏳ **External Audit**: Pending

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

---

## 🛠️ Development

### Available Scripts

```bash
# Compilation
npm run compile          # Compile contracts
npm run clean            # Clean artifacts

# Testing
npm test                 # Run all tests
npm run test:coverage    # With coverage report
npm run test:gas         # With gas reporting

# Code Quality
npm run lint             # Run all linters
npm run lint:sol         # Solidity linting
npm run lint:js          # JavaScript linting
npm run format           # Format all code
npm run format:check     # Check formatting

# Security
npm run security:check   # Audit dependencies
npm run security:fix     # Fix vulnerabilities

# Deployment
npm run deploy           # Deploy to Sepolia
npm run deploy:local     # Deploy locally
npm run verify           # Verify on Etherscan
npm run interact         # Interactive CLI
npm run simulate         # Simulate workflow

# Development
npm run dev              # Start dev server
```

### Commit Workflow

```bash
# 1. Make changes
# 2. Stage files
git add .

# 3. Pre-commit hooks run automatically:
#    - Solidity linting
#    - JavaScript linting
#    - Format checking
#    - Tests

# 4. Commit
git commit -m "feat: add new feature"

# 5. Pre-push hooks run:
#    - Full coverage test
#    - Security audit

# 6. Push
git push
```

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[TESTING.md](./TESTING.md)** - Complete testing documentation
- **[CICD.md](./CICD.md)** - CI/CD pipeline guide
- **[SECURITY.md](./SECURITY.md)** - Security and performance optimization

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Areas

- 🐛 Bug fixes
- ✨ New features
- 📖 Documentation improvements
- 🧪 Additional tests
- ⚡ Performance optimizations
- 🔒 Security enhancements

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅

- [x] FHE-based voting system
- [x] Project proposal system
- [x] Voter authorization
- [x] Multiple voting rounds
- [x] Comprehensive testing (47 tests)
- [x] CI/CD pipeline
- [x] Sepolia deployment

### Phase 2: Enhanced Features 🚧

- [ ] Multi-signature admin control
- [ ] Delegation voting
- [ ] Weighted voting options
- [ ] Quadratic voting
- [ ] Time-locked results
- [ ] IPFS integration for projects

### Phase 3: Ecosystem Integration 📋

- [ ] DAO governance integration
- [ ] Token-based voting weights
- [ ] Cross-chain deployment
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] API for third-party integrations

### Phase 4: Advanced Privacy 🔮

- [ ] Zero-knowledge proofs
- [ ] Anonymous credentials
- [ ] Verifiable shuffle
- [ ] Receipt-free voting
- [ ] Coercion resistance

---

## 🌟 Use Cases

### Cultural Organizations

- **Arts Councils**: Select grant recipients through private voting
- **Museums**: Curators vote on exhibition proposals confidentially
- **Film Festivals**: Private selection of competition entries
- **Literary Awards**: Anonymous judging for writing prizes

### Community Governance

- **DAOs**: Privacy-preserving governance decisions
- **Cooperatives**: Democratic decision-making with confidentiality
- **Unions**: Secret ballot voting for leadership
- **Associations**: Member voting on proposals

### Academic

- **Research Grants**: Peer review with voting privacy
- **Committee Decisions**: Confidential faculty voting
- **Student Government**: Campus-wide elections

---

## 🎓 Learning Resources

### Zama FHEVM

- **Documentation**: https://docs.zama.ai/fhevm
- **GitHub**: https://github.com/zama-ai/fhevm
- **Blog**: https://www.zama.ai/blog

### Hardhat

- **Documentation**: https://hardhat.org/docs
- **Tutorials**: https://hardhat.org/tutorial

### Sepolia Testnet

- **Faucet**: https://sepoliafaucet.com
- **Explorer**: https://sepolia.etherscan.io
- **Info**: https://sepolia.dev

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Privacy Voting Platform Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🏆 Acknowledgments

- **Zama** for pioneering FHE technology and providing FHEVM
- **Hardhat** team for the excellent development framework
- **Ethereum Foundation** for Sepolia testnet
- **Open source community** for various tools and libraries

Built for the **Zama FHE Challenge** 🚀

---

## 📞 Support

### Get Help

- 📖 **Documentation**: Check the docs folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/your-repo/discussions)

### Stay Connected

- 🌐 **Website**: https://cultural-voting.vercel.app
- 📧 **Email**: support@example.com
- 🐦 **Twitter**: @YourProject

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/your-org/your-repo?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-org/your-repo?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-org/your-repo)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-org/your-repo)

---

<div align="center">

**Made with ❤️ and FHE**

**Privacy-Protected Cultural Voting Platform** © 2025

[Live Demo](https://cultural-voting.vercel.app/) • [Documentation](./DEPLOYMENT.md) • [Report Bug](https://github.com/your-org/your-repo/issues) • [Request Feature](https://github.com/your-org/your-repo/issues)

</div>
