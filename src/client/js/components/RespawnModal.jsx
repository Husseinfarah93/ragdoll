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
      <div id="modal" style={Style.modal}>
        <button onClick={this.props.respawnPlayer} />  
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
  }
}

export default RespawnModal
