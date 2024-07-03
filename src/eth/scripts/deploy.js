async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Token = await ethers.getContractFactory("Token");
  const contract = await Token.deploy();

  console.log("Contract deployed at:", contract.target);
  const contractAddress = contract.target
  const cx = await token.attach(contractAddress);

  const addr = "0xb89c31da0a0d796240dc99e551287f16145ce7a3"
  // Set a new message in the contract
  await cx.transfer(addr, 2);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
