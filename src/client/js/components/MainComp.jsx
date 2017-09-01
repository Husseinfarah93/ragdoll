import React from 'react'
import Radium from 'radium'
import StartupMenu from './StartupMenu.jsx'
import Canvas from './Canvas.jsx'
import socket from '../io.js'


@Radium
class MainComp extends React.Component {
  constructor() {
    super()
    this.state = {
      showStartupMenu: true
    }
  }

  startGame = (name, gameType, character, skin) => {
    socket.emit('startGame', { name, gameType, character, skin })
    this.setState({ showStartupMenu: false })
  }

  render() {
    return (
      this.state.showStartupMenu ? 
      <StartupMenu startGame={this.startGame}/>
      : 
      <Canvas />
    )
  }
  
}

export default MainComp
