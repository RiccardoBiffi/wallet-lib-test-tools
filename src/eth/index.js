const { Web3 } = require('web3')
const { hdkey : { EthereumHDKey: ethhd } } = require('@ethereumjs/wallet')
const fs = require('fs')

class EthTester { 

  constructor(config = {}) {

    this.config = config
    this.web3 = new Web3(config.uri || 'http://127.0.0.1:8545/')
    this.privateKey = config.privateKey || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    this.tokenAddr = '0xb719422a0a484025c1a22a8deeafc67e81f43cfd'
    this.account = this.web3.eth.accounts.wallet.add(this.privateKey);
  }

  async init(){

    const res = await this.web3.eth.getBlockNumber()
    if(typeof res !== 'bigint') throw new Error('web3 not ready') 
    
  }

  mine(opts = {}) {
    return new Promise((resolve,reject) => {
      const blocks = '0x'+(opts.blocks || 1).toString(16)
      this.web3.provider.send({
        jsonrpc: '2.0', 
        method: 'hardhat_mine',
        params: [blocks.toString()], 
        id: new Date().getTime()
      },(err,data)=>{
        if(err) return reject(err)
        resolve(data)
      }) 
    })
  }

  async sendToAddress(opts) {
    const from =  this.account[0].address
    const txCount = await this.web3.eth.getTransactionCount(from)
    const tx = { 
      from,
      to: opts.address, 
      value: this.web3.utils.toWei(opts.amount, 'ether'),
      nonce: txCount
    };
    return this.web3.eth.sendTransaction(tx);
  }


  /**
  * Send tokens to an address
  * @param {string} opts.address ETH address
  * @param {number} opts.amount amount of tokens to send
  */
  async sendToken(opts) {
    const abi = this._getERC20ABI()
    const contract = new this.web3.eth.Contract(abi, this.tokenAddr)
    return contract.methods.transfer(opts.address, opts.amount).send({
      from: this.account[0].address,
      gas:500000
    })
  }

  async getTokenBalance() {

  }


  async getNewAddress(){
    return this.account[0].address
  }


  _getERC20ABI() {
    if(this._contractAbi) return this._contractAbi
    const contract = JSON.parse(fs.readFileSync(__dirname+'/artifacts/contracts/erc20.sol/Token.json', 'utf8'))
    this._contractAbi = contract.abi
    return this._contractAbi
  }

}


async function main() {
  const w = new EthTester()
  await w.init()
  const token = await w.sendToken({
    address:"0xb719422a0a484025c1a22a8deeafc67e81f43cfd",
    amount: 20
  })
  console.log(token)
}



module.exports = EthTester
