import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import HealthRecordContract from "./contracts/HealthRecord.json";
import getWeb3 from "./getWeb3";


class Code extends React.Component {
	color = ["#00FF00", "#FFD700", "#DC143C"];
	state = {
		web3: null, accounts: null, contract: null,
		healthClass: -1,
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

	onUpdateQRCode = async () => {
		const { contract } = this.state;
		const hasRecord = await contract.methods.hasRecord().call();
		console.log("hasRecord:", hasRecord);
		if (hasRecord) {
			const status = await contract.methods.getUserCode().call();
			this.setState({ healthClass: status });
			var gap;
			var today = new Date();
			var month = today.getUTCMonth() + 1; //months from 1-12
			var day = today.getUTCDate();
			var year = today.getUTCFullYear();
			var today_str = year + "/" + month + "/" + day;
			var today_as_int = new Date(today_str).getTime();
			console.log(today_str, today_as_int);
			var all_log = [];
			for (gap = 0; gap < 14; gap++) {
				var record = await contract.methods.getsRecord(today_as_int, gap).call();
				if (record[0] > 0) {
					let status = "good";
					if (record[2]) {
						status = "sick";
					}
					var date = new Date(record[0] / 1);
					let log = {
						"date": date,
						"temperature": record[1],
						"status": status
					}
					all_log.push(log);
				}
			}
			console.log(all_log);
			this.setState({ codeValue: JSON.stringify(all_log) });
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