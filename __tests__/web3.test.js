const Ganache = require('ganache-core');
const Web3 = require('web3');

const { contractABI } = require('../web3/web3');

describe('Web3 tests', () => {
  let contractInstance;
  let accounts;
  let provider;
  let web3;
  beforeAll(async () => {
    try {
      provider = Ganache.provider();
      web3 = new Web3(provider);
      accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(contractABI, accounts[0]);
      console.log(accounts[0]);
    } catch (err) {
      throw err;
    }
  });

  afterAll(async () => {
    // clean up provider
    provider.stop();
  });

  it('should do something', done => {
    done();
  });
  // describe('addCredential', () => {
  //   const credential = {
  //     credName: 'Masters in test',
  //     ownerName: 'Test Person',
  //     description: 'Test has done everything to test',
  //     type: 'Masters',
  //     studentEmail: 'test@test.com',
  //     imageUrl: 'img',
  //     criteria: 'testCriteria',
  //     issuedOn: '10/30/1991',
  //     schoolId: 3
  //   }

  //   const credHash = web3.utils.sha3(JSON.stringify(credential));
  //   it('should add new credential', async () => {

  //     const add = await contract.methods.addCredential(credHash)
  //     console.log(add)
  //   })
  // })
});
