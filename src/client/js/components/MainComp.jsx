import React from 'react'
import Radium from 'radium'
import StartupMenu from './StartupMenu.jsx'
import NewStartUpMenu from './NewStartUpMenu.jsx'
import LandingPage from './LandingPage.jsx'
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
        this.state.showStartupMenu ?
        // <StartupMenu startGame={this.startGame} />
        <LandingPage startGame={this.startGame}/>
        :
        <Canvas />
    )
  }
}


export default MainComp
