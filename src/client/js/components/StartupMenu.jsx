import React from 'react'
import Radium from 'radium'

@Radium
class StartupMenu extends React.Component {
  constructor() {
    super()
    this.state = {
      currentGameMode: 'FFA',
      showSkinModal: false,
      showCharacterModal: false,
      currentCharacter: 'basic',
      currentSkin: 'basic'
    }
  }

  changeGameMode = (newGameMode) => {
    this.setState({ currentGameMode: newGameMode })
  }

  toggleSkinModal = () => {
    this.setState({ showSkinModal: !this.state.showSkinModal })
  }

  toggleCharacterModal = () => {
    this.setState({ showCharacterModal: !this.state.showCharacterModal })
  }

  playGame = () => {
    this.props.startGame(this.state.currentGameMode, this.state.currentCharacter, this.state.currentSkin)
  }

  render() {
    return (
      <div>
        <div id="startupMenu">
          <div id="middleContainer" style={Style.middleContainer}>
            <div id="gameModes" style={Style.gameModes}>
              <h2 style={Style.gameModesText}> Game Modes </h2>
              <div style={Style.gameListWrapper}>
                <ul id="gameModesList" style={Style.listItems}>
                  <li className="gameModeListItem" style={Style.listItem} onClick={() => this.changeGameMode('FFA')}>
                    <button id="ffaButton"> FFA </button>
                  </li>
                  <li className="gameModeListItem" style={Style.listItem} onClick={() => this.changeGameMode('SURVIVAL')}>
                    <button id="survivalButton"> SURVIVAL </button>
                  </li>
                  <li className="gameModeListItem" style={Style.listItem} onClick={() => this.changeGameMode('TDM')}>
                    <button id="tdmButton"> TDM </button>
                  </li>
                  <li className="gameModeListItem" style={Style.listItem} onClick={() => this.changeGameMode('INFECTED')}>
                    <button id="infectedButton"> INFECTED </button>
                  </li>
                </ul>
              </div>
            </div> 
            <div id="mainControl" style={Style.mainControl}> 
              <div id="nameField">
                <input id="nameInput" style={Style.inputField}></input>
              </div>
              <div id="characterDiv" style={Style.characterDiv}>
                <button id="changeSkinButton" style={Style.skinButton} onClick={this.toggleSkinModal}> SKIN </button>
                <button id="changeCharacterButton" style={Style.characterButton} onClick={this.toggleCharacterModal}> CHARACTER </button>
              </div>
              <div id="playDiv" style={Style.playDiv}>
                {/* <div id="settingsButton" style={Style.settingsButton} /> */}
                <button id="playButton" style={Style.playButton} onClick={() => this.playGame()}> PLAY </button>
              </div>
            </div>
          </div>
        </div>
        <div id="gameMenu" />  
        {
          this.state.showSkinModal && 
          <div id="skinModal" style={Style.skinModal} />
        }
        {
          this.state.showCharacterModal && 
          <div id="characterModal" style={Style.characterModal} />
        }
      </div>
    )
  }
}

const Style = {
  listItems: {
    listStyle: 'none',
    padding: '0px',
    display: 'inline-block'
  },
  listItem: {
    float: 'left'
  },
  gameModesText: {
    margin: '0px',
    textAlign: 'center'
  },
  gameListWrapper: {
    textAlign: 'center'
  },
  gameModes: {
    overflow: 'hidden',
    marginBottom: '250px',
    borderRadius: '10px', 
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  middleContainer: {
    paddingLeft: '35%',
    paddingRight: '35%',
  },
  inputField: {
    width: '100%',
    height: '40px',
    borderWidth: '0px', 
    padding: '0px'
  },
  characterDiv: {
    marginTop: '10px',
    height: '30px'
  }, 
  skinButton: {
    width: '45%',
    marginRight: '10%',
    height: '100%',
    background: '#666',
    border: '0px'
  }, 
  characterButton: {
    width: '45%',
    height: '100%',
    background: '#666',
    border: '0px'
  }, 
  playDiv: {
    height: '30px',
    marginTop: '10px'
  },
  playButton: {
    width: '100%',
    height: '100%',
    background: '#1d8dee',
    border: '0px'
  },
  settingsButton: {
    display: 'inline-block',
    backgroundImage: 'url("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-gear-a-128.png")',
    height: '40px',
    width: '40px',
    backgroundSize: '40px 40px',
    backgroundRepeat: 'no-repeat'
  },
  mainControl: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '15px'
  },
  skinModal: {
    backgroundColor: 'yellow',
    height: '300px',
    width: '300px',
    zIndex: 1
  },
  characterModal: {
    backgroundColor: 'yellow',
    height: '300px',
    width: '300px',
    zIndex: 1
  }


}

export default StartupMenu
