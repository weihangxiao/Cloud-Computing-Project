import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import {Button} from 'antd';


const Code = () => {
  return (
    <div>
    <QRCode value='https://twitter.com/realDonaldTrump/'
      size={120} // size
      fgColor="#00FF00" // QRcode color
    />
    <Button type="primary" htmlType="update">
          Update QR Code
    </Button>
    </div>
  )
}

export default Code;
