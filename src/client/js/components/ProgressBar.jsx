import React from 'react'
import Radium from 'radium'

@Radium
class ProgressBar extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
  }


  render() {
    return (
        <div className="progressContainer" style={{...Style.progressContainer, width: this.props.containerWidth, height: this.props.containerHeight, borderRadius: this.props.borderRadius}}>
          <div className="progress" style={{ ...Style.progress, width: this.props.progress, backgroundColor: this.props.progressColour, borderRadius: this.props.borderRadius }}></div>
          <div className="textContainer" style={Style.textContainer}>
            <span className="text" style={{ ...Style.text, color: this.props.textColour }}> {this.props.text} </span>
          </div>
          <div className="plusIcon" style={{ ...Style.plusIcon, display: this.props.plusIcon, right: this.props.plusIconRight }}> + </div>
      </div>
    )
  }
}

const Style = {
  progressContainer: {
    backgroundColor: "#6B202E",
    display: "flex",
    alignItems: "center",
    position: "relative",
    margin: "5px 0px 5px 0px"
  },
  progress: {
    height: "79%",
    margin: "8px 3px 8px 3px",
    left: "0px"
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  text: {
    fontFamily: "Ubuntu",
  },
  plusIcon: {
    position: "absolute",
    color: "#FFFFFF",
    cursor: "pointer"
  },
}

export default ProgressBar