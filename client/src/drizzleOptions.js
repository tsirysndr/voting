import VotingFactory from './contracts/VotingFactory.json'

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [VotingFactory],
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
  }
}

export default options
