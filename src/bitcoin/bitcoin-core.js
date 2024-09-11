const fetch = require('cross-fetch')

class BitcoinCore {
  constructor (config = {}) {
    this._network = config.network || 'regtest'
    this._defaultWallet = 'main.dat'
    this._node_uri = 'http://user:password@127.0.0.1:18443/wallet/' + this._defaultWallet || config.uri
  }

  async init () {
    await this.startWallet()
    const addr = await this.getNewAddress()
    if (addr.error) {
      console.log(addr)
      throw new Error('failed to create addr')
    }

    this._miningAddress = addr.result
  }

  async startWallet () {
    const createWallet = await this.createWallet()
    if (createWallet.error?.code === -4) {
      await this.loadWallet()
    }
  }

  async _apiCall (method, params) {
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

  getNewAddress (opts) {
    return this._apiCall('getnewaddress', opts)
  }

  createWallet (opts = {}) {
    return this._apiCall('createwallet', [opts.filename || this._defaultWallet])
  }

  sendToAddress (opts) {
    return this._apiCall('sendtoaddress', [opts.address, opts.amount])
  }

  loadWallet (opts = {}) {
    return this._apiCall('loadwallet', [opts.filename || this._defaultWallet])
  }

  async mine (opts = {}) {
    const params = {
      address: opts.address || this._miningAddress,
      nBlocks: opts.blocks || 1
    }

    return this._apiCall('generatetoaddress', [params.nBlocks, params.address])
  }
}

module.exports = BitcoinCore
