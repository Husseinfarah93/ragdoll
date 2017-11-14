import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import '../styles/TextInfo.scss'


class TextInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      idx: 0,
      text: "",
      colour: ""
    }
  }

  componentDidMount() {
    this.setState({ idx: this.props.idx, text: this.props.text, colour: this.props.colour })
  }

  componentWillReceiveProps(newProps) {
    if(newProps.idx === this.state.idx) return
    this.setState({
      idx: newProps.idx,
      text: newProps.text,
      colour: newProps.colour
    })
  }


  render() {
    return (
      <div id="textInfoContainer">
        <h1 id="text" style={{  color: this.state.colour  }}>{this.state.text}</h1>
      </div>
    )
  }
}

export default TextInfo
