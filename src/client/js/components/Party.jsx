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
      inputValue: "",
      displayInvalidParty: false
    }
  }

  componentDidMount() {
    this.setState({ partyId: this.props.partyId })
  }

  componentWillReceiveProps(newProps) {
    if(newProps.partyId && newProps.validParty) this.setState({
      partyId: newProps.partyId,
      hasCreatedParty: true,
      clickedJoinParty: false,
      displayInvalidParty: false
    })
    else if(!newProps.validParty) this.setState({ displayInvalidParty: true })
  }

  createParty = () => {
    if(!this.state.partyId) {
      let randomId = this.generateRandomId()
      this.props.joinParty(randomId)
    }
  }

  generateRandomId = () => {
    return (
      this.getRandom(0, 99) + "." +
      this.getRandom(0, 99) + "." +
      this.getRandom(0, 99) + "." +
      this.getRandom(0, 99)
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

  toggleJoinParty = () => {
    this.setState({ clickedJoinParty: !this.state.clickedJoinParty, displayInvalidParty: false  })
  }

  joinParty = (value) => {
    let ths = this
    console.log('joinPartyRequest', ths.state.inputValue)
    socket.emit('joinPartyRequest', ths.state.inputValue)
  }

  handleInput = (evt) => {
    this.setState({  inputValue: evt.target.value })
  }

  render() {
    return (
        <div id="partyContainer">
          <div className={this.state.hasCreatedParty ? "createParty created" : "createParty"} onClick={this.createParty}>
            {this.state.hasCreatedParty ? this.state.partyId + "    " : "Create Party    "}
            <i className="fa fa-users"></i>
          </div>
          <div id="joinParty">
            <div id="joinPartyText" onClick={this.toggleJoinParty}> Join Party </div>
            <div className={this.state.clickedJoinParty ? "inputPartyContainer" : "inputPartyContainer hidden"}>
              <div id="inputPartyContainerInner">
              <input
                className="partyInput"
                onChange={this.handleInput}
                ref="inputParty"
              />
              <i className="fa fa-plus" onClick={this.joinParty}/>
              </div>
              <div className={this.state.displayInvalidParty ? "wrongParty" : "wrongParty hidden"}> (invalid party id) </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Party
