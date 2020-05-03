import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form, Input, Button, Select, DatePicker } from 'antd';
// import config from './aws-exports' // new
// import Amplify from 'aws-amplify' // new
// Amplify.configure(config) // new

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

      case 'sympton':
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
    //待补充1-写操作：实现将表单的values写入区块链数据库（该函数在点击submit按钮后触发
    //现在默认在命令行输入values
      console.log('Received values of form: ', values);
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

  const style = {
    form: {
      // display: 'flex',
      // justifyContent: 'center'
      position: 'relative',
      top: '200px'
      // top: '50%',
      // left: '50%'
    }
  }

  return (
    <div name="healthform" style={style.form}>
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
          <Option value="sympton">Symptons of Cold & Flu</Option>
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
    </div>
  );
};

export default HealthForm;
