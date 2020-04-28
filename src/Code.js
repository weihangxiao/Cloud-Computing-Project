import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import {Button} from 'antd';

const Code = () => {
  const color = ["#00FF00", "#FFD700", "#DC143C"];
  const healthClass = 0;
  const codeValue = 'past health records';
  const onUpdateQRCode = () => {
    //这里实现update qr code查询功能
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
