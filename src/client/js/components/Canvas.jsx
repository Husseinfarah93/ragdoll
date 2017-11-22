import React from 'react'
import Radium from 'radium'
import socket from '../io.js'
import Camera from './Camera.js'
import LeaderBoard from './LeaderBoard.jsx'
import RespawnModal from './RespawnModal.jsx'
import KillFeed from './KillFeed.jsx'
import config from '../../../../config.json'
import BloodParticle from '../BloodParticle.js'
import ProgressBar from './ProgressBar.jsx'
import TextInfo from './TextInfo.jsx'
import SkillPoints from './SkillPoints.jsx'
let bloodConfig = config.gameInfo.bloodParticles
let skins = config.gameInfo.skins
let count = 0



@Radium
class Canvas extends React.Component {
    constructor() {
      super()
      this.state = {
        canvas: undefined,
        gridCanvas: undefined,
        leaderBoard: [],
        playerDead: false,
        newKill: undefined,
        id: socket.id,
        backgroundText: {
          text: "",
          colour: "",
          idx: 0,
          show: true
        },
        player: {
          name: "",
          skillPoints: 0,
          skillPointValues: {},
          killStreak: 0,
          beltColour: "",
          beltProgress: 0,
        },
        skinObj: {}

      }
      this.keyDown = {
        up: false,
        right: false,
        down: false,
        left: false
      }
      this.respawnPlayer = this.respawnPlayer.bind(this)
      this.createBloodParticles = this.createBloodParticles.bind(this)
      this.handleSkillPointsClick = this.handleSkillPointsClick.bind(this)
      this.bloodParticles = []
    }

    componentDidMount() {
      console.log('cvs: ', this.refs)
      let skinObj = this.generateSkinImages(skins)
      this.setState({ canvas: this.refs.canvas, gridCanvas: this.refs.gridCanvas, skinObj: skinObj })
      this.addListeners()
      this.setUpSockets()
    }

    setUpSockets() {
      console.log('socket id: ', socket.id)
      // Emit playerList, healthList, wallList
      let self = this
      socket.on('setUpWorld', (worldWidth, worldHeight) => {
        let canvas = self.state.canvas
        this.setUpCamera(worldWidth, worldHeight, this.state.canvas)
        this.generateBackground(canvas.width, canvas.height)
        this.drawPlayerGrid()
      })

      socket.on('setUpPlayer', (name, skillPoints, skillPointValues, killStreak, beltColour, beltProgress) => {
        let newPlayer = {...this.state.player, name: name, skillPoints: skillPoints, skillPointValues: skillPointValues, killStreak: killStreak, beltColour: beltColour, beltProgress: beltProgress}
        this.setState({ player: newPlayer })
      })

      socket.on('draw', (Players, HealthPacks, Walls, Pelvis, id) => {
        this.camera.update(Pelvis)
        this.drawBackground(this.camera)
        // this.drawPlayers(Players, this.camera)
        this.newDrawPlayers(Players, this.camera)
        if(this.bloodParticles.length) this.drawBloodParticles()
        this.drawHealthPacks(HealthPacks)
        this.drawWalls(Walls, this.camera)
        this.keydownLoop = setTimeout(() => socket.emit('keydown', self.keyDown.left, self.keyDown.up, self.keyDown.right, self.keyDown.down), 15)
      })

      socket.on('updateLeaderBoard', leaderBoard => {
        this.setState({ leaderBoard: leaderBoard })
      })

      socket.on('playerDeath', deathInfo => {
        this.handleDeath(deathInfo)
      })

      socket.on('updateKillFeed', (killerPlayer, killType, killedPlayer, killerPlayerColour, killedPlayerColour) => {
        this.handleNewKill(killerPlayer, killType, killedPlayer, killerPlayerColour, killedPlayerColour)
      })

      socket.on('createBlood', (x, y) => {
        let camera = this.camera
        let newX = x - camera.xPos
        let newY = y - camera.yPos
        this.createBloodParticles(newX, newY, bloodConfig.particleNumber)
      })

      socket.on('updatePlayer', (skillPoints, skillPointValues, beltColour, beltProgress, killStreak) => {
        let newPlayer = {
          ...this.state.player,
          skillPoints: skillPoints,
          skillPointValues: skillPointValues,
          beltColour: beltColour,
          beltProgress: beltProgress,
          killStreak: killStreak
        }
        this.setState({ player: newPlayer })
      })

      socket.on('updateBGText', (text, colour) => {
        this.setState({ backgroundText: {...this.state.backgroundText, show: false  }})
        let newBG = {
          text: text,
          colour: colour,
          idx: this.state.backgroundText.idx + 1,
          show: true
        }
        this.setState({ backgroundText: newBG })
      })

      socket.on('playSound', soundType => {
        let hitLength = this.props.audio.hit.length
        let r = Math.ceil(Math.random() * (hitLength)) - 1
        if(soundType === 'hit') this.props.audio[soundType][r].play()
        else this.props.audio[soundType].play()
      })

      window.addEventListener('keydown', e => {
        if(e.keyCode === 80) socket.emit('createBot')
        if(e.keyCode === 79) socket.emit('logRooms')
      })

    }

