# Cultural Voting Platform - Deployment Guide

Complete deployment documentation for the Privacy-Protected Cultural Voting System.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment Process](#deployment-process)
- [Contract Verification](#contract-verification)
- [Deployment Information](#deployment-information)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the complete deployment process for the Cultural Voting Platform smart contract using Hardhat. The platform leverages Fully Homomorphic Encryption (FHE) for privacy-preserving voting.

### Technology Stack

- **Framework**: Hardhat v2.19.0
- **Solidity**: v0.8.24
- **FHE Library**: @fhevm/solidity v0.5.0
- **Network**: Ethereum Sepolia Testnet
- **Verification**: Etherscan API

---

## Prerequisites

### Required Software

- Node.js v16.0 or higher
- npm or yarn package manager
- Git

### Required Accounts

1. **Ethereum Wallet**
   - MetaMask or similar Web3 wallet
   - Private key for deployment
   - Funded with Sepolia ETH (0.1+ ETH recommended)

2. **Etherscan Account**
   - Sign up at: https://etherscan.io
   - Generate API key at: https://etherscan.io/myapikey

3. **RPC Provider** (Optional but recommended)
   - Infura: https://infura.io
   - Alchemy: https://alchemy.com
   - Or use public RPC: https://rpc.sepolia.org

### Get Testnet ETH

For Sepolia testnet deployment, obtain test ETH from faucets:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd privacy-voting-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Hardhat and toolbox
- FHE Solidity library
- ethers.js v6
- All required plugins

### 3. Verify Installation

```bash
npx hardhat --version
```

Expected output: `2.19.0` or higher

---

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### 2. Configure .env File

Edit `.env` with your actual values:

```env
# Your wallet private key (KEEP SECURE - DO NOT SHARE)
PRIVATE_KEY=0x1234567890abcdef...

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Etherscan API key for verification
ETHERSCAN_API_KEY=ABC123XYZ...
```

**Security Warning**: Never commit the `.env` file to version control!

### 3. Verify Configuration

Test your configuration:

```bash
npx hardhat accounts
```

This should display the deployer address derived from your private key.

---

## Deployment Process

### Step 1: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 2: Run Local Simulation (Optional)

Test the full workflow locally before mainnet deployment:

```bash
npm run simulate
```

This will:
- Deploy to local Hardhat network
- Simulate complete voting workflow
- Verify all contract functions
- Display results

### Step 3: Deploy to Sepolia

```bash
npm run deploy
```

**Deployment Script Output:**

```
============================================================
Starting Cultural Voting Platform Deployment
============================================================

📋 Deployment Configuration:
------------------------------------------------------------
Network: sepolia
Deployer address: 0x1234...
Deployer balance: 0.5 ETH
------------------------------------------------------------

🚀 Deploying CulturalVoting Contract...
⏳ Contract deployment in progress...

✅ Deployment Successful!
============================================================
Contract Address: 0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022
Transaction Hash: 0xabcd1234...
Deployer: 0x1234...
Network: sepolia
Block Number: 5234567
============================================================
```

### Step 4: Save Deployment Information

Deployment information is automatically saved to:
```
deployments/sepolia.json
```

Example content:
```json
{
  "network": "sepolia",
  "contractAddress": "0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022",
  "deployer": "0x1234567890abcdef1234567890abcdef12345678",
  "deploymentTime": "2025-01-15T10:30:00.000Z",
  "transactionHash": "0xabcd1234...",
  "blockNumber": 5234567,
  "admin": "0x1234567890abcdef1234567890abcdef12345678",
  "initialRound": "1",
  "compiler": {
    "version": "0.8.24",
    "optimizer": true,
    "runs": 200
  }
}
```

---

## Contract Verification

Verify your deployed contract on Etherscan:

```bash
npm run verify
```

**Verification Output:**

```
============================================================
Contract Verification Script
============================================================

📋 Network: sepolia
📄 Contract Address: 0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022

🔍 Starting Etherscan Verification...
------------------------------------------------------------
Successfully submitted source code for contract
contracts/CulturalVoting.sol:CulturalVoting at 0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022
for verification on the block explorer. Waiting for verification result...

✅ Verification Successful!
============================================================
Contract verified on Etherscan

🔗 View on Etherscan:
https://sepolia.etherscan.io/address/0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022#code
============================================================
```

---

## Deployment Information

### Current Deployment

**Network:** Sepolia Testnet
**Contract Address:** `0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022`
**Block Explorer:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022)

### Network Details

| Parameter | Value |
|-----------|-------|
| Network Name | Sepolia Testnet |
| Chain ID | 11155111 |
| Currency | SepoliaETH |
| RPC URL | https://rpc.sepolia.org |
| Block Explorer | https://sepolia.etherscan.io |

### Contract Information

| Property | Value |
|----------|-------|
| Contract Name | CulturalVoting |
| Solidity Version | 0.8.24 |
| Optimizer | Enabled (200 runs) |
| License | MIT |
| FHE Library | @fhevm/solidity v0.5.0 |

### Deployment Costs

Estimated gas costs for deployment:

| Operation | Gas Used | Cost (at 30 gwei) |
|-----------|----------|-------------------|
| Contract Deployment | ~3,500,000 | ~0.105 ETH |
| Contract Verification | Free | Free |

---

## Post-Deployment

### 1. Interact with Contract

Use the interactive script to manage the platform:

```bash
npm run interact
```

This provides a menu-driven interface for:
- Viewing contract status
- Proposing projects
- Authorizing voters
- Starting voting rounds
- Submitting votes
- Viewing results

### 2. Frontend Integration

Update your frontend with the deployed contract address:

```javascript
const CONTRACT_ADDRESS = "0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022";
const NETWORK = "sepolia";
```

### 3. Test Contract Functions

Example interaction using Hardhat console:

```bash
npx hardhat console --network sepolia
```

```javascript
const contract = await ethers.getContractAt(
  "CulturalVoting",
  "0xd88E2D38Bceb34781f403b233E0f1a5a5E3A1022"
);

// Check admin
const admin = await contract.admin();
console.log("Admin:", admin);

// Get current round
const round = await contract.currentVotingRound();
console.log("Current Round:", round.toString());
```

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Funds

**Error:** `sender doesn't have enough funds to send tx`

**Solution:**
- Get more Sepolia ETH from faucets
- Check balance: `npx hardhat run scripts/checkBalance.js --network sepolia`

#### 2. Invalid Private Key

**Error:** `invalid private key`

**Solution:**
- Ensure private key starts with `0x`
- Check for spaces or extra characters
- Verify key in `.env` file

#### 3. Network Connection Issues

**Error:** `could not detect network`

**Solution:**
- Check RPC URL in `.env`
- Try alternative RPC providers (Infura, Alchemy)
- Verify internet connection

#### 4. Contract Already Deployed

**Error:** `contract already deployed at this address`

**Solution:**
- This is informational only
- Use existing deployment or deploy to different network

#### 5. Verification Failed

**Error:** `Etherscan verification failed`

**Solution:**
- Wait 1-2 minutes after deployment
- Verify API key is correct
- Check network is supported
- Run verification again: `npm run verify`

### Get Help

If you encounter issues not covered here:

1. Check Hardhat documentation: https://hardhat.org/docs
2. Review contract events on Etherscan
3. Test on local network first: `npm run simulate`
4. Verify configuration in `hardhat.config.js`

---

## Security Considerations

### Private Key Management

- **Never** commit `.env` file to Git
- Store private keys securely (hardware wallet recommended for mainnet)
- Use separate wallets for testing and production
- Rotate keys periodically

### Contract Security

- Contract has been designed with security best practices
- Admin controls are centralized (as intended for this use case)
- FHE encryption ensures vote privacy
- Consider third-party audit before mainnet deployment

### Network Security

- Always test on testnet first
- Verify contract address before interacting
- Double-check transaction details in wallet
- Use reputable RPC providers

---

## Deployment Checklist

Before mainnet deployment, verify:

- [ ] All contracts compile without errors
- [ ] Simulation runs successfully
- [ ] Contract verified on testnet explorer
- [ ] All functions tested via interaction script
- [ ] Frontend integration tested
- [ ] Gas costs estimated and acceptable
- [ ] Security audit completed (for mainnet)
- [ ] Documentation updated
- [ ] Backup of deployment keys secured
- [ ] Team trained on contract operations

---

## Next Steps

After successful deployment:

1. **Configure Platform**
   - Set up initial authorized voters
   - Define voting round parameters
   - Establish project proposal guidelines

2. **Launch Frontend**
   - Deploy frontend to hosting platform
   - Connect to deployed contract
   - Test end-to-end user flow

3. **Monitor Operations**
   - Track contract events on Etherscan
   - Monitor gas usage and costs
   - Collect user feedback

4. **Governance**
   - Document admin procedures
   - Establish voting round schedules
   - Create project evaluation criteria

---

## Additional Resources

- **Hardhat Documentation**: https://hardhat.org
- **ethers.js Documentation**: https://docs.ethers.org
- **Zama fhEVM Docs**: https://docs.zama.ai/fhevm
- **Sepolia Testnet**: https://sepolia.dev
- **Etherscan**: https://etherscan.io

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Maintainer:** Development Team
