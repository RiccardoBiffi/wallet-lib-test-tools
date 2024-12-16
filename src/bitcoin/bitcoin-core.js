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

const fetch = require('cross-fetch')
const crypto = require('crypto')
const bitcoin = require('bitcoinjs-lib');

class BitcoinCore {
  constructor(config = {}) {
    this._network = config.network || 'regtest'
    this._defaultWallet = 'main.dat'
    this._node_uri = 'http://user:password@127.0.0.1:18443/wallet/' + this._defaultWallet || config.uri
  }

  async init() {
    //await this.unloadAllWallets()
    await this.startWallet()
    const addr = await this.getNewAddress()
    if (addr.error) {
      console.log(addr)
      throw new Error('failed to create addr')
    }

    this._miningAddress = addr.result
  }

  async startWallet() {
    const createWallet = await this.createWallet()
    if (createWallet.error?.code === -4) {
      await this.loadWallet()
    }
  }

  createWallet(opts = {}) {
    return this._apiCall('createwallet', [opts.filename || this._defaultWallet])
  }

  listWallets() {
    return this._apiCall('listwallets', [])
  }

  listUnspent(opts = {}) {
    return this._apiCall('listunspent', [opts.minconf || 1, opts.maxconf || 9999999, opts.addresses])
  }

  loadWallet(opts = {}) {
    return this._apiCall('loadwallet', [opts.filename || this._defaultWallet])
  }

  unloadWallet(opts = {}) {
    return this._apiCall('unloadwallet', [opts.filename || this._defaultWallet])
  }

  getBalance(opts) {
    return this._apiCall('getbalance', opts)
  }

  getNewAddress(opts) {
    return this._apiCall('getnewaddress', opts)
  }

  createRawTransaction(opts) {
    return this._apiCall('createrawtransaction', [opts.inputs, opts.outputs, opts.locktime, opts.replaceable])
  }

  signRawTransactionWithWallet(opts) {
    return this._apiCall('signrawtransactionwithwallet', [opts.hexstring, opts.prevtxs, opts.sighashtype || 'ALL'])
  }

  sendRawTransaction(opts) {
    return this._apiCall('sendrawtransaction', [opts.hexstring, opts.maxfeerate || 0.1])
  }

  sendToAddress(opts) {
    return this._apiCall('sendtoaddress', [opts.address, opts.amount])
  }

  async mine(opts = {}) {
    const params = {
      address: opts.address || this._miningAddress,
      nBlocks: opts.blocks || 1
    }

    return this._apiCall('generatetoaddress', [params.nBlocks, params.address])
  }

  addressToScriptHash(address) {
    const network = this._network === 'mainnet' ?
      bitcoin.networks.bitcoin : bitcoin.networks.regtest
    let script = bitcoin.address.toOutputScript(address, network)
    let hash = bitcoin.crypto.sha256(script)
    let reversedHash = hash.reverse()
    return reversedHash.toString('hex')
  }

  async _apiCall(method, params) {
    const body = {
      jsonrpc: '1.0',
      id: `${method}_${(Math.random() * 10e20).toFixed()}`,
      method,
      params: params || []
    }
    const response = await fetch(this._node_uri, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    let data
    try {
      data = await response.json()
    } catch (err) {
      console.log(`Failed API call: ${method}`, err)
      return
    }
    return data
  }
}

module.exports = BitcoinCore
