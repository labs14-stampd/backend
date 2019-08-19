const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
require('dotenv').config();

const rpcURL = process.env.INFURA;
const web3 = new Web3(rpcURL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
const account1 = process.env.ACCOUNT_1;

const txFunc = async data => {
	try {
		// Create transaction count
		const txCount = await web3.eth.getTransactionCount(account1);

		// Build the transaction
		const txObject = {
			nonce: txCount, // web3.utils.toHex(txCount)
			to: contractAddress,
			from: account1,
			value: 0,
			gasLimit: web3.utils.toHex(250000),
			gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),
			data
		};

		// Sign the transaction
		const tx = new Tx(txObject);
		tx.sign(privateKey);

		const serializedTx = tx.serialize();
		const raw = `0x${serializedTx.toString('hex')}`;

		// Broadcast the transaction
		const receipt = await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
			console.log('reciept', err, txHash);
		});
		console.log('receipt', receipt)
		return receipt.transactionHash;
	} catch (error) {
		console.log(error);
	}
};

const contractABI = [{
		"constant": false,
		"inputs": [{
			"name": "_credHash",
			"type": "bytes32"
		}],
		"name": "validateCredential",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [{
			"name": "_credHash",
			"type": "bytes32"
		}],
		"name": "addCredential",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{
			"name": "",
			"type": "bytes32"
		}],
		"name": "credentials",
		"outputs": [{
				"name": "contentHash",
				"type": "bytes32"
			},
			{
				"name": "valid",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{
			"name": "_credHash",
			"type": "bytes32"
		}],
		"name": "verifyCredential",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [{
			"name": "",
			"type": "address"
		}],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [{
			"name": "_credHash",
			"type": "bytes32"
		}],
		"name": "invalidateCredential",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [{
			"name": "_credHash",
			"type": "bytes32"
		}],
		"name": "removeCredential",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [{
			"name": "newOwner",
			"type": "address"
		}],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "credHash",
			"type": "bytes32"
		}],
		"name": "CredentialAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "credHash",
			"type": "bytes32"
		}],
		"name": "CredentialRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "credHash",
			"type": "bytes32"
		}],
		"name": "CredentialValidated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "credHash",
			"type": "bytes32"
		}],
		"name": "CredentialInvalidated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
]
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = {
	txFunc,
	contractABI,
	web3,
	contract
};