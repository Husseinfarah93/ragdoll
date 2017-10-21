import React from 'react'
import '../styles/SkinModal.scss'


class SkinModal extends React.Component {
  constructor() {
    super()
    this.state = {
      showAmount: 0,
      arrToMap: [],
      currentPage: 0,
      currentSelected: 0,
      coloursArr: [
        "#D24D57",
        "#34495E",
        "#59ABE3",
        "#f1c40f",
        "#00B16A",
        "#F62459",
        "#e67e22",
        "#9b59b6"
      ],
    }
    this.moveRightPage = this.moveRightPage.bind(this)
    this.moveLeftPage = this.moveLeftPage.bind(this)
    this.selectSkin = this.selectSkin.bind(this)
  }

  componentDidMount() {
    let amount = this.props.showAmount
    this.setState({
      showAmount: amount,
      arrToMap: new Array(amount).fill(""),
      currentSelected: this.props.currentSelected,
      currentPage: this.props.currentPage
    })
  }

  componentWillUnmount() {
    let s = this.state
    this.props.updateSkinInfo(s.currentSelected, s.coloursArr[s.currentSelected], s.currentPage)
  }

  isFirstPage() {
    return this.state.currentPage === 0
  }


  isLastPage() {
    return this.state.currentPage === (this.state.coloursArr.length / this.state.showAmount) - 1
  }


  moveLeftPage() {
    if(!this.isFirstPage())  this.setState({ currentPage: this.state.currentPage - 1 })
  }


  moveRightPage() {
    if(!this.isLastPage())  this.setState({ currentPage: this.state.currentPage + 1 })
  }


  selectSkin(actualIndex) {
    this.setState({ currentSelected: actualIndex })
  }


  render() {
    return (
      <div id="skinModal">
        <div id="skinDisplay">
          <div
            className="skinBackground"
            style={{backgroundImage: `url("../../assets/${this.state.coloursArr[this.state.currentSelected].slice(1)}.png")`}}
          />
        </div>
        <div id="skinsCarousal">
          <div id="buttons">
            <div id="leftButton" className={this.isFirstPage() ? "button disabled": "button"} onClick={this.moveLeftPage}>
              <i className="fa fa-arrow-left" />
            </div>
            <div id="rightButton" className={this.isLastPage() ? "button disabled": "button"} onClick={this.moveRightPage}>
              <i className="fa fa-arrow-right" />
            </div>
          </div>
          <div id="skinsContainer">
            {
              this.state.arrToMap.map((element, idx) => {
                let actualIndex = (this.state.currentPage * this.state.showAmount) + idx
                let isSelected = this.state.currentSelected === actualIndex
                return (
                  <div
                    key={idx}
                    className={isSelected ? "skinOption skinSelected" : "skinOption"}
                    style={{backgroundColor: this.state.coloursArr[actualIndex]}}
                    onClick={() => this.selectSkin(actualIndex)}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default SkinModal
