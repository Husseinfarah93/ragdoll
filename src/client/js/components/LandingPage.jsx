import React from 'react'
import '../styles/LandingPage.scss'
import SkinModal from './SkinModal.jsx'

class LandingPage extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      currentGameMode: 'FFA',
      showSkinModal: false,
      currentCharacter: 'basic',
      currentSkin: 'basic',
      skinIcon: undefined,
      bg: undefined,
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.playGame)
    this.setState({ skinIcon: this.refs.skinIcon, bg: this.refs.landingPageContainer  })
  }

  toggleSkinModal = () => {
    this.setState({ showSkinModal: !this.state.showSkinModal })
  }

  playGame = (evt) => {
    if(evt.keyCode === 13) {
      window.removeEventListener('keydown', this.playGame)
      this.props.startGame(this.state.name.toUpperCase(), this.state.currentGameMode, this.state.currentCharacter, this.state.currentSkin)
    }
  }

  changeName = (evt) => {
    this.setState({ name: evt.target.value })
  }

  render() {
    return (
      <div id="landingPageContainer" ref="landingPageContainer" onClick={() => {
        if(this.state.showSkinModal) this.toggleSkinModal()
      }}>
        <div className={this.state.showSkinModal ? "container blurred" : "container normal"}>
          <h2 id="title"> RAGDOLL.IO </h2>
          <input placeholder="Hero Name... " id="nameInput" autoFocus="off" autoComplete="off" maxLength="15" onChange={this.changeName} />
          <p id="enterMessage">(enter to join)</p>
        </div>
        <div id="bottomBanner">
          <span>About Us</span>
          &nbsp; | &nbsp;
          <span>Contact</span>
          &nbsp; | &nbsp;
          <span>Privacy</span>
          &nbsp; | &nbsp;
          <span>Changelog</span>
        </div>
        <a className="icon settings">&#9881;</a>
        <img className="icon leaderboard" src="http://www.freeiconspng.com/uploads/leaderboard-icon-5.png" />
        <img className="icon controller" src="https://maxcdn.icons8.com/Share/icon/p1em/Gaming//controller1600.png" />
        <img className="icon skin" id="skinIcon" src="https://i.imgur.com/dEPAF5R.png" ref="skinIcon" onClick={this.toggleSkinModal}/>
        <div id="socialIcons">
          <img className="social" id="twitterIcon" src="https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697029-twitter-512.png" />
          <img className="social" id="facebookIcon" src="https://image.flaticon.com/icons/png/512/124/124010.png" />
          <img className="social" id="redditIcon" src="https://cdn.worldvectorlogo.com/logos/reddit-2.svg" />
          <img className="social" id="discordIcon" src="https://user-images.githubusercontent.com/11203357/29274582-4be0c7e2-8100-11e7-83c8-0435aee88626.png" />
        </div>
        {this.state.showSkinModal && <SkinModal />}
      </div>
    )
  }
}

export default LandingPage
