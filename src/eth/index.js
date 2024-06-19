const { Web3 } = require('web3')
const hre = require("hardhat")

class EthTester { 

  constructor(config = {}) {

    this.config = config
    this.web3 = new Web3(config.uri || 'http://127.0.0.1:8545/')


    hre.web3 = this.web3
  }

  async init(){

    const res = await this.web3.eth.getBlockNumber()

    console.log(res)
    if(typeof res !== 'bigint') throw new Error('web3 not ready') 
  }

  mine(opts = {}) {
    return new Promise((resolve,reject) => {
      const blocks = '0x'+(opts.blocks || 1).toString(16)
      console.log(blocks)
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

}


async function main() {
  const w = new EthTester()
  await w.init()
  await w.mine()
  
}

main()

module.exports = EthTester
