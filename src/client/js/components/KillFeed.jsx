import React from 'react'
import Radium from 'radium'
import bodyShotImage from '../../assets/BodyShotIcon.png'
import headShotImage from '../../assets/HeadShotIcon.png'



@Radium
class KillFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      killfeed: [],
      currentIdx: 0
    }
  }

  componentDidMount() {
    let newList = this.state.killfeed 
    newList.push(this.props.newKill)
    this.setState({ killfeed: newList, currentIdx: this.props.newKill.idx})
  }

  componentWillReceiveProps(newProps) {
    if(newProps.newKill.idx !== this.state.currentIdx) {
      let newList = this.state.killfeed 
      newList.push(newProps.newKill)
      this.setState({ killfeed: newList, currentIdx: newProps.newKill.idx })
    }
  }


  render() {
    return (
      <div id="killFeedContainer" style={Style.killFeedContainer}>
        <ul id="killFeedList" style={Style.killFeedList}>
        {
          this.state.killfeed.length && this.state.killfeed.map((killInfo, idx) => {
            return (
              <li key={idx}>
                <div>
                  <span> {killInfo.killerPlayer} </span>
                  <span> {killInfo.killType} </span>
                  <span> {killInfo.killedPlayer} </span>
                </div>
              </li>
            )
          })
        }
        </ul>
      </div>
    )
  }
}

const Style = {
  killFeedContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    width: '200px',
    height: '200px',
    position: 'fixed',
    top: '0px'
  },
  killFeedList: {

  },
  singleKill: {

  }
}

export default KillFeed
