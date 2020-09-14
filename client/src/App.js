import React from 'react'
import config from '/.config'
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
      content: '',
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

  handleContent(event){
    this.setState({
      content: event.target.value
    })
  }

  handleName(event){
    this.setState()
  }
}

export default App;
