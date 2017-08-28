import React from 'react'
import Radium from 'radium'
import socket from '../io.js'


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
      socket.on('draw', (Players, HealthPacks, Walls) => {
        this.drawPlayers(Players)
        this.drawHealthPacks(HealthPacks)
        this.drawWalls(Walls)
        setTimeout(() => socket.emit('keydown', self.keyDown.left, self.keyDown.up, self.keyDown.right, self.keyDown.down), 15)
      })
    }

    drawPlayers(players) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      for(let k = 0; k < players.length; k++) {
        let bodies = players[k].vertices
        let lowestY = 0
        let pelvisX = players[k].pelvisX
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i];

            context.moveTo(vertices[0].x, vertices[0].y);

            for (var j = 1; j < vertices.length; j += 1) {
                if(vertices[j].y > lowestY) lowestY = vertices[j].y
                context.lineTo(vertices[j].x, vertices[j].y);
            }

            context.lineTo(vertices[0].x, vertices[0].y);
        }

        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
        this.drawHealthBar(context, pelvisX, lowestY, players[k].health)
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

    drawWalls(bodies) {
      let canvas = this.state.canvas
      let context = this.state.canvas.getContext('2d')
      context.fillStyle = '#fff';

      context.beginPath();
      for(let i = 0; i < bodies.length; i++) {
        let vertices = bodies[i]
        context.moveTo(vertices[0].x, vertices[0].y);
        for(let j = 1; j < vertices.length; j++) {
          context.lineTo(vertices[j].x, vertices[j].y);
        }
        context.lineTo(vertices[0].x, vertices[0].y);
        
        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
      }
    }

    drawBackground() {
      //
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
        <canvas ref="canvas" id="mainCanvas" height="1000" width="1000"/>
      )
    }




}

export default Canvas
