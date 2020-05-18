// import React  ,{ Component } from 'react';
// import ReactDOM from 'react-dom';
// import '../index.css';
// import { Form, Input, Button, Select, DatePicker, InputNumber } from 'antd';
// import HealthRecordContract from "../contracts/HealthRecord.json";
// import getWeb3 from "../getWeb3";

// // import config from './aws-exports' // new
// // import Amplify from 'aws-amplify' // new
// // Amplify.configure(config) // new

// const { Option } = Select;
// const layout = {
//   labelCol: {
//     span: 5,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };

// const initialForm = () => {
//   const [form] = Form.useForm();
//   return [form]
// }

// // const userForm = { // after click Submit what we write into the blockchain.
// //   Address: "区块链的地址",
// //   temperature: 37,
// //   status: "",
// //   date: ""
// // };


// class HealthForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       //form: initialForm
//       web3: null, 
//       accounts: null, 
//       contract: null
//     }
//   }

//   onHealthStatusChange = (value) => {
//     switch (value) {
//       case 'health':
//       this.state.form.setFieldsValue({
//           temperature: 37,
//         });
//         return;

//       case 'sympton':
//         this.state.form.setFieldsValue({
//           temperature: 38,
//         });
//         return;

//       case 'other':
//         this.state.form.setFieldsValue({
//           temperature: 37,
//         });
//     }
//   }

//   componentDidMount = async () => {
// 		try {
// 			// Get network provider and web3 instance.
// 			const web3 = await getWeb3();

// 			// Use web3 to get the user's accounts.
// 			const accounts = await web3.eth.getAccounts();

// 			// Get the contract instance.
// 			const networkId = await web3.eth.net.getId();
// 			const deployedNetwork = HealthRecordContract.networks[networkId];
// 			const instance = new web3.eth.Contract(
// 				HealthRecordContract.abi,
// 				deployedNetwork && deployedNetwork.address,
// 			);

// 			// Set web3, accounts, and contract to the state, and then proceed with an
// 			// example of interacting with the contract's methods.
// 			this.setState({ web3, accounts, contract: instance }, this.runExample);
// 		} catch (error) {
// 			// Catch any errors for any of the above operations.
// 			alert(
// 				`Failed to load web3, accounts, or contract. Check console for details.`,
// 			);
// 			console.error(error);
// 		}
// 	};

// 	onSubmit = async (values) => {
// 		const { accounts, contract } = this.state;
// 		//TODO: 1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发),现在默认在命令行输入values
// 		var temp = this.state.temp;
// 		var status = this.state.status === "sick";
// 		var date = this.state.date;
// 		console.log(temp, status, date);
// 		const hasRecord = await contract.methods.hasRecord().call();
// 		if (hasRecord) {
// 			console.log("User exists! Update record");
// 			contract.methods.updateRecord(temp, status).send({ from: accounts[0] });
// 		} else {
// 			console.log("User does not exist! Add user");
// 			contract.methods.addUser("name", temp, status).send({ from: accounts[0] });
// 		}
//   };

//   onFinish = values => {
//     console.log(values);
//   }

//   onReset = () => {
//     this.prop.form.resetFields();
//   }

//   onFill = () => {
//     this.prop.form.setFieldsValue({
//       temperature: '37',
//       status: 'Feeling Good',
//     });
//   }
  

//   handleDateChange = (date, dateString) => {
//     console.log('Selected Time: ', date);
//     console.log('Seleected Time in the format of string', dateString);//也可以用string形式存更方便写入区块链？
//   }

//   // render() {
// 	// 	return (
// 	// 		<form onSubmit={this.onSubmit}>
// 	// 			<label>
// 	// 				Temperature:
//   //         			<input type="text" value={this.state.temp} />
// 	// 				Status:
//   //         			<input type="text" value={this.state.status} />
// 	// 				Date:
//   //         			<input type="text" value={this.state.date} />
// 	// 			</label>
// 	// 			<input type="submit" value="Submit" />
// 	// 		</form>
// 	// 	);
// 	// }

