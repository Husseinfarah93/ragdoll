import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import '../styles/SkillPoints.scss'

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
      <div id="skillPointsContainer">
        <div className={this.props.skillPoints ? "skillPointsCircle" : "skillPointsCircle disabled"}>
          <span id="skillPointNumber"> {this.props.skillPoints} </span>
        </div>
        {progressBarList.length > 0 && progressBarList.map(progressBarElem => {
          let curVal = progressBarElem.curVal
          let initialVal = progressBarElem.initialVal
          let maxVal = progressBarElem.maxVal
          let newPercent = Math.round(Math.abs(100 * (curVal - initialVal) / (maxVal - initialVal)))
          let canClick = newPercent !== 100 && this.props.skillPoints !== 0
          return (
            <ProgressBar
              containerWidth="200px"
              containerHeight="15px"
              borderRadius="15px"
              progress={`${newPercent}%`}
              progressVal={newPercent}
              name={progressBarElem.name}
              progressColour={progressBarElem.colour}
              text={progressBarElem.text}
              textColour="#FFFFFF"
              plusIcon="inline"
              plusColour="#FFFFFF"
              plusIconRight="10px"
              plusIconCanClick={canClick}
              isSkillPoint={true}
              handleSkillPointsClick={this.props.handleSkillPointsClick}
              fontSize="12px"
            />
          )
        }
        )}
      </div>
    )
  }
}

export default SkillPoints
