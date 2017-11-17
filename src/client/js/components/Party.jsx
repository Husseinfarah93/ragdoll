import React from 'react'
import "../styles/Party.scss"
import socket from '../io.js'

class Party extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCreatedParty: false,
      partyId: undefined,
      clickedJoinParty: false,
      inputValue: ""
    }
  }

  componentDidMount() {
    this.setState({ partyId: this.props.partyId })
    window.addEventListener('keydown', e => {
      if(e.keyCode === 220) this.joinParty()
    })
  }

  componentWillReceiveProps(newProps) {
    if(newProps.partyId) this.setState({ partyId: newProps.partyId, hasCreatedParty: true })
  }

  createParty = () => {
    let randomId = this.generateRandomId()
    this.props.joinParty(randomId)
  }

  generateRandomId = () => {
    return (
      this.getRandom(0, 999) + "." +
      this.getRandom(0, 999) + "." +
      this.getRandom(0, 999) + "." +
      this.getRandom(0, 999)
    )
  }

  getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  clickJoinParty = () => {
    this.setState({ clickedJoinParty: true  })
  }

  joinParty = (value) => {
    let ths = this
    console.log('joinPartyRequest', ths.state.inputValue)
    socket.emit('joinPartyRequest', ths.state.inputValue)
  }


  render() {
    return (
        <div id="partyContainer">
          <div className={this.state.hasCreatedParty ? "createParty created" : "createParty"} onClick={this.createParty}>
            {this.state.hasCreatedParty ? this.state.partyId + "    " : "Create Party    "}
            <i className="fa fa-users"></i>
          </div>
          <div id="joinParty" onClick={this.clickJoinParty}>
            Join Party
            <input
              className={this.state.clickedJoinParty ? "partyInput" : "partyInput hidden"}
              onChange={(evt) => this.setState({  inputValue: evt.target.value })}
            />
          </div>
        </div>
    )
  }
}

export default Party
