import React from 'react'
import Radium from 'radium'
import socket from '../io.js'
import Camera from './Camera.js'
import LeaderBoard from './LeaderBoard.jsx'


@Radium
class Canvas extends React.Component {
    constructor() {
      super()
      this.state = {
        canvas: undefined,
        leaderBoard: []
      }
      this.keyDown = {
        up: false,
        right: false,
        down: false,
        left: false
      }
    }

    componentDidMount() {
      this.setState({ canvas: this.refs.canvas })
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
      })
      socket.on('draw', (Players, HealthPacks, Walls, Pelvis) => {
        this.camera.update(Pelvis)
        this.drawBackground(this.camera)
        this.drawPlayers(Players, this.camera)
        this.drawHealthPacks(HealthPacks)
        this.drawWalls(Walls, this.camera)
        setTimeout(() => socket.emit('keydown', self.keyDown.left, self.keyDown.up, self.keyDown.right, self.keyDown.down), 15)
      })
      socket.on('updateLeaderBoard', leaderBoard => {
        this.setState({ leaderBoard: leaderBoard })
      })
    }

    drawPlayers(players, camera) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      let xPos = camera.xPos 
      let yPos = camera.yPos
      context.beginPath();
      for(let k = 0; k < players.length; k++) {
        let bodies = players[k].vertices
        let lowestY = 0
        let pelvisX = players[k].pelvis.x - xPos
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i];

            context.moveTo(vertices[0].x - xPos, vertices[0].y - yPos);
            for (var j = 1; j < vertices.length; j += 1) {
                // if(vertices[j].y > lowestY) lowestY = vertices[j].y - yPos
                context.lineTo(vertices[j].x - xPos, vertices[j].y - yPos);
            }

            context.lineTo(vertices[0].x - xPos, vertices[0].y - yPos);
        }

        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
        context.fillStyle = 'black'
        context.fill();
        // this.drawHealthBar(context, pelvisX - xPos, lowestY - yPos, players[k].health)
      }
    }

    drawHealthBar(context, x, y, health) {
      let healthBarWidth = 100
      let healthBarHeight = 10
      let initialHealth = 200
      y = y + 10
      x = x - healthBarWidth / 2
      let percent = health / initialHealth
      // Draw Background Health
      context.fillStyle = 'black'
      context.fillRect(x, y, healthBarWidth, healthBarHeight)
      // Draw Health 
      context.fillStyle = 'red'
      context.fillRect(x, y, healthBarWidth * percent, healthBarHeight)
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
      let boxSize = 50
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
        <canvas ref="canvas" id="mainCanvas" height={window.innerHeight * 0.98} width={window.innerWidth * 0.98}/>
        {
          this.state.leaderBoard.length && <LeaderBoard leaderBoard={this.state.leaderBoard}/>
        }
        </div>
      )
    }
}


export default Canvas