    generateSkinImages(skins) {
      let skinList = []
      let skinObj = {}
      let skinGroups = Object.keys(skins)
      for(let skin of skinGroups) skinList = skinList.concat(Object.keys(skins[skin]))
      for(let skin of skinList) {
        let img = new Image(50, 50)
        img.src = `../../assets/images/skinFaces/${skin}.png`
        skinObj[skin] = img
      }
      return skinObj
    }


    /*  HANDLE CODE   */


    handleSkillPointsClick(progressBarType, currentProgress) {
      if(currentProgress >= 100 || this.state.player.skillPoints < 1) return
      socket.emit('updatePlayerSkillPoints', progressBarType)
    }

    handleNewKill(killerPlayer, killType, killedPlayer, killerPlayerColour, killedPlayerColour) {
      this.setState({ newKill: {
        killerPlayer,
        killType,
        killedPlayer,
        killerPlayerColour,
        killedPlayerColour,
        idx: this.state.newKill ? this.state.newKill.idx + 1 : 0
      } })
    }

    handleDeath(deathInfo) {
      window.addEventListener('keydown', this.respawnPlayer)
      this.setState({ playerDead: true })
    }

    respawnPlayer(e) {
      if(e.keyCode === 13) {
        window.removeEventListener('keydown', this.respawnPlayer)
        this.setState({ playerDead: false })
        socket.emit('respawn')
      }
    }


    /*  DRAW CODE   */


