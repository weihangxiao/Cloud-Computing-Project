import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import {Button} from 'antd';

const Code = () => {
  const color = ["#00FF00", "#FFD700", "#DC143C"];
  const healthClass = 0;
  const codeValue = 'past health records';
  return (
    <div>
    <QRCode value={codeValue}
      size={120} // size
      fgColor = {color[healthClass]} // QRcode color
    />
    <Button type="primary" htmlType="update">
          Update QR Code
    </Button>
    </div>
  )
}

export default Code;
