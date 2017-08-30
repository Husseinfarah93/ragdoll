import React from 'react'
import Radium from 'radium'
import socket from '../io.js'
import Camera from './Camera.js'

@Radium
class Canvas extends React.Component {
    constructor() {
      super()
      this.state = {
        canvas: undefined
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
      socket.on('setUpCamera', (worldWidth, worldHeight) => {
        this.setUpCamera(worldWidth, worldHeight, this.state.canvas)
      })
      socket.on('draw', (Players, HealthPacks, Walls, Pelvis) => {
        this.camera.update(Pelvis)
        this.drawBackground()
        this.drawPlayers(Players, this.camera)
        this.drawHealthPacks(HealthPacks)
        this.drawWalls(Walls, this.camera)
        setTimeout(() => socket.emit('keydown', self.keyDown.left, self.keyDown.up, self.keyDown.right, self.keyDown.down), 15)
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
        let pelvisX = players[k].pelvis.x 
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i];

            context.moveTo(vertices[0].x - xPos, vertices[0].y - yPos);

            for (var j = 1; j < vertices.length; j += 1) {
                // if(vertices[j].y > lowestY) lowestY = vertices[j].y
                context.lineTo(vertices[j].x - xPos, vertices[j].y - yPos);
            }

            context.lineTo(vertices[0].x - xPos, vertices[0].y - yPos);
        }

        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
        context.fillStyle = 'black'
        context.fill();
        // this.drawHealthBar(context, pelvisX, lowestY, players[k].health)
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
      context.fillStyle = '#fff';
      context.beginPath();
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
      }
    }

    drawBackground() {
      let canvas = this.state.canvas 
      let context = this.state.canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      let img = new Image(canvas.width, canvas.height)
      img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIDtbHUjOF-c8emDZAU_OPSYxsDZEW5Hm_wXoUGvQnqNqrYqCW"
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
    }


    setUpCamera (worldWidth, worldHeight, canvas) {
      let camera = new Camera(0, 0, canvas.width, canvas.height, worldWidth, worldHeight)
      camera.follow(canvas.width / 2, canvas.height / 2)
      this.camera = camera
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
      console.log("rendering")
      return (
        <canvas ref="canvas" id="mainCanvas" height={window.innerHeight * 0.9} width={window.innerWidth * 0.9}/>
      )
    }




}

export default Canvas
