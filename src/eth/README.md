# ETH test tools
# Setting up a Local Ethereum Network with Hardhat

This README guides you through setting up a local Ethereum network using Hardhat, deploying an ERC20 token, and performing token and ETH transfers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Setting Up the Local Network](#setting-up-the-local-network)
5. [Deploying the ERC20 Token](#deploying-the-erc20-token)
6. [Performing ERC20 Token Transfers](#performing-erc20-token-transfers)
7. [Performing ETH Transfers](#performing-eth-transfers)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v12.0.0 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Project Structure

```
.
├── contracts/
│   └── YourERC20Token.sol
├── scripts/
│   ├── deployer.js
│   ├── erc-transfer.js
│   └── eth-transfer.js
├── hardhat.config.js
└── README.md
```

## Setting Up the Local Network

To start your local Ethereum network:

```
npx hardhat node
```

This command will start a local Ethereum network and display a list of available accounts with their private keys.

Keep this terminal window open while working with your local network.

## Deploying the ERC20 Token

To deploy your ERC20 token to the local network:

```
npx hardhat run scripts/deployer.js --network localhost
```

This script will deploy your ERC20 token and output the contract address. Make note of this address for future use.

## Performing ERC20 Token Transfers

To transfer ERC20 tokens:

```
ADDR=<recipient-address> AMT=<amount> npx hardhat run ./scripts/erc-transfer.js --network localhost
```

Replace `<recipient-address>` with the Ethereum address you want to send tokens to, and `<amount>` with the number of tokens to send.

Example:
```
ADDR=0x6122cfcd13692dfbe876e513109c5b653c4c2399 AMT=1222 npx hardhat run ./scripts/erc-transfer.js --network localhost
```

## Performing ETH Transfers

To transfer ETH:

```
ADDR=<recipient-address> AMT=<amount> npx hardhat run ./scripts/eth-transfer.js --network localhost
```

Replace `<recipient-address>` with the Ethereum address you want to send ETH to, and `<amount>` with the amount of ETH to send.

Example:
```
ADDR=0x6122cfcd13692dfbe876e513109c5b653c4c2399 AMT=1 npx hardhat run ./scripts/eth-transfer.js --network localhost
```

## Troubleshooting

1. **Network Connection Issues**: Ensure that your Hardhat node is running in a separate terminal window before executing any scripts.

2. **Insufficient Funds**: The local network provides accounts with ETH. If you encounter insufficient funds errors, check the balance of the account you're using to send transactions.

3. **Contract Address Errors**: If you're getting errors related to contract addresses, ensure you're using the correct address of the deployed ERC20 token contract.

4. **Script Execution Errors**: Make sure all required environment variables (ADDR, AMT) are set correctly when running the transfer scripts.

For more detailed information, refer to the [Hardhat documentation](https://hardhat.org/getting-started/).
