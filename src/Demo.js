import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form, Input, Button, Select } from 'antd';

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

const Demo = () => {
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
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
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

export default Demo;