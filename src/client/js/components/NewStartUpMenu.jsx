import React from 'react'
import Radium from 'radium'

@Radium
class NewStartupMenu extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      currentGameMode: 'FFA',
      showSkinModal: false,
      currentCharacter: 'basic',
      currentSkin: 'basic'
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.playGame)
  }

  toggleSkinModal = () => {
    this.setState({ showSkinModal: !this.state.showSkinModal })
  }

  playGame = (evt, submitType) => {
    if(submitType === 'click' || evt.keyCode === 13) {
      window.removeEventListener('keydown', this.playGame)
      this.props.startGame(this.state.name.toUpperCase(), this.state.currentGameMode, this.state.currentCharacter, this.state.currentSkin)
    }
  }

  changeName = (evt) => {
    this.setState({ name: evt.target.value })
  }

  render() {
    return (
      <div style={Style.rootDiv}>
        <div id='menu' style={Style.menu}>
          <div id='partition1' style={Style.partition1}>
            <div id='imgContainer' style={Style.imgContainer}>
              <div id='img' style={Style.img}></div>
            </div>
          </div>
          <div id='partition2' style={Style.partition2}>
            <div id='playContainer' style={Style.playContainer}>
              <input id='nameInput' autoComplete="off" autoFocus style={Style.nameInput} onChange={this.changeName}></input>
              <div id='playButton' style={Style.playButton} onClick={() => this.playGame('click')}>
                <i className="fa fa-play"></i>
              </div>
            </div>
            <div id='ragdollIcon' style={Style.ragdollIcon} onClick={this.toggleSkinModal}></div>
            <div id='gearIcon' style={Style.gearIcon}>
              <i className="fa fa-cog" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div id='social' style={Style.social}></div>
        {this.state.showSkinModal && 
          <div id='modalContainer' style={Style.modalContainer} onClick={this.toggleSkinModal}></div>
        }
        {this.state.showSkinModal &&
          <div id='modal' style={Style.modal}>
            <div id='bannerInfo' style={Style.bannerInfo}>
              <h3> Shop </h3>
              <div id='crossIcon' style={Style.crossIcon} onClick={this.toggleSkinModal}>
                <i className="fa fa-times" style={Style.faTimes}></i>
              </div>
            </div>
            <div id='tabs' style={Style.tabs}>
              <a className='tab selected' style={Style.tab}>SKIN</a>
              <a className='tab' style={Style.tab}>CHARACTER</a>
              <a className='tab' style={Style.tab}>Game Mode</a>
              <a className='tab' style={Style.tab}>CHILD 4</a>
            </div>
            <div id='gridContainer' style={Style.gridContainer}>
              <div id='grid' style={Style.grid}>
                <div id='leftButton' style={Style.leftButton}>
                  <i className="fa fa-chevron-left"></i>
                </div>
                <div id='playerContainer' style={Style.playerContainer}>
                  <div id='player' style={Style.player}></div>
                  <a id='selectButton' style={Style.selectButton}> SELECT </a>
                </div>
                <div id='rightButton' style={Style.rightButton}>
                  <i className="fa fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

const Style = {
  rootDiv: {
    height: '100%'
  },
  menu: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  partition1: {
    flex: 1,
    backgroundColor: 'white'
  },
  partition2: {
    flex: 1,
    backgroundColor: 'white'
  },
  imgContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  img: {
    width: '366px',
    height: '114px',
    background: "url('../../assets/rags.png')",
    backgroundSize: '366px 114px',
    backgroundRepeat: 'no-repeat'
  },
  playContainer: {
    width: '100%',
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameInput: {
    fontSize: '32px',
    width: '320px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    border: '0px',
    outline: 'none',
    padding: '10px',
    color: '#059995',
    textTransform: 'uppercase',
    fontFamily: 'Ubuntu',
    height: '43px'
  },
  playButton: {
    fontSize: '36px',
    backgroundColor: '#ccc',
    width: '46px',
    height: '43px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  faPlay: {
    color: 'white'
  },
  // .fa-play:hover {
  //   color: #059995
  // },
  ragdollIcon: {
    background: "url('https://dl2.macupdate.com/images/icons128/18316.png?d=1328900398')",
    position: 'fixed',
    bottom: '5px',
    left: '5px',
    width: '40px',
    height: '40px',
    backgroundSize: '40px 40px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    zIndex: 1
  },
  gearIcon: {
    position: 'fixed',
    bottom: '5px',
    right: '5px',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    cursor: 'pointer'
  },
  faCog: {
    color: '#ccc'
  },
  // .fa-cog:hover {
  //   color: #059995
  // },
  modalContainer: {
    // display: 'none',
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modal: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    backgroundColor: 'white',
    width: '600px',
    height: '400px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '-300px',
    marginTop: '-200px'
  },
  bannerInfo: {
    backgroundColor: 'white',
    height: '10%',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  crossIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  faTimes: {
    color: '#ccc'
  },
  // .fa-times:hover {
  //   color: #059995
  // },
  tabs: {
    backgroundColor: 'white',
    display: 'flex',
  },
  tab: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: '10px',
    cursor: 'pointer',
    margin: '0px 0.5px 0px 0.5px',
    fontFamily: 'Ubuntu'
  },
  // .tab:first-child {
  //   margin: 0px 0.5px 0px 0px
  // },
  // .tab:hover {
  //   background-color: #ccc  
  // },
  // .tab.selected {
  //   background-color: #ccc
  // },
  gridContainer: {
    backgroundColor: '#ccc',
    flex: 'auto',
    padding: '10px',
    display: 'flex',
  },
  grid: {
    backgroundColor: '#D6D6D6', 
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faChevronLeft: {
    color: '#059995',
    cursor: 'pointer'
  },
  // .fa-chevron-left:hover {
  //   color: #194D4C,
  // },
  faChevronRight: {
    color: '#059995',
    cursor: 'pointer'
  },
  // .fa-chevron-right:hover {
  //   color: #194D4C,
  // },
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  player: {
    backgroundColor: 'black',

  },
  selectButton: {
    marginBottom: '5px',
    backgroundColor: '#96A8D5',
    padding: '10px 20px 10px 20px',
    fontFamily: "'Ubuntu', sans-serif",
    color: '#FFFDFE',
    cursor: 'pointer'
  },
  // #selectButton:hover {
  //   background-color: #91A3CF
  // },
}

export default NewStartupMenu
