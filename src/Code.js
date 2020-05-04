import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import Web3 from 'web3'

const Code = () => {
	const color = ["#00FF00", "#FFD700", "#DC143C"];
	var healthClass = 0;
	var codeValue = { // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
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
		var abi = ([
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
			 "name": "hasRecord",
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
		   ])
		var address = "0x40a82B2fC04Eae3abb4Db7BE2fd1EB946C4a52A3";
		const myContract = new web3.eth.Contract(abi, address)
		myContract.methods.getUserCode().call(function(error, result){
			console.log("error: "+error, "result: " + result);
			healthClass = result;
		});
		console.log(myContract.methods.hasRecord());
		myContract.methods.hasRecord().call(function(error, result){
			console.log("error: "+error, "result: " + result);
			if (result == false) {
				console.log("User doesn't exist!")
				healthClass = 0;
			} else {
				//TODO: 需要能够返回Record
				myContract.methods.getUserCode().call(function(error, result){
					console.log("error: "+error, "result: " + result);
					healthClass = result;
				});
				console.log("return record:", healthClass);
			}
		});
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
