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

const { Web3 } = require('web3')
const fs = require('fs')
const { Promise } = require('node-fetch')
const chainIdMap = require('./chainid-map.json')


class EthTester {
  constructor (config = {}) {
    this.config = config
    this.web3 = new Web3(config.uri || 'http://127.0.0.1:8545/')
    this.privateKey = config.privateKey || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    this.account = this.web3.eth.accounts.wallet.add(this.privateKey)
    if(config.tokenConfig) {
      this.tokenConfig = config.tokenConfig
    }

  }

  async init () {
    const res = await this.web3.eth.getBlockNumber()
    if (typeof res !== 'bigint') throw new Error('web3 not ready')
    if(!this.tokenConfig) {
      const networkId = await this.web3.eth.net.getId(); 
      const chainName = chainIdMap[networkId]
      if(!chainName) throw new Error('invalid chain id')
      this.tokenConfig = require('./erc20.config.json')[chainName]
    }
  }

  mine (opts = {}) {
    return new Promise((resolve, reject) => {
      const blocks = '0x' + (opts.blocks || 1).toString(16)
      this.web3.provider.send({
        jsonrpc: '2.0',
        method: 'hardhat_mine',
        params: [blocks.toString()],
        id: new Date().getTime()
      }, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }

  async sendToAddress (opts) {
    const from = this.account[0].address
    const txCount = await this.web3.eth.getTransactionCount(from)
    const tx = {
      from,
      to: opts.address,
      value: this.web3.utils.toWei(opts.amount, 'ether'),
      nonce: txCount
    }
    return this.web3.eth.sendTransaction(tx)
  }

  /**
  * Send tokens to an address
  * @param {string} opts.address ETH address
  * @param {number} opts.amount amount of tokens to send
  */
  sendToken (opts) {
    return new Promise(async (resolve, reject) => {
      const abi = this._getERC20ABI()
      const from = this.account[0].address
      const contract = new this.web3.eth.Contract(abi, this.tokenConfig.contractAddress)
      const send = contract.methods.transfer(opts.address, opts.amount).send({
        from,
        gas: 500000
      })
      send.on('receipt', (d) => {
        resolve(d)
      })
      send.on('error', reject)
    })
  }

  async getNewAddress () {
    return this.account[0].address
  }

  _getERC20ABI () {
    if (this._contractAbi) return this._contractAbi
    const contract = JSON.parse(fs.readFileSync(__dirname + '/artifacts/contracts/erc20.sol/Token.json', 'utf8'))
    this._contractAbi = contract.abi
    return this._contractAbi
  }
}
module.exports = EthTester
