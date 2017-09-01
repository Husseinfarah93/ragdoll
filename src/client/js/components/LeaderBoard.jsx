import React from 'react'
import Radium from 'radium'

@Radium
class LeaderBoard extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="leaderBoard" style={Style.leaderBoard}>
        <table className="leaderBoardTable">
          <tr className="leaderBoardHeader">
            <th className="leaderBoardHeaderCell"> Rank </th>
            <th className="leaderBoardHeaderCell"> Name </th>
            <th className="leaderBoardHeaderCell"> Kill Streak </th>
          </tr>
          {
            this.props.leaderBoard.length && this.props.leaderBoard.map((player, idx) => {
              return (
                <tr className="leaderBoardPlayer" key={idx}>
                  <td className="leaderBoardPlayerRank">{'#' + (idx + 1).toString()}</td>
                  <td className="leaderBoardPlayerName">{player.name}</td>
                  <td className="leaderBoardPlayerKillStreak">{player.killStreak}</td>
                </tr>
              )
            })
          }
        </table>
      </div>
    )
  }
}

const Style = {
  leaderBoard: {
    overflow: 'auto',
    display: 'inline-block',
    position: 'absolute',
    top: '20px',
    right: '20px'
  }
}

export default LeaderBoard
