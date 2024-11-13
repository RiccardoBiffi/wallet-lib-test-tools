// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

const addr = process.env.ADDR || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const contracts = require('../erc20.config.json')
const amount = process.env.AMT || 1

async function main () {
  let network = (await ethers.provider.getNetwork()).name
  if (network === 'localhost') network = 'hardhat'
  const { contractAddress } = contracts[network]
  console.log('Running on network', network.name)
  const Token = await ethers.getContractFactory('Token')
  console.log(`getting contract at: ${contractAddress}`)
  const contract = await Token.attach(contractAddress)

  console.log(`sending token to Address: ${addr} Amount:  ${amount}`)
  const t = await contract.transfer(addr, amount)
  console.log(t)

  const bal = await contract.balanceOf(addr)

  console.log(`balance of ${addr} is ${bal}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
