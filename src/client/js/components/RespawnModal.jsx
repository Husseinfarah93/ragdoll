import React from 'react'
import '../styles/RespawnModal.scss'


class RespawnModal extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div id="modal">
        <div id="lifeInfo">
          <div id='beltInfo'>
            <div>
              {`${this.props.beltColour} BELT`}
            </div>
            {/* <div id="star" style={{color: this.props.beltColour}}>★</div> */}
          </div>
          <h1 id='killStreakValue'>{this.props.killStreak}</h1>
          <p id="killStreakText">Killstreak</p>
          <br />
          <br />
          (enter to respawn)
        </div>
        <div id="shareInfo">
          <div id="facebook">
            <i className="fa fa-facebook"></i>
          </div>
          <div id="twitter">
            <i className="fa fa-twitter"></i>
          </div>
        </div>
      </div>
    )
  }
}

export default RespawnModal
