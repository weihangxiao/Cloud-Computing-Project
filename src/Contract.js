import Web3 from 'web3';

//TODO:将contract相关的初始化封装到一个文件里面
class Cntrct {
    constructor() {
        var web3;
		if (typeof web3 !== 'undefined') {
			web3 = new Web3(web3.currentProvider);
		} else {
			web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		}
		var abi = [[
			{
				"constant": false,
				"inputs": [
					{
						"name": "_name",
						"type": "string"
					},
					{
						"name": "_temp",
						"type": "uint256"
					},
					{
						"name": "_hasSymp",
						"type": "bool"
					},
					{
						"name": "date",
						"type": "string"
					}
				],
				"name": "addUser",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "_temp",
						"type": "uint256"
					},
					{
						"name": "_hasSymp",
						"type": "bool"
					},
					{
						"name": "date",
						"type": "string"
					}
				],
				"name": "updateRecord",
				"outputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "getUserCode",
				"outputs": [
					{
						"name": "",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "getUserRecord",
				"outputs": [
					{
						"components": [
							{
								"name": "temp",
								"type": "uint256"
							},
							{
								"name": "hasSymp",
								"type": "bool"
							},
							{
								"name": "date",
								"type": "string"
							},
							{
								"name": "total",
								"type": "uint256"
							},
							{
								"name": "counter",
								"type": "uint256"
							},
							{
								"name": "code",
								"type": "uint256"
							}
						],
						"name": "",
						"type": "tuple"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [],
				"name": "userExist",
				"outputs": [
					{
						"name": "",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			}
		]]
		var address = "0x053df724e3bff991210db0ae471be25d24e7b454";
		this.myContract = new web3.eth.Contract(abi, address)
    }
}

export default Cntrct