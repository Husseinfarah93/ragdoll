import React from 'react'
import '../styles/GameModes.scss'


class GameModes extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  moveRight = () => {
    if(this.props.currentGameModeIndex === this.props.gameModes.length - 1) return
    this.props.updateGameModeIndex(this.props.currentGameModeIndex + 1)
  }

  moveLeft = () => {
    if(this.props.currentGameModeIndex === 0) return
    this.props.updateGameModeIndex(this.props.currentGameModeIndex - 1)
  }


  render() {
    return (
        <div id="outerContainer">
          {this.props.gameModes.length > 0 ?
            <div id="gameModeContainer">
              <div id="gameModeTextContainer">
                <h3 id="gameModeText"
                  className={!this.props.gameModes[this.props.currentGameModeIndex].available ? 'gameModeComingSoon' : ''}>
                  {this.props.gameModes[this.props.currentGameModeIndex].name}
                </h3>
                <h4 id="gameModeAvailable"
                  className={this.props.gameModes[this.props.currentGameModeIndex].available ?
                  "gameModeAvailable" : "gameModeComingSoon"}>
                  (COMING SOON)
                </h4>
              </div>
              <div id="gameModeButtons">
                <div className={this.props.currentGameModeIndex === 0 ? "gameModeButton disabled" : "gameModeButton"} onClick={this.moveLeft}>
                  <i className="fa fa-arrow-left" />
                </div>
                <div className={this.props.currentGameModeIndex === this.props.gameModes.length - 1 ?
                  "gameModeButton disabled" : "gameModeButton"} onClick={this.moveRight}>
                  <i className="fa fa-arrow-right" />
                </div>
              </div>
            </div>
          : <div />}
        </div>
    )
  }
}

export default GameModes
