import React from 'react'
import Radium from 'radium'
import StartupMenu from './StartupMenu.jsx'
import NewStartUpMenu from './NewStartUpMenu.jsx'
import LandingPage from './LandingPage.jsx'
import Canvas from './Canvas.jsx'
import socket from '../io.js'
import '../styles/MainComp.scss'

@Radium
class MainComp extends React.Component {
  constructor() {
    super()
    this.state = {
      showStartupMenu: true,
      audio: {},
      soundOn: false
    }
  }

  componentDidMount() {
    this.createAudio()
  }

  createAudio() {
    let bg = document.createElement('audio')
    let hit1 = document.createElement('audio')
    let hit2 = document.createElement('audio')
    let hit3 = document.createElement('audio')
    let block = document.createElement('audio')
    let kill = document.createElement('audio')
    let death = document.createElement('audio')
    let levelUp = document.createElement('audio')

    bg.src = "../../assets/sounds/BG.wav"
    hit1.src = "../../assets/sounds/hit1.wav"
    hit2.src = "../../assets/sounds/hit2.wav"
    hit3.src = "../../assets/sounds/hit3.wav"
    hit1.volume = hit2.volume = hit3.volume = 0.3
    block.src = "../../assets/sounds/block.wav"
    kill.src = "../../assets/sounds/kill.mp3"
    death.src = "../../assets/sounds/death.wav"
    levelUp.src = "../../assets/sounds/levelUp.wav"

    bg.loop = true

    let newAudio = {
      bg: bg,
      hit: [hit1, hit2, hit3],
      block: block,
      kill: kill,
      death: death,
      levelUp: levelUp
    }
    this.setState({ audio: newAudio })

  }

  toggleSound = () => {
    this.state.soundOn ? this.state.audio.bg.pause() : this.state.audio.bg.play()
    socket.emit('toggleSound', !this.state.soundOn)
    this.setState({ soundOn: !this.state.soundOn  })
  }

  startGame = (name, gameType, character, skinGroupName, skinName, partyId) => {
    let soundOn = this.state.soundOn
    console.log('startGame: ', partyId)
    socket.emit('startGame', {
      name,
      gameType,
      character,
      skinGroupName,
      skinName,
      soundOn,
      partyId
    })
    let newGameInfo = {
      name: name,
      gameType: gameType,
      character: character,
      skinGroupName: skinGroupName,
      skinName: skinName
    }
    this.setState({ showStartupMenu: false, gameInfo: newGameInfo })
  }

  render() {
    return (
      <div id="mainCompContainer">
        <div id="settingsIcons">
          <div id="soundIcon" onClick={this.toggleSound}>
            {this.state.soundOn ?
            <i className="fa fa-volume-up" />
            :
            <i className="fa fa-volume-off" />}
          </div>
        </div>
        {
          this.state.showStartupMenu ?
          // <StartupMenu startGame={this.startGame} />
          <LandingPage startGame={this.startGame} />
          :
          <Canvas audio={this.state.audio}/>
        }
      </div>
    )
  }
}


export default MainComp
