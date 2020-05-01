import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import Web3 from 'web3'

//表单的css
const { Option } = Select;
const layout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 16,
	},
};
const tailLayout = {
	wrapperCol: {
		offset: 8,
		span: 16,
	},
};

// const userForm = { // after click Submit what we write into the blockchain.
//   Address: "区块链的地址",
//   temperature: 37,
//   status: "",
//   date: ""
// };


//函数式组件: 表单相关的都在这个函数里
const HealthForm = () => {
	const [form] = Form.useForm();

	const onHealthStatusChange = value => {
		switch (value) {
			case 'health':
				form.setFieldsValue({
					temperature: '37',
				});
				return;

			case 'symptom':
				form.setFieldsValue({
					temperature: '38',
				});
				return;

			case 'other':
				form.setFieldsValue({
					temperature: '37',
				});
		}
	};

	const onSubmit = (values) => {
		//TODO: 1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发),现在默认在命令行输入values
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
		var temp = form.getFieldValue("temperature");
		var status = form.getFieldValue("status") === 'symptom';
		//TODO: datePicker转化成string
		var date = form.getFieldValue("date");
		console.log(temp, status, date);

		if (myContract.methods.userExist() === false) {
			myContract.methods.addUser();
		}
		myContract.methods.addRecord(temp, status, date);
	};

	const onFinish = values => {
		console.log(values);
	};

	const onReset = () => {
		form.resetFields();
	};

	const onFill = () => {
		form.setFieldsValue({
			temperature: '37',
			status: 'Feeling Good',
		});
	};

	const handleDateChange = (date, dateString) => {
		console.log('Selected Time: ', date);
		console.log('Seleected Time in the format of string', dateString);//也可以用string形式存更方便写入区块链？
	};

	return (
		<Form {...layout} form={form} name="userHealthForm" onFinish={onFinish}>
			<Form.Item
				name="temperature"
				label="Body Temperature"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name="status"
				label="Status"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Select
					placeholder="Select a option and change input text above"
					onChange={onHealthStatusChange}
					allowClear
				>
					<Option value="health">Feeling Good</Option>
					<Option value="symptom">symptoms of Cold & Flu</Option>
					<Option value="other">Other</Option>
				</Select>
			</Form.Item>
			<Form.Item
				noStyle
				shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
			>
				{({ getFieldValue }) =>
					getFieldValue('status') === 'other' ? (
						<Form.Item
							name="customizeStatus"
							label="Customize Your Health Status"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input />
						</Form.Item>
					) : null
				}
			</Form.Item>
			<Form.Item
				name="date"
				label="Select The Date"
				rules={[
					{
						required: true,
					},
				]}
			>
				<DatePicker
					onChange={handleDateChange} />
			</Form.Item>
			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit" onClick={onSubmit}>
					Submit
        </Button>
				<Button htmlType="button" onClick={onReset}>
					Reset
        </Button>
				<Button type="link" htmlType="button" onClick={onFill}>
					Quick Fill
        </Button>
			</Form.Item>
		</Form>
	);
};

export default HealthForm;
