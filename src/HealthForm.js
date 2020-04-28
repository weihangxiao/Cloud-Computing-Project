import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form, Input, Button, Select, DatePicker } from 'antd';


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

const userForm = { //after click Submit what we write into the blockchain.
  Address: "区块链的地址",
  temperature: 37,
  status: "",
  date: ""
};

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

  const onSubmit = values => {
    //代补充：写入区块链
  }

  const onFinish = values => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      temperature: '37',
      status: 'healthy',
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
          <Option value="sympton">Symptons of Cold&Flu</Option>
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
         <DatePicker />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={onSubmit}>
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  );
};

export default HealthForm;