    drawPlayers(players, camera) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      let xPos = camera.xPos
      let yPos = camera.yPos
      let bandList = []
      for(let k = 0; k < players.length; k++) {
        let player = players[k]
        if(player.isDead) continue
        let bodies = player.vertices
        for (var i = 0; i < bodies.length; i += 1) {
          context.beginPath();
          var vertices = bodies[i];
          let hitInfo = vertices[0].hitInfo
          context.moveTo(vertices[0].x - xPos, vertices[0].y - yPos);
          for (var j = 1; j < vertices.length; j += 1) {
              context.lineTo(vertices[j].x - xPos, vertices[j].y - yPos);
          }

          context.lineTo(vertices[0].x - xPos, vertices[0].y - yPos);
          let label = vertices[0].label
          context.lineWidth = 1;
          context.strokeStyle = player.colour;
          context.fillStyle = player.colour

          if(label === 'armband') {
            var health = player.health
            var percentage = health / 200
            context.strokeStyle = percentage === 1 ? player.colour : `rgba(255, 0, 0, ${1 - percentage})`
            context.fillStyle = percentage === 1 ? player.colour : `rgba(255, 0, 0, ${1 - percentage})`;
          }
          context.stroke();
          context.fill();
          if(hitInfo && label !== 'armband') {
            let percent = hitInfo.percent
            context.strokeStyle = `rgba(255, 0, 0, ${percent}`
            context.fillStyle = `rgba(255, 0, 0, ${percent}`
            context.stroke();
            context.fill();
          }
        }

        // this.drawHealthBar(context, canvas.width / 2, (canvas.height / 2) + 90, players[k].health)
        let xName = this.state.id === player.id ? canvas.width / 2 : player.pelvis.x - xPos
        let yName = this.state.id === player.id ? canvas.height / 2 : player.pelvis.y - yPos
        this.drawName(context, xName, yName, player.name)
        if(player.id === socket.id) this.drawPlayerGrid(player.pelvis.x, player.pelvis.y)
      }
        // this.drawArmBands(xPos, yPos, context, bandList)
    }

    newDrawPlayers(players, camera) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      let xPos = camera.xPos
      let yPos = camera.yPos
      //for player of players
      for(let i = 0; i < players.length; i++) {
        let player = players[i]
        if(player.isDead || !player.pointsList || !player.headPosition) continue
        if(player.isBlownUp) {
          this.drawBlownUpCircles(player, xPos, yPos, context)
        }
        else {
          this.newDrawBody(player, xPos, yPos, context)
          this.newDrawHead(player, xPos, yPos, context)
          this.drawArmBands(player, xPos, yPos, context)
          this.drawHitPart(player, xPos, yPos, context)
          this.drawBelt(player, xPos, yPos, context, 10, "black")
          this.drawBelt(player, xPos, yPos, context, 7, player.belt.colour)
          this.drawName(context, player.pelvis.x - xPos - 15, player.pelvis.y - yPos + 20, player.name)
        }
        let xName = this.state.id === player.id ? canvas.width / 2 : player.pelvis.x - xPos
        let yName = this.state.id === player.id ? canvas.height / 2 : player.pelvis.y - yPos
        // if(player.id === socket.id) this.drawPlayerGrid(player.pelvis.x, player.pelvis.y)
      }
      this.drawPlayerGrid(players)
    }

    drawBody(player, xPos, yPos, ctx) {
      for(let list of player.pointsList) {
        let colour = '#272727'
        let skinType = player.skinType
        ctx.lineWidth = 20
        ctx.lineCap = "round"
        ctx.strokeStyle = ctx.fillStyle = list[0].label === 'torso' ||
        list[0].label === 'rightThigh' ||
        list[0].label === 'leftThigh' ||
        list[0].label === 'rightArm' ||
        list[0].label === 'leftArm' ? skinType : '#2F3B40'
        ctx.beginPath()
        ctx.moveTo(list[0].x - xPos, list[0].y - yPos)
        for(let i = 1; i < list.length; i++) {
          ctx.lineTo(list[i].x - xPos, list[i].y - yPos)
        }
        ctx.stroke()
      }
    }

    newDrawBody(player, xPos, yPos, ctx) {
      let torso;
      let layers = skins[player.skinCategory][player.skinName]
      for(let list of player.pointsList) {
        if(list[0].label === "head") continue
        if(list[0].label === "torso") torso = list
        this.drawBodyPart(list, layers, ctx, 20, xPos, yPos)
      }
      this.drawBodyPart(torso, layers, ctx, 20, xPos, yPos)
    }

    drawBodyPart(list, layers, ctx, lineWidth, xPos, yPos) {
      for(let layer of layers[list[0].label]) {
    		let width = layer.width
    		let colour = layer.colour
    		ctx.lineWidth = lineWidth * width
  	    ctx.beginPath()
  	    ctx.lineCap = layer.lineCap ? layer.lineCap : "round"
  	    let start = layer.start ? layer.start : 0
  	    let end = layer.end ? layer.end : list.length - 1
  	    ctx.moveTo(list[start].x - xPos, list[start].y - yPos)
  	    ctx.strokeStyle = colour
  	    for(let i = start + 1; i <= end; i++) {
  	      ctx.lineTo(list[i].x - xPos, list[i].y - yPos)
  	    }
  	    ctx.stroke()
    	}
    }

    drawCircles(player, xPos, yPos, ctx) {
      ctx.fillStyle = '#2F3B40'
      let list = player.circleList
      for(let elem of list) {
        ctx.beginPath()
        ctx.arc(elem.x - xPos, elem.y - yPos, 10, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    }

    drawHead(player, xPos, yPos, ctx) {
      let head = player.headPosition
      ctx.fillStyle = '#2F3B40'
      ctx.beginPath()
      ctx.arc(head.x - xPos, head.y - yPos, 25, 0, 2 * Math.PI, false)
      ctx.fill()
    }

    newDrawHead(player, xPos, yPos, ctx) {
      if(player.skinCategory === "basic") {
        this.drawHead(player, xPos, yPos, ctx)
        return
      }
      let width = player.headPosition.x - xPos
      let height = player.headPosition.y - yPos
      let imageWidth = 100
      let imageHeight = 100
      let img = this.state.skinObj[player.skinName]
      ctx.translate(width, height)
      ctx.rotate(player.headPosition.angle)
      ctx.drawImage(img, (-imageWidth / 2) , (-imageHeight / 2) - 12.5, imageWidth, imageHeight)
      ctx.rotate(-player.headPosition.angle)
      ctx.translate(- width, - height)
    }

    drawBelt(player, xPos, yPos, ctx, lineWidth, colour) {
      let angle = player.belt.rectangle.angle
      let rect = player.belt.rectangle
      let rightBelt = player.belt.circles[0]
      let leftBelt = player.belt.circles[1]

      ctx.lineWidth = lineWidth
      ctx.lineCap = "round"
      ctx.strokeStyle = colour
      let xDiff = 10 * Math.cos(angle)
      let yDiff = 10 * Math.sin(angle)


      ctx.beginPath()
      ctx.moveTo(rect.x - xPos, rect.y - yPos)
      for(let i = 0; i < rightBelt.length; i++) {
        ctx.lineTo(rightBelt[i].x - xPos, rightBelt[i].y - yPos)
      }
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(rect.x - xPos, rect.y - yPos)
      for(let i = 0; i < leftBelt.length; i++) {
        ctx.lineTo(leftBelt[i].x - xPos, leftBelt[i].y - yPos)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(rect.x - xDiff - xPos, rect.y - yDiff - yPos)
      ctx.lineTo(rect.x + xDiff - xPos, rect.y + yDiff - yPos)
      ctx.stroke()
    }

    drawHitPart(player, xPos, yPos, ctx) {
      // Bodies
      for(let i = 0; i < player.pointsList.length; i++) {
        let list = player.pointsList[i]
        for(let j = 0; j < list.length; j++) {
          let hitInfo = list[j].hitInfo
          if(hitInfo) {
            let percent = hitInfo.percent
            ctx.beginPath()
            ctx.fillStyle = `rgba(255, 0, 0, ${percent}`
            ctx.arc(hitInfo.x - xPos, hitInfo.y - yPos, hitInfo.radius, 0, 2 * Math.PI, false)
            ctx.fill();
          }
        }
      }
      // Head
      let hitInfo = player.headPosition.hitInfo
      if(hitInfo) {
        let percent = hitInfo.percent
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 0, 0, ${percent}`
        ctx.arc(hitInfo.x - xPos, hitInfo.y - yPos, hitInfo.radius, 0, 2 * Math.PI, false)
        ctx.fill();
      }
    }

    drawBlownUpCircles(player, xPos, yPos, ctx) {
      let skinType = player.skinType
      let circleList = player.circleList
      let pointsList = player.pointsList
      let totalList = [].concat(pointsList.reduce((a, b) => a.concat(b))).concat(circleList)
      for(let elem of totalList) {
        ctx.fillStyle = elem.label === 'torso' || elem.label === 'thigh' || elem.label === 'arm' ? skinType : '#2F3B40'
        ctx.beginPath()
        ctx.arc(elem.x - xPos, elem.y - yPos, elem.radius, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    }

    createBloodParticles(x, y, particleNumber) {
      for(let i = 0; i < particleNumber; i++) {
        let newParticle = new BloodParticle(x, y)
        this.bloodParticles.push(newParticle)
      }
    }

    drawBloodParticles() {
      let ctx = this.state.canvas.getContext('2d')
      for(let particle of this.bloodParticles) particle.updateTime()
      this.bloodParticles = this.bloodParticles.filter(particle => !particle.dead)
      for(let particle of this.bloodParticles) {
        particle.updatePosition()
        particle.drawParticle(ctx)
      }
    }

    drawArmBands(player, xPos, yPos, ctx) {
      for(let list of player.armBandList) {
        let percent = player.health / player.initialHealth
        ctx.lineCap = "butt"
        ctx.lineWidth = 20
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 0, 0, ${1 - percent}`
        ctx.moveTo(list[0].x - xPos, list[0].y - yPos)
        for(let i = 1; i < list.length; i++) {
          ctx.lineTo(list[i].x - xPos, list[i].y - yPos)
        }
        ctx.stroke()
      }
    }

    drawHealthBar(context, x, y, health) {
      // console.log(x, y, health)
      let healthBarWidth = 100
      let healthBarHeight = 10
      let initialHealth = 200
      x = x - healthBarWidth / 2
      let percent = health / initialHealth
      // Draw Background Health
      context.fillStyle = 'black'
      context.fillRect(x, y, healthBarWidth, healthBarHeight)
      // Draw Health
      context.fillStyle = 'red'
      context.fillRect(x, y, healthBarWidth * percent, healthBarHeight)
    }

    drawPlayerGrid(players) {
      let ctx = this.state.gridCanvas.getContext('2d')
      let worldWidth = this.camera.worldWidth
      let worldHeight = this.camera.worldHeight
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.clearRect(0, 0, 200, 200)
      ctx.fillRect(0, 0, 200, 200)
      for(let player of players) {
        if(player.isBlownUp) continue
        let x = player.pelvis.x
        let y = player.pelvis.y
        let newX = (x / worldWidth) * 200
        let newY = (y / worldWidth) * 200
        x = x ? newX : 100
        y = y ? newY : 100
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = player.id === socket.id ? 'white' : '#e74c3c';
        ctx.fill();
      }
    }

    drawName(context, x, y, name) {
      context.fillStyle = 'black'
      context.font = '25px Quicksand'
      context.fillText(name, x - 20, y + 100)
    }

    drawHealthPacks() {
      //
    }

    drawWalls(bodies, camera) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      let xPos = camera.xPos
      let yPos = camera.yPos
      context.fillStyle = 'black';
      context.beginPath();
      context.globalAlpha = 0.2
      for(let i = 0; i < bodies.length; i++) {
        let vertices = bodies[i]
        context.moveTo(vertices[0].x - xPos, vertices[0].y - yPos);
        for(let j = 1; j < vertices.length; j++) {
          context.lineTo(vertices[j].x - xPos, vertices[j].y - yPos);
        }
        context.lineTo(vertices[0].x - xPos, vertices[0].y - yPos);

        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
        context.fill()
      }
      context.globalAlpha = 1
    }

    drawBackground(camera) {
      let canvas = this.state.canvas
      let context = canvas.getContext('2d')
      let xPos = camera.xPos
      let yPos = camera.yPos
      let img = this.img
      context.clearRect(0, 0, canvas.width, canvas.height)
      // Draw Shifted Viewport
      let newX = (xPos % canvas.width) - this.diff.x
      let newY = (yPos % canvas.height) - this.diff.y


      context.drawImage(img, newX, newY, canvas.width - newX, canvas.height - newY, 0, 0, canvas.width - newX, canvas.height - newY)
      // Right
      if(newX > 0) {
        context.drawImage(img, 0, newY, newX, canvas.height - newY, canvas.width - newX, 0, newX, canvas.height - newY)
        if(newY > 0) {
          context.drawImage(img, 0, 0, newX, newY, canvas.width - newX, canvas.height - newY, newX, newY)
        }
        else if(newY < 0) {
          context.drawImage(img, 0, canvas.height + newY, newX, -newY, canvas.width - newX, 0, newX, -newY)
        }
      }
      // Left
      else if(newX < 0) {
        context.drawImage(img, canvas.width + newX, newY, -newX, canvas.height - newY, 0,0,-newX,canvas.height - newY)
        if(newY > 0) {
          context.drawImage(img, canvas.width + newX, 0, -newX, newY, 0, canvas.height - newY, -newX, newY)
        }
        else if(newY < 0) {
          context.drawImage(img, canvas.width + newX, canvas.height + newY, -newX, -newY, 0, 0, -newX, -newY)
        }
      }
      // Down
      if(newY > 0) {
        context.drawImage(img, newX, 0, canvas.width, newY, 0, canvas.height - newY, canvas.width, newY)
      }
      // Up
      else if(newY < 0) {
        context.drawImage(img, newX, canvas.height + newY, canvas.width, -newY, 0, 0, canvas.width, -newY)
      }
    }


    /*  MISC CODE   */


    generateBackground(canvasWidth, canvasHeight) {
      let cvs = document.createElement('canvas')
      let ctx = cvs.getContext('2d')
      cvs.width = canvasWidth
      cvs.height = canvasHeight
      let boxSize = 50
      ctx.fillStyle = '#404040'
      ctx.fill()
      ctx.strokeStyle = '#E6E6E6'
      for(let i = 0; i <= canvasWidth; i += boxSize) {
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvasHeight)
        ctx.stroke()
      }
      for(let j = 0; j <= canvasHeight; j+= boxSize) {
        ctx.moveTo(0, j)
        ctx.lineTo(canvasWidth, j)
        ctx.stroke()
      }
      let dataUrl = ctx.canvas.toDataURL("image/png");
      let img = new Image()
      img.src = dataUrl
      this.img = img
      ctx = null
    }

    setUpCamera (worldWidth, worldHeight, canvas) {
      let camera = new Camera(0, 0, canvas.width, canvas.height, worldWidth, worldHeight)
      camera.follow(canvas.width / 2, canvas.height / 2)
      this.camera = camera
      this.diff = {
        x: camera.xPos,
        y: camera.yPos
      }
    }

    adjustCentre(canvas, Pelvis) {
      let centreX = canvas.width / 2
      let centreY = canvas.height / 2
      let diffX = Pelvis.x - centreX
      let diffY = Pelvis.y - centreY
      return { diffX, diffY }
    }

    addListeners() {
      let self = this
      window.addEventListener('keydown', e => {
        if(e.keyCode === 37) self.keyDown.left = true
        else if(e.keyCode === 38) self.keyDown.up = true
        else if(e.keyCode === 39) self.keyDown.right = true
        else if(e.keyCode === 40) self.keyDown.down = true
      })
      window.addEventListener('keyup', e => {
        if(e.keyCode === 37) self.keyDown.left = false
        else if(e.keyCode === 38) self.keyDown.up = false
        else if(e.keyCode === 39) self.keyDown.right = false
        else if(e.keyCode === 40) self.keyDown.down = false
      })
    }

    render() {
      return (
        <div>
          {this.state.backgroundText.show &&
            <TextInfo
              text={this.state.backgroundText.text}
              idx={this.state.backgroundText.idx}
              colour={this.state.backgroundText.colour} />
            }
          <canvas ref="canvas" id="mainCanvas" height={window.innerHeight * 0.98} width={window.innerWidth} />
          { this.state.newKill && <KillFeed newKill={this.state.newKill}/> }
          { this.state.leaderBoard.length && <LeaderBoard leaderBoard={this.state.leaderBoard}/>  }
          { this.state.playerDead &&
            <RespawnModal respawnPlayer={this.respawnPlayer} killStreak={this.state.player.killStreak} beltColour={this.state.player.beltColour}/>
          }
          <canvas ref="gridCanvas" height="200" width="200" style={Style.gridCanvas}/>
          <div style={Style.ProgressBar} >
            <h2 style={Style.PlayerName}> {this.state.player.name} </h2>
            <ProgressBar containerWidth="400px" containerHeight="30px" borderRadius="15px" progress={`${this.state.player.beltProgress < 10 ? 10 : this.state.player.beltProgress}%`} progressColour="#18C29C" text={`${this.state.player.beltColour} Belt`} textColour="#FFFFFF" plusIcon="none" plusIconRight="20px" fontSize="16px"/>
          </div>
          <SkillPoints skillPoints={this.state.player.skillPoints} skillPointValues={this.state.player.skillPointValues} handleSkillPointsClick={this.handleSkillPointsClick}/>
        </div>
      )
    }
}

const Style = {
  gridCanvas: {
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    marginRight: '10px',
    marginBottom: '10px'
  },
  ProgressBar: {
    width: "100%",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    bottom: "30px"
  },
  PlayerName: {
    margin: "0px",
    fontFamily: "Ubuntu"
  }
}


export default Canvas

/*
Props
Container Width
Progress Width
Progress Background Colour
Text
PlusIcon
*/
