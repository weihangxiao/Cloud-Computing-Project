import React from 'react';
import '../index.css';
import HealthRecordContract from "./contracts/HealthRecord.json";
import getWeb3 from "./getWeb3";
import { Input, Button, Select, Form } from 'antd';

class HealthForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			web3: null, accounts: null, contract: null,
		}
		this.tempChange = this.tempChange.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.dateChange = this.dateChange.bind(this);
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

	onSubmit = async () => {
		const { web3, accounts, contract } = this.state;
		//TODO: 1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发),现在默认在命令行输入values
		console.log(this.state)
		var temp = this.state.temp;
		var status = this.state.status == "sick";
		var date = this.state.date;
		// console.log(temp, status, date);
		const hasRecord = await contract.methods.hasRecord().call();
		if (hasRecord) {
			console.log("User exists! Update record");
			contract.methods.updateRecord(temp, status).send({ from: accounts[0] });
		} else {
			console.log("User does not exist! Add user");
			contract.methods.addUser("name", temp, status).send({ from: accounts[0] });
		}
	};

	tempChange(event) {
		this.setState({ temp: event.target.value });
	}

	statusChange(event) {
		this.setState({ status: event.target.value });
	}

	dateChange(event) {
		this.setState({ date: event.target.value });
	}

	render() {
		return (
			<form action="#" onSubmit={this.onSubmit}>
				<label>
					Temperature:
          			<input type="number" onChange={this.tempChange} required />
					Status:
          			{/* <input type="text" onChange={this.statusChange} required/> */}
					<select onChange={this.statusChange}>
						<option value="sick">sick</option>
						<option value="good">good</option>
					</select>
					Date:
          			<input type="text" onChange={this.dateChange} required />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}

}

export default HealthForm;
