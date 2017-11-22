import React from 'react'
import Radium from 'radium'
import "../styles/ProgressBar.scss"

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
          <div className="progressTextContainer" style={Style.textContainer}>
            <span className={!this.props.isSkillPoint || this.props.plusIconCanClick ? "progressText" : "progressText disabled"} style={{ ...Style.text, fontSize: this.props.fontSize }}> {this.props.text} </span>

          </div>
          <div className={this.props.plusIconCanClick ? "plusIcon" : "plusIcon disabled"} style={{ ...Style.plusIcon, display: this.props.plusIcon, right: this.props.plusIconRight }} onClick={() => this.props.handleSkillPointsClick(this.props.name, this.props.progressVal)}> + </div>
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
    fontFamily: "Quicksand",
    userSelect: "none"
  },
  plusIcon: {
    position: "absolute",
    userSelect: "none"
  },
}

export default ProgressBar
