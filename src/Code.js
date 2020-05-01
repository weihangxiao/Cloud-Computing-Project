import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import Web3 from 'web3'

const Code = () => {
	const color = ["#00FF00", "#FFD700", "#DC143C"];
	const healthClass = 0;
	const codeValue = { // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
		account: "区块链账号",
		record:
			[
				// {
				// 	"id": 1,
				// 	"date": "2020-05-01",
				// 	"temperature": 37,
				// 	"status": "Feeling Good"
				// },
			]
	};
	const onUpdateQRCode = () => {
		//TODO: 2-查操作：根据区块链返回结果更新上述healthClass和codeValue
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
		const myContract = new web3.eth.Contract(abi, address)
		// console.log(myContract)
		if (myContract.methods.userExist() === true) {
			healthClass = myContract.methods.getUserCode();
			//TODO: 现在只能读取最近一次的record,solidity不能返回struct和array,但我已经在solidity里面把所有的record存了起来,需要想办法怎么返回
			var ret = myContract.methods.getUserRecord();
			codeValue.account = ret[0];
			var rec = {
				"id": ret[1],
				"date": ret[2],
				"temperature": ret[3],
				"status": ret[4]
			};
			codeValue.record.push(rec);
		} else {
			healthClass = 0;
			codeValue = null;
		}
	}
	return (
		<div>
			<QRCode value={codeValue}
				size={120} // size
				fgColor={color[healthClass]} // QRcode color
			/>
			<Button type="primary" htmlType="update" onClick={onUpdateQRCode}>
				Update QR Code
    </Button>
		</div>
	)
}

export default Code;