//   render() {
//     return (
//       <div name="healthform" style={style.form}>
//         <Form {...layout} form={this.state.form} name="userHealthForm" onFinish={this.onFinish}>
//           <Form.Item
//             name="temperature"
//             label="Body Temperature"
//             rules={[
//               {
//                 required: true,
//               },
//             ]}
//           >
//             <InputNumber />
//           </Form.Item>
//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[
//               {
//                 required: true,
//               },
//             ]}
//           >
//             <Select
//               placeholder="Select a option and change input text above"
//               onChange={this.onHealthStatusChange}
//               allowClear
//             >
//               <Option value="health">Feeling Good</Option>
//               <Option value="sympton">Symptons of Cold & Flu</Option>
//               <Option value="other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('status') === 'other' ? (
//                 <Form.Item
//                   name="customizeStatus"
//                   label="Customize Your Health Status"
//                   rules={[
//                     {
//                       required: true,
//                     },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               ) : null
//             }
//           </Form.Item>
//           <Form.Item
//             name="date"
//             label="Select The Date"
//             rules={[
//               {
//                 required: true,
//               },
//             ]}
//           >
//             <DatePicker
//             />
//           </Form.Item>
//           <Form.Item {...tailLayout}>
//             <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
//               Submit
//           </Button>
//             <Button htmlType="button" onClick={this.onReset}>
//               Reset
//           </Button>
//             <Button type="link" htmlType="button" onClick={this.onFill}>
//               Quick Fill
//           </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     );
//   };
// }

// const style = {
//   form: {
//     position: 'relative',
//     top: '200px'
//   }
// }



// // //函数式组件: 表单相关的都在这个函数里
// // const HealthForm = () => {
// //   const [form] = Form.useForm();

// //   const onHealthStatusChange = value => {
// //     switch (value) {
// //       case 'health':
// //         form.setFieldsValue({
// //           temperature: 37,
// //         });
// //         return;

// //       case 'sympton':
// //         form.setFieldsValue({
// //           temperature: 38,
// //         });
// //         return;

// //       case 'other':
// //         form.setFieldsValue({
// //           temperature: 37,
// //         });
// //     }
// //   };

// //   const onSubmit = (values) => {
// //     //待补充1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发
// //     //现在默认在命令行输入values
// //     console.log('Received values of form: ', values);
// //   };

// //   const onFinish = values => {
// //     console.log(values);
// //   };

// //   const onReset = () => {
// //     form.resetFields();
// //   };

// //   const onFill = () => {
// //     form.setFieldsValue({
// //       temperature: '37',
// //       status: 'Feeling Good',
// //     });
// //   };

// //   const handleDateChange = (date, dateString) => {
// //     console.log('Selected Time: ', date);
// //     console.log('Seleected Time in the format of string', dateString);//也可以用string形式存更方便写入区块链？
// //   };


// export default HealthForm;

import React from 'react';
import '../index.css';
import HealthRecordContract from "../contracts/HealthRecord.json";
import getWeb3 from "../getWeb3";


class HealthForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			web3: null, accounts: null, contract: null, temp: "", date: "", status: ""
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

	onSubmit = async() => {
		const { web3, accounts, contract } = this.state;
		//TODO: 1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发),现在默认在命令行输入values
		console.log(this.state)
		var temp = this.state.temp;
		var status = this.state.status == "sick";
		var date = this.state.date;
		console.log(temp, status, date);
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
			<form onSubmit={this.onSubmit}>
				<label>
					Temperature:
          			<input type="number" onChange={this.tempChange} required />
					Status:
          			<input type="text" onChange={this.statusChange} required/>
					{/* <select onChange={this.statusChange}>
						<option value="sick">sick</option>
						<option value="good">good</option>
					</select> */}
					Date:
          			<input type="text" onChange={this.dateChange} required />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}

}

export default HealthForm;