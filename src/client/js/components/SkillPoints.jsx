import React from 'react'
import Radium from 'radium'
import ProgressBar from './ProgressBar.jsx'

@Radium
class SkillPoints extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    let progressBarList = Object.keys(this.props.skillPointValues).map(e => this.props.skillPointValues[e])
    return (
      <div style={Style.Container}>
        <div id="skillPointsCircle" style={Style.skillPointsCircle}>
          <span style={Style.skillPointNumber}> {this.props.skillPoints} </span>
        </div>
        {progressBarList.length > 0 && progressBarList.map(progressBarElem => (
          <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress={`${progressBarElem.val}%`} progressVal={progressBarElem.val} name={progressBarElem.name} progressColour={progressBarElem.colour} text={progressBarElem.text} textColour="#FFFFFF" plusIcon="inline" plusColour="#FFFFFF" plusIconRight="10px" handleSkillPointsClick={this.props.handleSkillPointsClick} fontSize="12px"/>
          )
        )}
      </div>
    )
  }
}

const Style = {
  Container: {
    width: "200px",
    position: "fixed",
    bottom: "10px",
    left: "10px",
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  skillPointsCircle: {
    width: "20px",
    height: "20px",
    backgroundColor: "#F0433A",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "90px",
    fontSize: "10px"
  },
  skillPointNumber: {
    fontFamily: "Ubuntu",
    color: "#FFFFFF"
  }
}

export default SkillPoints