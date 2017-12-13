import React from 'react'
import Radium from 'radium'
import socket from '../io.js'
import "../styles/LeaderBoard.scss"

@Radium
class LeaderBoard extends React.Component {
  constructor() {
    super()
  }

  isInLeaderBoard = (leaderBoard, id) => {
    for(let player of leaderBoard) {
      if(player.id === id)  return true
    }
    return false
  }

  getPlayerInLeaderBoard = (leaderBoard, id) => {
    for(let player of leaderBoard) {
      if(player.id === id)  return player
    }
  }

  render() {
    let slicedLeaderBoard = this.props.leaderBoard.slice(0, 5)
    if(slicedLeaderBoard.length && !this.isInLeaderBoard(slicedLeaderBoard, socket.id)) {
      let player = this.getPlayerInLeaderBoard(this.props.leaderBoard, socket.id)
      slicedLeaderBoard.push(player)
    }
    return (
      <div className="leaderBoard">
        <table className="leaderBoardTable">
          <tr className="leaderBoardHeader">
            <th className="thFirst"> Rank </th>
            <th className="th" id='headerName'> Name </th>
            <th className="th"> Kill Streak </th>
            <th className="th"> Belt </th>
          </tr>
          {
            this.props.leaderBoard.length && slicedLeaderBoard.map((player, idx) => {
              let isCurrentPlayer = socket.id === player.id
              return (
                <tr className={socket.id === player.id ? "leaderBoardPlayer current" : "leaderBoardPlayer"} key={idx}>
                  <td className="tdFirst">{'#' + player.position.toString()}</td>
                  <td className="th">{player.name}</td>
                  <td className="th">{player.killStreak}</td>
                  <td className="th">{player.beltColour.toUpperCase()}</td>
                </tr>
              )
            })
          }
        </table>
      </div>
    )
  }
}

export default LeaderBoard
