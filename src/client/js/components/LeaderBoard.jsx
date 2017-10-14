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
            <th className="leaderBoardHeaderCell" style={Style.thFirst}> Rank </th>
            <th className="leaderBoardHeaderCell" id='headerName' style={Style.thName}> Name </th>
            <th className="leaderBoardHeaderCell" style={Style.th}> Kill Streak </th>
            <th className="leaderBoardHeaderCell" style={Style.th}> Belt </th>
          </tr>
          {
            this.props.leaderBoard.length && this.props.leaderBoard.map((player, idx) => {
              let colorStyle = {color: player.colour}
              return (
                <tr className="leaderBoardPlayer" key={idx} style={colorStyle}>
                  <td className="leaderBoardPlayerRank" style={Style.tdFirst}>{'#' + (idx + 1).toString()}</td>
                  <td className="leaderBoardPlayerName" style={Style.th}>{player.name}</td>
                  <td className="leaderBoardPlayerKillStreak" style={Style.th}>{player.killStreak}</td>
                  <td className="leaderBoardPlayerKillStreak" style={Style.th}>White</td>
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
    right: '20px',
    fontFamily: 'Ubuntu',
  },
  th: {
    textAlign: 'left',
    padding: '0px 10px 0px 10px'
  },
  thName: {
    textAlign: 'left',
    width: '120px',
    padding: '0px 10px 0px 10px'
  },
  tdFirst: {
    padding: '0px 10px 0px 0px',
  },
  thFirst: {
    textAlign: 'left',
    padding: '0px 10px 0px 0px'
  }
}

export default LeaderBoard
