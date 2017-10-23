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
      currentSkin: '#f1c40f',
      skinIcon: undefined,
      bg: undefined,

      skinIndex: 0,
      pageIndex: 0
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

  updateSkinInfo = (skinIndex, skinColourSelected, pageIndex) => {
    this.setState({ skinIndex: skinIndex, currentSkin: skinColourSelected, pageIndex: pageIndex })
  }

  render() {
    return (
      <div id="landingPageContainer" ref="landingPageContainer" onClick={() => {
        // if(this.state.showSkinModal) this.toggleSkinModal()
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
          <img className="social" id="twitterIcon" src="../../assets/images/twitter.png" />
          <img className="social" id="facebookIcon" src="../../assets/images/facebook.png" />
          <img className="social" id="redditIcon" src="../../assets/images/reddit.png" />
          <img className="social" id="discordIcon" src="../../assets/images/discord.png" />
          <img className="social" id="youtubeIcon" src="../../assets/images/youtube.png" />
        </div>
        {this.state.showSkinModal && <SkinModal showAmount={4} currentSelected={this.state.skinIndex} currentPage={this.state.pageIndex} updateSkinInfo={this.updateSkinInfo}/>}
      </div>
    )
  }
}

export default LandingPage
