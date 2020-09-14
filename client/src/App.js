import React from 'react'
import config from './config'
import io from 'socket.io-client'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import BottomBar from './BottomBar'
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      chat: [],
      text: '',
      name: '',
    }
  }

  componentDidMount(){
    this.socket = io(config[process.env.NODE_ENV].endpoint)

    this.socket.on('init', (msg) => {
      let msgReversed = msg.reverse()
      this.setState((state) => ({
      chat: [...state.chat, ...msgReversed],
      }), this.scrollToBottom)
    })
    //update the chat if a new message is broadcasted
    this.socket.on('push', (msg) => {
      this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom)
    })
  }

  handleText(evt){
    this.setState({
      text: evt.target.value
    })
  }

  handleName(evt){
    this.setState({
      name: evt.target.value,
    })
  }

  handleSubmit(evt){
    // prevents form reloading current page
    evt.preventDefault()

    //sends new message to server
    this.socket.emit('message', {
      name: this.state.name,
      text: this.state.text,
    })

    this.setState((state) => {
      //update chat with usr msg and remove string
      return {
        chat: [...state.chat, {
          name: state.name,
          text: state.text,
        }],
        text: '',
        }
      }, this.scrollToBottom)
    }
    // ensure window is scrolled down to last message
    scrollToBottom(){
      const chat = document.getElementById('chat')
      chat.scrollTop = chat.scrollHeight
    }

    render() {
      return (
        <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="text">
                  {el.text}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          text={this.state.text}
          handleText={this.handleText.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          name={this.state.name}
        />
      </div>
      )
    }
  }


export default App;
