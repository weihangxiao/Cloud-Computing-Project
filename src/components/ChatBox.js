import React, { Component } from 'react';
import '../css/ChatBox.css';
import { withWebRTC } from 'react-liowebrtc';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      finalMessage: '',
      initalMessage: '',
      messages: [
        new Message({   // set initial message which is hte first item in the array of message being held in our state
            id: 1,
            message: "",
          })
      ]
    };
  }

  async submitMessage() { // handle chatbot message submission to amazon lex
    const { input } = this.state
    if (input === '') return
    const message = new Message({ //input message
      id: 0,
      message: input,
    })
    
    let messages;
    if (input === '1') {
        messages = [message];
    } else {
        messages = [...this.state.messages, message]
    }
    this.setState({
        messages,
        input: ''
    })

    const response = await Interactions.send("CovidSymptoms", input); // passing two argumens: the bot name and the value
    const responseMessage = new Message({ // take the response from the bot and create another message
      id: 1,
      message: response.message,
    })
    messages  = [...this.state.messages, responseMessage]
    this.setState({ messages })

    if (response.dialogState === 'Fulfilled') {
      if (response.intentName === 'CovidSymptomsChecking') {
        //const { slots: { Temperature, answerquestion, Symptomscheck} } = response
        const finalMessage = `self checking chat ending!`
        this.setState({ finalMessage })
      }
    }
  }

  generateChats = () => {
    if(this.chatBox) {
      setTimeout(() => { this.chatBox.scrollTop = this.chatBox.scrollHeight; }, 2);
    }
    return this.props.chatLog.map((item) => (
      <div className="chat" key={`chat-${item.name}-${item.timestamp}`}>
        <b className="name" style={{ color: item.alert ? '#888' : '#333' }}>{item.name}</b> <span className="msg">{item.message}</span>
      </div>
    ));
  }

  handleSend = (chatMsg) => {
    this.props.webrtc.shout('chat', chatMsg);
    console.log(chatMsg);
    this.props.onSend(chatMsg);
  }
  

  handleKeyUp = (evt) => { //handle different case, 1 for user want to do self symptom check, 2 for user want to talk with experts 
    if (evt.keyCode === 13) {
        if (this.state.input == "1") {
            this.state.initalMessage = "symptom check";
        } else if (this.state.input == "2") {
            this.state.initalMessage = "talk with experts";
        }
        if (this.state.initalMessage == "symptom check") {
            this.submitMessage()
        } else {
            this.handleSend(this.state.input);
            this.setState({ input: '' });
        }
    }
  }

  handleInputChange = (evt) => this.setState({ input: evt.target.value });

  render() {
    const { chatLog } = this.props;
    return (
      <div className="container">
        <div className="chatHeader">
          <h1 className="title">P2P Covid-19 Chat Room</h1>
          <hr />
        </div>
        <div className="chatBox" ref={(div) => this.chatBox = div}>
            <div className="choice">
                <p>Do you want to do symptom check or talk with our experts? 
                    type '1' for checking with chatbot, '2' for talk with expert</p>
            </div>

            {this.state.initalMessage=='symptom check' ? (
                 <div className="chatbot">
                 <ChatFeed
                 messages={this.state.messages}
                 hasInputField={false}
                 bubbleStyles={styles.bubbleStyles}
                 />
             </div>
            ): (
                <div>
                    {chatLog.length ? this.generateChats() : (
                        <div className="info">
                        <p>To test this component out, open this page in a new tab or send it to a friend.</p>
                        </div>
                    )}  
                </div>
            )}
        </div>
        <hr />
        <div className="bottomBar">
          <input style={styles.bubbleStyles} className="chatInput" type="text" placeholder="Type a message..." onKeyUp={this.handleKeyUp} onChange={this.handleInputChange} value={this.state.input} />
        </div>
      </div>
    );
  }
}

const styles = {
    bubbleStyles: {
        text: {
          fontSize: 16,
          
        },
        chatbubble: {
          borderRadius: 30,
          padding: 10
        }
      }
}

export default withWebRTC(ChatBox);