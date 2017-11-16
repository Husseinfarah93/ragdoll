import React from 'react'
import "../styles/Party.scss"

class Party extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCreatedParty: false,
      partyId: "",
      clickedJoinParty: false
    }
  }

  componentDidMount() {
  }

  createParty = () => {
    this.setState({ hasCreatedParty: true, partyId: "192.186.99.0"  })
  }

  joinParty = () => {
    this.setState({ clickedJoinParty: true  })
  }

  render() {
    return (
        <div id="partyContainer">
          <div className={this.state.hasCreatedParty ? "createParty created" : "createParty"} onClick={this.createParty}>
            {this.state.hasCreatedParty ? this.state.partyId + "    " : "Create Party    "}
            <i className="fa fa-users"></i>
          </div>
          <div id="joinParty" onClick={this.joinParty}>
            Join Party
            <input className={this.state.clickedJoinParty ? "partyInput" : "partyInput hidden"} />
          </div>
        </div>
    )
  }
}

export default Party
