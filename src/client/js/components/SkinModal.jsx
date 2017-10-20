import React from 'react'
import '../styles/SkinModal.scss'


class SkinModal extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div id="skinModal">
        <div id="skinDisplay">

        </div>
        <div id="skinsCarousal">
          <div id="skinsContainer">
            <div id="yellowSkin" className="skinOption"></div>
            <div id="blueSkin" className="skinOption"></div>
            <div id="redSkin" className="skinOption"></div>
            <div id="greenSkin" className="skinOption"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default SkinModal
