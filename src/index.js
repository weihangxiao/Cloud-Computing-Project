import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Demo from './Demo';
import config from './aws-exports' // new
import Amplify from 'aws-amplify' // new
import * as serviceWorker from './serviceWorker';
import QRCode from 'qrcode.react';
import {Button} from 'antd';
import Chatbot from './chatbot';
Amplify.configure(config) // new


ReactDOM.render(
	<div className="App">
		<div class="Headers">
			<h1>Covid-19 Pass</h1> 
    		<QRCode value='https://twitter.com/realDonaldTrump/'
    			size={150} // size
    			fgColor="#00FF00" // QRcode color
    		/>
    		<Button type="primary" htmlType="update">
          		Update QR Code
        	</Button>
		</div>

		<div class="Form">
			<Demo />
		</div>
		<div>
			<Chatbot />
		</div>
    </div>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
