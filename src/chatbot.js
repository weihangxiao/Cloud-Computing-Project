import React, { Component } from 'react';
import config from './aws-exports' // new
import Amplify from 'aws-amplify' // new
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'
Amplify.configure(config) // new

class Chatbot extends Component {
    state = {
      input: '',
      finalMessage: '',
      messages: [
        new Message({   // set initial message which is hte first item in the array of message being held in our state
          id: 1,
          message: "Hello, how can I help you today?",
        })
      ]
    }
    _handleKeyPress = (e) => { // This will listen to the keyboard input and submit a new message if the Enter key is pressed.
      if (e.key === 'Enter') {
        this.submitMessage()
      }
    }
    onChange(e) { //update the input field with the current value of the text input
      const input = e.target.value
      this.setState({
        input
      })
    }

    
    async submitMessage() {
      const { input } = this.state
      if (input === '') return
      const message = new Message({
        id: 0,
        message: input,
      })
      let messages = [...this.state.messages, message]
  
      this.setState({
        messages,
        input: ''
      })
      const response = await Interactions.send("CovidSymptoms", input);
      const responseMessage = new Message({
        id: 1,
        message: response.message,
      })
      messages  = [...this.state.messages, responseMessage]
      this.setState({ messages })
  
      if (response.dialogState === 'Fulfilled') {
        if (response.intentName === 'CovidSymptoms') {
          const { slots: { temperature } } = response
          const finalMessage = `${temperature}`
          this.setState({ finalMessage })
        }
      }
    }
    render() {
      return (
        <div className="Chatbot">
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Welcome to my Covid Symptoms Checker bot!</h1>
          </header>
          <div style={styles.messagesContainer}>
          <h2>{this.state.finalMessage}</h2>
          <ChatFeed
            messages={this.state.messages}
            hasInputField={false}
            bubbleStyles={styles.bubbleStyles}
          />
  
          <input
            onKeyPress={this._handleKeyPress}
            onChange={this.onChange.bind(this)}
            style={styles.input}
            value={this.state.input}
          />
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
    },
    headerTitle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'white',
      fontSize: 22
    },
    header: {
      backgroundColor: 'rgb(0, 132, 255)',
      padding: 5
    },
    messagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      alignItems: 'center'
    },
    input: {
      fontSize: 16,
      padding: 10,
      outline: 'none',
      width: 350,
      border: 'none',
      borderBottom: '2px solid rgb(0, 132, 255)'
    }
  }
  
  export default Chatbot