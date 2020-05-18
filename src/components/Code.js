// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import QRCode from 'qrcode.react';
// import {Button} from 'antd';

// class Code extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       color: ["#00FF00", "#FFD700", "#DC143C"],
//       healthClass: 0,
//       codeValue: { // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
//         account: "区块链账号",
//         record:
//           [
//             {
//               "id" : 1,
//               "date": "2020-05-01",
//               "temperature": 37,
//               "status": "Feeling Good"
//             },
//             {
//               "id" : 1,
//               "date": "2020-04-30",
//               "temperature": 37,
//               "status": "Feeling Good"
//             }
//           ]
//       }
//     };
//   }

//   onUpdateQRCode = () => {
//     //待补充2-查操作：根据区块链返回结果更新上述healthClass和codeValue
//   };

//   render() {
//     return (
//       <div>
//           <div name='qrcode' style={style.qrcode}>
//               <QRCode value={this.state.codeValue}
//                 size={200} // size
//                 fgColor = {this.state.color[this.state.healthClass]} // QRcode color
//               />
//           </div>
//           <br></br>
//         <div name='button' style={style.button}> 
//             <Button type="primary"  htmlType="update" onClick = {this.onUpdateQRCode}>
//                 Update QR Code
//             </Button>
//         </div>
//       </div>
//     )
//   }


// }

// // const Code = () => {
// //   const color = ["#00FF00", "#FFD700", "#DC143C"];
// //   const healthClass = 0;
// //   const codeValue = { // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
// //     account: "区块链账号",
// //     record:
// //       [
// //         {
// //           "id" : 1,
// //           "date": "2020-05-01",
// //           "temperature": 37,
// //           "status": "Feeling Good"
// //         },
// //         {
// //           "id" : 1,
// //           "date": "2020-04-30",
// //           "temperature": 37,
// //           "status": "Feeling Good"
// //         }
// //       ]
// //   };

//   // const onUpdateQRCode = () => {
//   //   //待补充2-查操作：根据区块链返回结果更新上述healthClass和codeValue
//   // };
// // }

// const style = {
//   qrcode: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center'
//   },
//   button: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// }

// export default Code;
import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import HealthRecordContract from "../contracts/HealthRecord.json";
import getWeb3 from "../getWeb3";


class Code extends React.Component {
	color = ["#00FF00", "#FFD700", "#DC143C"];
	state = {
		web3: null, accounts: null, contract: null,
		healthClass: 0,
		codeValue:  // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
			[
				// {
				// 	"id": 1,
				// 	"date": "2020-05-01",
				// 	"temperature": 37,
				// 	"status": "Feeling Good"
				// },
			]
	}

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = HealthRecordContract.networks[networkId];
			const instance = new web3.eth.Contract(
				HealthRecordContract.abi,
				deployedNetwork && deployedNetwork.address,
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance }, this.runExample);
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	//TODO: 2-查操作：根据区块链返回结果更新上述healthClass和codeValue
	onUpdateQRCode = async() => {
		const { contract } = this.state;
		const hasRecord = await contract.methods.hasRecord().call();
		console.log("hasRecord:", hasRecord);
		if (hasRecord) {
			const status = await contract.methods.getUserCode().call();
			this.setState({ healthClass: status });
		} else {
			console.log("User does not exist!");
			this.setState({ healthClass: -1 });
		}
	}
	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (<div>
			<QRCode value={this.state.codeValue}
				size={120} // size
				fgColor={this.color[this.state.healthClass]} // QRcode color
			/>
			<Button type="primary" htmlType="update" onClick={this.onUpdateQRCode}>
				Update QR Code
    </Button>
		</div>)
	}
}
export default Code;