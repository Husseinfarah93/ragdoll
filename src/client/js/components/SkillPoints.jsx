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
    return (
      <div style={Style.Container}>
            <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress="10%" progressColour="#18C29C" text=" Max Health " textColour="#FFFFFF" plusIcon="inline" plusIconRight="10px"/>
            <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress="10%" progressColour="#FFBC40" text=" Max Speed " textColour="#FFFFFF" plusIcon="inline" plusIconRight="10px"/>
            <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress="10%" progressColour="#F16F61" text=" Damage Dealt " textColour="#FFFFFF" plusIcon="inline" plusIconRight="10px"/>
            <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress="10%" progressColour="#4A89AA" text=" Health Regen " textColour="#FFFFFF" plusIcon="inline" plusIconRight="10px"/>
            <ProgressBar containerWidth="200px" containerHeight="15px" borderRadius="15px" progress="10%" progressColour="#5A3662" text=" Flexibility" textColour="#FFFFFF" plusIcon="inline" plusIconRight="10px"/>
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
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end"
  }
}

export default SkillPoints