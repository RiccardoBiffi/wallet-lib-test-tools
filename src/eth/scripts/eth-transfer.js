const { ethers } = require('hardhat')

const addr = process.env.ADDR || '0xb89c31da0a0d796240dc99e551287f16145ce7a3'
const amount = process.env.AMT || 1000
async function main () {
  console.log(`sending token to Address: ${addr} Amount:  ${amount}`)
  const signer = await ethers.getSigners()

  const tx = await signer[0].sendTransaction({
    to: addr,
    value: ethers.parseUnits(amount, 'ether')
  })

  console.log('------')
  console.log('SENT:\n\n')
  console.log(tx)
  console.log('------')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
