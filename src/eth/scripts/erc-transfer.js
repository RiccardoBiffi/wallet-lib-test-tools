
const { Web3 } = require('web3')

const addr = process.env.ADDR || "0xb89c31da0a0d796240dc99e551287f16145ce7a3"
const { contractAddress } = require('../erc20.config.json')
const amount = process.env.AMT ||  1000
async function main() {

  const Token = await ethers.getContractFactory("Token");
  console.log(`getting contract at: ${contractAddress}`)
  const contract = await Token.attach(contractAddress);

  console.log(`sending token to Address: ${addr} Amount:  ${amount}`)
  await contract.transfer(addr,amount);

  const bal = await contract.balanceOf(addr)
  
  console.log(`balance of ${addr} is ${bal}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

