# CI/CD Documentation

Complete CI/CD pipeline documentation for the Privacy-Protected Cultural Voting Platform.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Automated Testing](#automated-testing)
- [Code Quality Checks](#code-quality-checks)
- [Coverage Reporting](#coverage-reporting)
- [Setup Instructions](#setup-instructions)
- [Workflow Configuration](#workflow-configuration)

---

## Overview

This project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline automatically runs tests, code quality checks, and security audits on every push and pull request.

### Key Features

- ✅ **Automated Testing** on multiple Node.js versions (18.x, 20.x)
- ✅ **Code Quality Checks** with Solhint
- ✅ **Coverage Reporting** with Codecov integration
- ✅ **Security Audits** with npm audit
- ✅ **Deployment Simulation** testing
- ✅ **Multi-Platform** support (Linux)

---

## GitHub Actions Workflows

### Workflow File Location

```
.github/workflows/test.yml
```

### Trigger Events

The CI/CD pipeline runs automatically on:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Push to develop branch**
   ```bash
   git push origin develop
   ```

3. **Pull requests to main**
   ```bash
   # When creating a PR targeting main
   ```

4. **Pull requests to develop**
   ```bash
   # When creating a PR targeting develop
   ```

---

## Automated Testing

### Test Jobs

#### 1. Test on Node.js 18.x

Runs the complete test suite on Node.js 18:

```yaml
test-node-18:
  - Checkout code
  - Setup Node.js 18.x
  - Install dependencies
  - Run Solidity linter
  - Compile contracts
  - Run tests
  - Generate coverage
  - Upload to Codecov
```

#### 2. Test on Node.js 20.x

Runs the complete test suite on Node.js 20:

```yaml
test-node-20:
  - Checkout code
  - Setup Node.js 20.x
  - Install dependencies
  - Run Solidity linter
  - Compile contracts
  - Run tests
  - Generate coverage
  - Upload to Codecov
```

### Running Tests Locally

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with gas reporting
npm run test:gas
```

---

## Code Quality Checks

### Solidity Linting

The project uses **Solhint** for Solidity code quality checks.

#### Configuration File

`.solhint.json`:
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "code-complexity": ["error", 10],
    "compiler-version": ["error", ">=0.8.24"],
    "func-visibility": ["error", { "ignoreConstructors": true }],
    "max-line-length": ["error", 120],
    "named-parameters-mapping": "warn",
    "no-console": "off",
    "not-rely-on-time": "off"
  }
}
```

#### Running Linter

```bash
# Check Solidity code
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

### Ignored Files

`.solhintignore`:
```
**/artifacts
**/node_modules
**/cache
**/coverage
```

---

## Coverage Reporting

### Codecov Integration

The project uses **Codecov** to track test coverage over time.

#### Configuration

`codecov.yml`:
```yaml
coverage:
  precision: 2
  round: down
  range: "70...100"

  status:
    project:
      default:
        target: 80%
        threshold: 5%
```

#### Coverage Targets

- **Project Coverage**: 80% target
- **Patch Coverage**: 80% target
- **Acceptable Range**: 70-100%

#### Viewing Coverage

1. **Local Coverage Report**:
   ```bash
   npm run test:coverage

   # View HTML report
   open coverage/index.html
   ```

2. **Codecov Dashboard**:
   - Visit: `https://codecov.io/gh/YOUR_ORG/YOUR_REPO`
   - View coverage trends
   - Check file-level coverage
   - Review pull request coverage

---

## Setup Instructions

### 1. GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create develop branch**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

### 2. Configure Codecov

1. **Sign up at Codecov**:
   - Visit https://codecov.io
   - Sign in with GitHub
   - Authorize Codecov to access your repository

2. **Get Codecov Token**:
   - Go to repository settings in Codecov
   - Copy the CODECOV_TOKEN

3. **Add Secret to GitHub**:
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: (paste your token)
   - Click "Add secret"

### 3. Enable GitHub Actions

1. **Check Workflows**:
   - Go to repository → Actions tab
   - Verify workflows are detected

2. **First Run**:
   - Make a commit to main or develop
   - Check Actions tab for workflow execution

---

## Workflow Configuration

### Job Descriptions

#### 1. Code Quality Job

**Purpose**: Ensure code meets quality standards

**Steps**:
- Checkout code
- Setup Node.js
- Install dependencies
- Run Solidity linter
- Compile contracts
- Run security audit

**Command**:
```bash
npm run lint:sol
npm audit --audit-level=moderate
```

#### 2. Deployment Test Job

**Purpose**: Verify deployment scripts work correctly

**Steps**:
- Checkout code
- Setup Node.js
- Install dependencies
- Compile contracts
- Run deployment simulation
- Check artifacts

**Command**:
```bash
npm run simulate
```

#### 3. Summary Job

**Purpose**: Report overall CI/CD status

**Runs**: After all jobs complete

**Output**:
```
All CI/CD checks completed
Node 18 Tests: success
Node 20 Tests: success
Code Quality: success
Deployment Test: success
```

---

## CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────┐
│         Push to main/develop or PR          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Trigger GitHub     │
        │  Actions Workflow   │
        └─────────┬───────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│  Test Node 18 │   │  Test Node 20 │
│               │   │               │
│ • Lint        │   │ • Lint        │
│ • Compile     │   │ • Compile     │
│ • Test        │   │ • Test        │
│ • Coverage    │   │ • Coverage    │
└───────┬───────┘   └───────┬───────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ Code Quality  │   │  Deployment   │
│               │   │  Simulation   │
│ • Solhint     │   │               │
│ • Security    │   │ • Deploy Test │
│   Audit       │   │ • Artifacts   │
└───────┬───────┘   └───────┬───────┘
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
        ┌─────────────────┐
        │  Upload to      │
        │  Codecov        │
        └─────────┬───────┘
                  │
                  ▼
        ┌─────────────────┐
        │  Summary        │
        │  Report         │
        └─────────────────┘
```

---

## Best Practices

### 1. Commit Messages

Use conventional commits:
```bash
feat: add new voting feature
fix: resolve vote counting bug
docs: update README
test: add edge case tests
chore: update dependencies
```

### 2. Pull Request Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to GitHub**:
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request**:
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select base: `develop` or `main`
   - Wait for CI checks to pass
   - Request review

### 3. Monitoring CI/CD

**Check Status**:
- ✅ Green checkmark = All checks passed
- ❌ Red X = One or more checks failed
- 🟡 Yellow dot = Checks in progress

**View Details**:
- Click on check details
- Review logs for failures
- Fix issues and push again

---

## Troubleshooting

### Common Issues

#### Issue: Tests fail in CI but pass locally

**Cause**: Environment differences

**Solution**:
```bash
# Use same Node version as CI
nvm use 18  # or 20

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
npm test
```

#### Issue: Codecov upload fails

**Cause**: Missing or invalid token

**Solution**:
1. Verify CODECOV_TOKEN is set in GitHub Secrets
2. Check token is not expired
3. Ensure repository is authorized in Codecov

#### Issue: Linter errors

**Cause**: Code doesn't meet quality standards

**Solution**:
```bash
# Check what's wrong
npm run lint:sol

# Auto-fix if possible
npm run lint:sol:fix

# Manual fixes for remaining issues
```

#### Issue: Deployment simulation fails

**Cause**: Script errors or missing dependencies

**Solution**:
```bash
# Test locally first
npm run simulate

# Check logs for errors
# Fix issues in scripts/simulate.js
```

---

## Metrics and Reporting

### Coverage Badges

Add to README.md:
```markdown
[![codecov](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
```

### Build Status Badge

```markdown
[![Test Suite](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/test.yml)
```

---

## Security

### npm Audit

Automatically runs on every CI build:
```bash
npm audit --audit-level=moderate
```

### Dependency Updates

Keep dependencies updated:
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest (with care)
npm install <package>@latest
```

---

## Future Enhancements

### Planned Additions

- [ ] Automated deployment to testnet on merge to main
- [ ] Slither security analysis integration
- [ ] Mythril security scanning
- [ ] Gas optimization reporting
- [ ] Performance benchmarking
- [ ] Automated documentation generation

---

## Resources

- **GitHub Actions**: https://docs.github.com/en/actions
- **Codecov**: https://docs.codecov.com
- **Solhint**: https://github.com/protofire/solhint
- **Hardhat**: https://hardhat.org

---

**Last Updated**: 2025-10-28
**Version**: 1.0.0
**Maintainer**: Development Team
