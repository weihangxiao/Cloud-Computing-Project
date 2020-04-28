import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HealthForm from './HealthForm';
import Code from './Code';
import * as serviceWorker from './serviceWorker';
import QRCode from 'qrcode.react';
import {Button} from 'antd';


ReactDOM.render(
	<div className="App">
		<div class="Headers">
			<h1>Covid-19 Pass</h1>
		</div>
		<div class="qrCode">
			<Code />
		</div>
		<div class="Form">
			<HealthForm />
		</div>
    </div>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
