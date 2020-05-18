import React, { Component } from 'react';
// import config from './aws-exports' // new
// import Amplify from 'aws-amplify' // new
import HealthForm from './components/HealthForm';
import Code from './components/Code';
// import ChatBox from './components/ChatBox';
import './css/App.css'
// import { LioWebRTC } from 'react-liowebrtc';
import { Navbar, Form, Nav, FormControl } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs } from 'antd';
// Amplify.configure(config) // new

const { TabPane } = Tabs;



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
        return (
            <div className="App">
                <Navbar className="headerbar" bg="dark" variant="dark">
                    <div class="col-4"></div>
                    <div class="home col-4" className="title">
                        <div class="h3">Covid-19 Symptom Checker</div>
                    </div>
                    {/* <Navbar.Brand style={style.customflex}>Covid-19 Symptom Checker</Navbar.Brand> */}
                </Navbar>
                <br></br>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Code" key="1" forceRender="true">
                      <Code />
                  </TabPane>
                  <TabPane tab="Form" key="2" forceRender="true">
                      <HealthForm />
                  </TabPane>
                  <TabPane tab="Chat" key="3" forceRender="true">
                      <div>
                       Todo: This is the Chatbot Page
                      </div>
                  </TabPane>
                </Tabs>
                {/*Meet some bugs using the router method for the healthForm/Code, can change the page but when
                changing to new router and then back will lead to state loss issue, the eth account is reset...*/}
                {/*<Router>
                    <div className = "link">
                      <Link to="/input"> Input </Link>
                      <Link to="/chatbot"> Chatbot </Link>
                    </div>
                    <Switch>
                     <Route exact path="/">
                       <p>Select One Service </p>
                     </Route>
                      <Route path="/input">
                          <Code />
                          <br></br>
                          <HealthForm />
                      </Route>
                      <Route path="/chatbot">
                        <div>
                            TODO: fill the chatbot page
                        </div>}
                      </Route>
                    </Switch>
                    {/*<Route path="/chatbot" render={props =>
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
                </Router> **/}
            </div >
        );
    }
}

export default App;
