import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import HealthRecordContract from "./contracts/HealthRecord.json";
import getWeb3 from "./getWeb3";
import '../css/App.css'


class Code extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			web3: null, accounts: null, contract: null,
			healthClass: 0,
			codeValue: ""
		}
	}

	color = ["#00FF00", "#FFD700", "#DC143C"];

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
			alert(accounts);

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
			<br></br>
			<Button type="primary" htmlType="update" onClick={this.onUpdateQRCode}>
				Update QR Code
    </Button>
		</div>)
	}
}
export default Code;
