const fs = require('fs')
async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Token = await ethers.getContractFactory("Token");
  const contract = await Token.deploy();

  console.log("Contract deployed at:", contract.target);
  fs.writeFileSync('./erc20.config.json', JSON.stringify({ 
    contractAddress : contract.target,
  }, null, 2))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
