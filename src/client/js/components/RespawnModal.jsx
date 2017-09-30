import React from 'react'
import Radium from 'radium'



@Radium
class RespawnModal extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div id='respawnModal' style={Style.respawnModal}>
        <h3> Killstreak: 10 </h3>
        <h3> (Press enter to respawn) </h3> 
        <div id='shareContainer'>
          <a id='facebookShare' style={Style.facebookShare}>Share on Facebook</a>
          <a id='twitterShare' style={Style.twitterShare}>Share on Twitter</a>
        </div>
      </div>
    )
  }
}

const Style = {
  modal: {
    width: '600px',
    height: '300px',
    position: 'fixed',
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
    backgroundColor: 'yellow'
  },
  respawnModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    display: 'flex',
    borderRadius: '5px',
    width: '350px',
    height: '200px',
    marginTop: '-150px',
    marginLeft: '-175px',
    backgroundColor: '#ccc',
    fontFamily: 'Ubuntu',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  facebookShare: {
    backgroundColor: '#3B5998',
    padding: '5px 10px 5px 10px',
    borderRadius: '2px',
    marginRight: '20px',
    cursor: 'pointer'
  },
  twitterShare: {
    backgroundColor: '#1DA1F2',
    padding: '5px 10px 5px 10px',
    borderRadius: '2px',
    cursor: 'pointer'
  }
}

export default RespawnModal
