import React from 'react';
import '../index.css';
import HealthRecordContract from "./contracts/HealthRecord.json";
import getWeb3 from "./getWeb3";
import { Button } from 'antd';

class HealthForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			web3: null, accounts: null, contract: null,
		}
		this.nameChange = this.nameChange.bind(this);
		this.tempChange = this.tempChange.bind(this);
		this.statusChange = this.statusChange.bind(this);
		this.dateChange = this.dateChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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
		console.log(this.state)
		var name = this.state.name;
		var temp = this.state.temp;
		var status = this.state.status == "sick";
		var date = this.state.date;
		var date_as_int = new Date(date).getTime();
		console.log(name, temp, status, date, date_as_int);
		const hasRecord = await contract.methods.hasRecord().call();
		if (hasRecord) {
			console.log("User exists!");
			contract.methods.addRecord(temp, status, date_as_int).send({ from: accounts[0] });
		} else {
			console.log("User does not exist! Add user");
			contract.methods.addUser("name", temp, status, date_as_int).send({ from: accounts[0] });
		}
	};

	nameChange(event) {
		this.setState({ name: event.target.value });
	}

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
					<p>
						Name:
          				<input type="text" onChange={this.nameChange} required />
					</p>
					<p>
						Temperature:
						<input type="number" onChange={this.tempChange} required />
					</p>
					<p>
						Status:
						{/* <input type="text" onChange={this.statusChange} required/> */}
						<select onChange={this.statusChange}>
							<option value="sick">sick</option>
							<option value="good">good</option>
						</select>
					</p>
					<p>
						Date:
						<input type="date" onChange={this.dateChange} required />
					</p>
				</label>
					<br></br>
				<Button type="primary" value="Submit" htmlType="button" onClick={this.onSubmit}>
          Submit
        </Button>
			</form>
		);
	}

}

export default HealthForm;
