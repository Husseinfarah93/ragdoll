import React from 'react'
import '../styles/SkinModal.scss'
import config from '../../../../config.json'
let skins = config.gameInfo.skins

class SkinModal extends React.Component {
  constructor() {
    super()
    this.state = {
      skinList: [],
      currentSkinGroup: {},
      currentSkin: {},
      skinGroupIndex: 0,
      skinIndex: 0,
      skinGroupName: '',
      skinName: '',


      showAmount: 0,
      arrToMap: [],
      currentPage: 0,
      currentSelected: 0,
      coloursArr: [
        "#f1c40f",
        "#34495E",
        "#59ABE3",
        "#D24D57",
        "#00B16A",
        "#F62459",
        "#e67e22",
        "#9b59b6",
        "#f1c40f",
        "#34495E",
        "#59ABE3",
        "#D24D57",
        "#00B16A",
        "#F62459",
        "#e67e22",
        "#9b59b6",
        "#f1c40f",
        "#34495E",
        "#59ABE3",
        "#D24D57",
        "#00B16A",
        "#F62459",
        "#e67e22",
        "#9b59b6",
        "#f1c40f",
        "#34495E",
        "#59ABE3",
        "#D24D57",
        "#00B16A",
        "#F62459",
        "#e67e22",
        "#9b59b6",
      ],
    }
  }

  componentDidMount() {
    let amount = this.props.showAmount
    let skinList = this.genList(skins, amount)
    this.setState({
      showAmount: amount,
      arrToMap: new Array(amount).fill(""),
      currentSelected: this.props.currentSelected,
      currentPage: this.props.currentPage,

      skinList: skinList,
      currentSkinGroup: skinList[this.props.currentPage],
      skinGroupIndex: this.props.currentPage,
      skinIndex: this.props.currentSelected,
      skinGroupName: this.props.skinGroupName,
      skinName: this.props.skinName
    })
  }

  componentWillUnmount() {
    let s = this.state
    this.props.updateSkinInfo(s.currentSelected, s.coloursArr[s.currentSelected], s.currentPage, s.skinGroupName, s.skinName)
  }

  genList = (skins, num) => {
    let finalArr = []
    // e.g basic, comics
    for(let skinGroup in skins) {
      let tempArr = [];
      // e.g yellow, blue
      let skinsInGroup = skins[skinGroup];
      let skinList = Object.keys(skinsInGroup).map(e => ({name: e, src: `../../assets/images/skinFaces/${e}.png`}))
      let count = 0, arrToAdd = [];
      for(let i = 0; i < skinList.length; i++) {
        if(count === num) {
          tempArr.push(arrToAdd)
          arrToAdd = []
          count = 0
        }
        arrToAdd.push(skinList[i])
        count++
      }
      tempArr.push(arrToAdd)
      for(let skins of tempArr) finalArr.push({groupName: skinGroup, skins: skins})
    }
    console.log(finalArr)
    return finalArr
  }

  isFirstPage = () => {
    return this.state.currentPage === 0
  }

  isLastPage = () =>  {
    return this.state.currentPage === (this.state.coloursArr.length / this.state.showAmount) - 1
  }

  moveLeftPage = () =>  {
    if(!this.isFirstPage())  this.setState({
      currentPage: this.state.currentPage - 1,
      skinGroupIndex: this.state.skinGroupIndex - 1,
      currentSkinGroup: this.state.skinList[this.state.skinGroupIndex - 1]
    })
  }

  moveRightPage = () =>  {
    if(!this.isLastPage())  this.setState({
      currentPage: this.state.currentPage + 1,
      skinGroupIndex: this.state.skinGroupIndex + 1,
      currentSkinGroup: this.state.skinList[this.state.skinGroupIndex + 1]
    })
  }

  selectSkin = (actualIndex, skinIndex) => {
    let selectedGroup = this.state.skinList[this.state.currentPage]
    console.log(selectedGroup)
    this.setState({
      currentSelected: actualIndex,
      skinIndex: skinIndex,
      skinGroupName: selectedGroup.groupName,
      skinName: selectedGroup.skins[skinIndex].name
    })
  }

  render() {
    return (
      <div id="skinModal">
        <div id="skinDisplay">
          {/* <div
            className="skinBackground"
            style={{backgroundImage: `url("../../assets/images/${this.state.coloursArr[this.state.currentSelected].slice(1)}.png")`}}
          /> */}
          <div className="newSkinBackground">
            {/* <img id="skinBackgroundImage" src="../../assets/images/skinBodies/deadpool.png" /> */}
          </div>
        </div>
        <div id="skinsCarousal">
          <div id="skinsText">{this.state.currentSkinGroup.groupName}</div>
          <div id="restSkins">
            <div id="buttons">
              <div id="leftButton" className={this.isFirstPage() ? "button disabled": "button"} onClick={this.moveLeftPage}>
                <i className="fa fa-arrow-left" />
              </div>
              <div id="rightButton" className={this.isLastPage() ? "button disabled": "button"} onClick={this.moveRightPage}>
                <i className="fa fa-arrow-right" />
              </div>
            </div>
            <div id="skinsContainer">
              {/* {
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
              } */}
              {
                this.state.currentSkinGroup.skins &&
                this.state.currentSkinGroup.skins.map((element, idx) => {
                  let actualIndex = (this.state.currentPage * this.state.showAmount) + idx
                  let isSelected = this.state.currentSelected === actualIndex
                  return (
                    <div key={actualIndex} className={isSelected ? "newSkinOption selected" : "newSkinOption"} onClick={() => this.selectSkin(actualIndex, idx)}>
                      <img src={element.src} className="newSkinOptionImage"></img>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SkinModal
