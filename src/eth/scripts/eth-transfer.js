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
