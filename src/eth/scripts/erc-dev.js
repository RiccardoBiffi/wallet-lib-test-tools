
const { Web3 } = require('web3')

const addr = "0xb89c31da0a0d796240dc99e551287f16145ce7a3"
const amount = 1
async function main() {

  const contractAddr = "0xb719422a0a484025c1a22a8deeafc67e81f43cfd"
  const [deployer] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("Token");
  const contract = await Token.attach(contractAddr);

  // Set a new message in the contract
  await contract.transfer(addr,amount);

  const bal = await contract.balanceOf('0xcd27881c3c770a5206f96ec3856b7434dfbfa603')
  
  console.log(`balance of ${addr} is ${bal}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

