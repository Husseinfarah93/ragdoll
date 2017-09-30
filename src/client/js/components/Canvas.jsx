import React from 'react'
import Radium from 'radium'
import socket from '../io.js'
import Camera from './Camera.js'
import LeaderBoard from './LeaderBoard.jsx'
import RespawnModal from './RespawnModal.jsx'
import KillFeed from './KillFeed.jsx'

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
        id: socket.id
      }
      this.keyDown = {
        up: false,
        right: false,
        down: false,
        left: false
      }
      this.respawnPlayer = this.respawnPlayer.bind(this)
    }

    componentDidMount() {
      console.log('cvs: ', this.refs)
      this.setState({ canvas: this.refs.canvas, gridCanvas: this.refs.gridCanvas })
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
      socket.on('draw', (Players, HealthPacks, Walls, Pelvis, id) => {
        this.camera.update(Pelvis)
        this.drawBackground(this.camera)
        this.drawPlayers(Players, this.camera)
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

    drawArmBands(xPos, yPos, context, bodies) {
      for (var i = 0; i < bodies.length; i += 1) {
        context.beginPath()
        var vertices = bodies[i].vertices;
        var health = bodies[i].health
        var percentage = health / 200
        context.moveTo(vertices[0].x - xPos, vertices[0].y - yPos);
        for (var j = 1; j < vertices.length; j += 1) {
            context.lineTo(vertices[j].x - xPos, vertices[j].y - yPos);
        }
        context.lineTo(vertices[0].x - xPos, vertices[0].y - yPos);
        context.lineWidth = 0.5;
        context.strokeStyle = percentage === 1 ? 'black' : `rgba(255, 0, 0, ${1 - percentage})`;
        context.stroke();
        context.fillStyle = percentage === 1 ? 'black' : `rgba(255, 0, 0, ${1 - percentage})`;
        context.fill();
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

    drawPlayerGrid(x, y) {
      let ctx = this.state.gridCanvas.getContext('2d')
      let worldWidth = this.camera.worldWidth
      let worldHeight = this.camera.worldHeight
      let newX = (x / worldWidth) * 200
      let newY = (y / worldWidth) * 200
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.clearRect(0, 0, 200, 200)
      ctx.fillRect(0, 0, 200, 200)
      x = x ? newX : 100
      y = y ? newY : 100
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    drawName(context, x, y, name) {
      context.font = '18px Ubuntu'
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

    generateBackground(canvasWidth, canvasHeight) {
      let cvs = document.createElement('canvas')
      let ctx = cvs.getContext('2d')
      cvs.width = canvasWidth 
      cvs.height = canvasHeight
      let boxSize = 25
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
          <canvas ref="canvas" id="mainCanvas" height={window.innerHeight * 0.98} width={window.innerWidth}/>
          {
            this.state.newKill && <KillFeed newKill={this.state.newKill}/>
          }
          {
            this.state.leaderBoard.length && <LeaderBoard leaderBoard={this.state.leaderBoard}/>
          }
          { this.state.playerDead && 
            <RespawnModal respawnPlayer={this.respawnPlayer} />
          }
          <canvas ref="gridCanvas" height="200" width="200" style={Style.gridCanvas}/>
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
  }
}


export default Canvas
