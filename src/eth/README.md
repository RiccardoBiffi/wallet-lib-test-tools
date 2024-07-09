# ETH test tools

Set of tools for running your own local ETH network with ERC20 support:

## Features: 

** Start local network**
```bash
npx hardhat node
```


**Deploy ERC20 token**
Start a local dev mode: 

Update any configuration of the ERC20 dev contract
```
contracts/erc20.sol
```
Build and deploy
```
npx hardhat build
npx hardhat run scripts/deploy
```

**ERC20 transfer**
update variables in ./scripts/erc-transfer.js
```
npx hardhat run script/erc-transfer
```
