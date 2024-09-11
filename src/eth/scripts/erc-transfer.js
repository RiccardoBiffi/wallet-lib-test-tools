
const { Web3 } = require('web3')

const addr = process.env.ADDR || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const { contractAddress } = require('../erc20.config.json')
const amount = process.env.AMT ||  1000
async function main() {

  const Token = await ethers.getContractFactory("Token");
  console.log(`getting contract at: ${contractAddress}`)
  const contract = await Token.attach(contractAddress);

  console.log(`sending token to Address: ${addr} Amount:  ${amount}`)
  const t = await contract.transfer(addr,amount);
  console.log(t)

  const bal = await contract.balanceOf(addr)
  
  console.log(`balance of ${addr} is ${bal}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

