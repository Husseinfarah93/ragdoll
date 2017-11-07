import React from 'react'
import Radium from 'radium'
import bodyShotImage from '../../assets/images/icons/BodyShotIcon.png'
import headShotImage from '../../assets/images/icons/HeadShotIcon.png'

@Radium
class KillFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      killfeed: [],
      currentIdx: 0
    }
    this.removeKill = this.removeKill.bind(this)
  }

  componentDidMount() {
    this.updateKillFeed(this.props)
  }

  componentWillReceiveProps(newProps) {
    if(newProps.newKill.idx !== this.state.currentIdx) {
      this.updateKillFeed(newProps)
    }
  }

  updateKillFeed(props) {
    let newList = this.state.killfeed
    newList.push(props.newKill)
    Style.playerNameLeft.color = props.newKill.killerPlayerColour
    Style.playerNameRight.color = props.newKill.killedPlayerColour
    this.setState({ killfeed: newList, currentIdx: props.newKill.idx })
    setTimeout(this.removeKill, 10000)
  }


  removeKill() {
    let list = this.state.killfeed
    let newList = this.state.killfeed.slice(1)
    if(list.length) this.setState({ killfeed: newList })
  }


  render() {
    return (
      <div id="killFeedContainer" style={Style.killFeedContainer}>
        <ul id="killFeedList" style={Style.killFeedList}>
        {
          this.state.killfeed.length > 0 && this.state.killfeed.map((killInfo, idx) => {
            return (
              <li key={idx}>
                <div id='killContainer' style={Style.killContainer}>
                  <span style={Style.playerNameLeft}> {killInfo.killerPlayer} </span>
                  <span style={killInfo.killType === 'body' ? Style.killIconBody : Style.killIconHead} />
                  <span style={Style.playerNameRight}> {killInfo.killedPlayer} </span>
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
    width: '200px',
    position: 'fixed',
    top: '50px',
    left: '10px'
  },
  killFeedList: {
    listStyle: 'none',
    padding: '0px',
    margin: '0px'
  },
  singleKill: {
    //
  },
  killIconBody: {
    background: `url(${bodyShotImage})`,
    width: '20px',
    height: '20px',
    backgroundSize: '20px 20px',

  },
  killIconHead: {
    background: `url(${headShotImage})`,
    width: '20px',
    height: '20px',
    backgroundSize: '20px 20px',

  },
  killContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2px'
  },
  playerNameLeft: {
    padding: '0px 10px 0px 10px',
    fontFamily: 'Ubuntu',
    color: 'blue'
  },
  playerNameRight: {
    padding: '0px 10px 0px 10px',
    fontFamily: 'Ubuntu',
    color: 'green'
  }
}

export default KillFeed
