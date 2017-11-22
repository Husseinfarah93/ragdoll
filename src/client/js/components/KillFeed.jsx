import React from 'react'
import Radium from 'radium'
import bodyShotImage from '../../assets/images/icons/BodyShotIcon.png'
import headShotImage from '../../assets/images/icons/HeadShotIcon.png'
import "../styles/KillFeed.scss"


@Radium
class KillFeed extends React.Component {
  constructor() {
    super()
    this.state = {
      killfeed: [],
      currentIdx: 0,
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
    let newList = this.state.killfeed.slice(0)
    newList.push(props.newKill)
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
      <div className="killFeedContainer">
        <ul className="killFeedList">
        {
          this.state.killfeed.length > 0 && this.state.killfeed.map((killInfo, idx) => {
            return (
              <li key={idx}>
                <div className='killContainer'>
                  <span className="playerName"> {killInfo.killerPlayer} </span>
                  <span className={killInfo.killType === "body" ? "killIconBody" : "killIconHead"} />
                  <span className="playerName"> {killInfo.killedPlayer} </span>
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


export default KillFeed
