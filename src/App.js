import React, { Component } from 'react';
import config from './aws-exports' // new
import Amplify from 'aws-amplify' // new
import HealthForm from './components/HealthForm';
import Code from './components/Code';
import ChatBox from './components/ChatBox';
import { Form } from 'antd';
import './css/App.css'
import { LioWebRTC } from 'react-liowebrtc';
import { Navbar, Nav, FormControl } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
Amplify.configure(config) // new


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatLog: [],
            options: {
                debug: true,
                dataOnly: true
            }
        }
    }

    join = (webrtc) => webrtc.joinRoom('my-p2p-app-demo');

    handleCreatedPeer = (webrtc, peer) => {
        this.addChat(`Peer-${peer.id.substring(0, 5)} joined the room!`, ' ', true);
    }

    handlePeerData = (webrtc, type, payload, peer) => {
        switch (type) {
            case 'chat':
                this.addChat(`Peer-${peer.id.substring(0, 5)}`, payload);
                break;
            default:
                return;
        };
    }

    addChat = (name, message, alert = false) => {
        this.setState({
            chatLog: this.state.chatLog.concat({
                name,
                message: `${message}`,
                timestamp: `${Date.now()}`,
                alert
            })
        });
    }

    render() {
        const { chatLog, options } = this.state;
        // const ref = React.createRef();
        return (
            <div className="App">
                {/* <Navbar className="headerbar" bg="dark" variant="dark">
                    <div class="col-4"></div>
                    <div class="home col-4" className="title">
                        <div class="h3">Covid-19 Symptom Checker</div>
                    </div> */}
                    {/* <Navbar.Brand style={style.customflex}>Covid-19 Symptom Checker</Navbar.Brand> */}
                {/* </Navbar> */}
                <br></br>
                <Router>
                    <Route path="/input" render={props =>
                        <div>
                            <Code />
                            <HealthForm/>
                        </div>}
                    />
                    <Route path="/chatbot" render={props =>
                        <div>
                            <LioWebRTC
                                options={options}
                                onReady={this.join}
                                onCreatedPeer={this.handleCreatedPeer}
                                onReceivedPeerData={this.handlePeerData}
                            >
                                <ChatBox
                                    chatLog={chatLog}
                                    onSend={(msg) => msg && this.addChat('Me', msg)}
                                />
                            </LioWebRTC>
                        </div>}
                    />
                </Router>
            </div >
        );
    }
}

export default App;