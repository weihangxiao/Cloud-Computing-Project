import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import {Button} from 'antd';

const Code = () => {
  const color = ["#00FF00", "#FFD700", "#DC143C"];
  const healthClass = 0;
  const codeValue = { // 记录该账号过去所以记录的一个数据结构（扫码后可见）,在表单js文件写入区块链的，可以用一个json来存
    account: "区块链账号",
    record:
      [
        {
          "id" : 1,
          "date": "2020-05-01",
          "temperature": 37,
          "status": "Feeling Good"
        },
        {
          "id" : 1,
          "date": "2020-04-30",
          "temperature": 37,
          "status": "Feeling Good"
        }
      ]
  };
  const onUpdateQRCode = () => {
    //待补充2-查操作：根据区块链返回结果更新上述healthClass和codeValue
  }
  return (
    <div>
    <QRCode value={codeValue}
      size={120} // size
      fgColor = {color[healthClass]} // QRcode color
    />
    <Button type="primary" htmlType="update" onClick = {onUpdateQRCode}>
          Update QR Code
    </Button>
    </div>
  )
}

export default Code;
