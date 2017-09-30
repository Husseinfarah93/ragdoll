import React from 'react'
import Radium from 'radium'
import StartupMenu from './StartupMenu.jsx'
import NewStartUpMenu from './NewStartUpMenu.jsx'
import Canvas from './Canvas.jsx'
import socket from '../io.js'


@Radium
class MainComp extends React.Component {
  constructor() {
    super()
    this.state = {
      showStartupMenu: true,
    }
  }

  startGame = (name, gameType, character, skin) => {
    socket.emit('startGame', { name, gameType, character, skin })
    let newGameInfo = {name: name, gameType: gameType, character: character, skin: skin}
    this.setState({ showStartupMenu: false, gameInfo: newGameInfo })
  }

  render() {
    return (
      <div id='test' style={Style}>
        {
        this.state.showStartupMenu ? 
        // <StartupMenu startGame={this.startGame} />
        <NewStartUpMenu startGame={this.startGame}/>
        : 
        <Canvas />
        }
      </div>
    )
  } 
}

const Style = {
  height: '100%'
}

export default MainComp
