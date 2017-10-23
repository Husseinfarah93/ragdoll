let express = require('express')
let app = express()
let path = require('path')
let http = require('http').Server(app)
let io = require('socket.io')(http)
let c = require('../../config.json')
let Player = require('./Player.js')


app.use(express.static(path.resolve(__dirname + '/../client')));
let port = 4000;

http.listen(port, function () {
    console.log('listening on:', port);
});

let rooms = {}


/* --------------------------------------------- ROOMS AND LOBBY CODE ----------------------------------------------- */
// If room exists return room. If not return false
function findRoom(roomType) {
    let rooms = io.sockets.adapter.rooms
    for(room in rooms) {
        if(rooms[room].gameType === roomType) return room
    }
    return false
}

// Create room of certain game mode
function createRoom(roomType) {
    let room = io.createRoom(roomType)
    return room
}

function printRooms() {
    let rooms = io.sockets.adapter.rooms
    for(room in rooms) console.log(room)
}

function getRooms() {
    let rooms = io.sockets.adapter.rooms
    let list = []
    for(room in rooms) list.push(room)
    return list
}

/* ------------------------------------------------- WORLD CODE ------------------------------------------------------- */

function createWorld(roomName) {
    let Matter = require('matter-js');
    let room = io.sockets.adapter.rooms[roomName]
    // module aliases
    let Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Constraint = Matter.Constraint,
      Composite = Matter.Composite

    let engine = Engine.create()
    Matter.engine = engine
    engine.world.gravity.y = 0
    setInterval(function() {
      Engine.update(engine, 1000 / 60);
    }, 1000 / 60);
    room.Matter = Matter
    return Matter
}

function createWalls(Matter, roomName) {
  let room = io.sockets.adapter.rooms[roomName]
  // module aliases
  let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite
  let height = c.gameModes[room.gameType].gameHeight
  let width = c.gameModes[room.gameType].gameWidth
  let wallThickness = 1000
  let options = { isStatic: true }
  // Create Walls
  // Top
  let top = Bodies.rectangle(width / 2, wallThickness / 2, width, wallThickness, options)
  // // Right
  let right = Bodies.rectangle(width - wallThickness / 2, height / 2, wallThickness, height, options)
  // // Down
  let down = Bodies.rectangle(width / 2, height - wallThickness / 2, width, wallThickness / 2, options)
  // // Left
  let left = Bodies.rectangle(wallThickness / 2, height / 2, wallThickness, height, options)

  let wallComposite = Composite.create({
    bodies: [top, right, down, left]
  })
  wallComposite.label = 'walls'
  World.add(Matter.engine.world, wallComposite)
}

function startEngine(engine) {
  //
}

function stopEngine(engine) {
  //
}

function addPlayerToWorld(player, Matter) {
  //
}

function removePlayerFromWorld() {
    //
}

/* -------------------------------------------------- IO/SOCKET CODE ----------------------------------------------------- */
io.on('connection', socket => {
  socket.on('startGame', gameInfo => {
    let room = findRoom(gameInfo.gameType)
    let Matter;
    let engine;
    if(room) {
        socket.join(room)
        Matter = io.sockets.adapter.rooms[room].Matter
    }
    else {
      // Create Random Hash for games
      let newRoom = gameInfo.gameType
      socket.join(newRoom)
      room = newRoom
      io.sockets.adapter.rooms[newRoom].gameType = gameInfo.gameType
      // Create World
      Matter = createWorld(room)
      // Create Walls
      createWalls(Matter, room)
      engine = Matter.engine
      // Set up room object
      rooms[room] = {}
      rooms[room].healthPacks = {}
      rooms[room].players = {}
      rooms[room].bodiesToRepel = []
      rooms[room].leaderBoard = []
      // Collision Code
      Matter.Events.on(Matter.engine, 'collisionStart', (e) => collisionCheck(e, room, socket.id))
      Matter.Events.on(Matter.engine, 'beforeUpdate', () => executeRepel(Matter, room))
    }
    // Set up camera front end
    let worldWidth = c.gameModes[gameInfo.gameType].gameWidth
    let worldHeight = c.gameModes[gameInfo.gameType].gameHeight
    socket.emit('setUpWorld', worldWidth, worldHeight)
    // Create Player
    let player = new Player(gameInfo.name, socket.id, gameInfo.character, gameInfo.skin)
    socket.emit('setUpPlayer', player.name, player.skillPoints, player.skillPointValues, player.killStreak, player.beltColour, player.beltProgress)
    // SEND START BG UPDATE
    sendBGTextUpdate(socket, 'start')
    // player.createMatterPlayerCircles(Matter, 5000, 5000, 10)
    player.createMatterPlayerCircles2(Matter, 5000, 5000, 10)
    // Add player to room in rooms
    rooms[room].players[socket.id] = player
    // Update leaderboard
    leaderBoardChange(room)
    // Body
    socket.on('keydown', (left, up, right, down) => {
      player.movePlayer(left, up, right, down, Matter)
    })
    socket.on('disconnect', () => {
      if(rooms[room].players[player.id]) {
        Matter.Composite.clear(player.PlayerComposite)
        delete rooms[room].players[player.id]
        leaderBoardChange(room)
      }
    })
    socket.on('respawn', () => {
      if(!player.isDead) Matter.Composite.clear(player.PlayerComposite)
      player.resetPlayer()
      player.createMatterPlayerCircles2(Matter, 5000, 5000, 10)
      updatePlayerValues(socket, player)
      clearUpdates(socket.id)
      let updateInterval = setInterval(() => updateFrontEndInfo(room, socket, player), 15)
      socket.updateInterval = updateInterval
      leaderBoardChange(room)
      // SEND START BG UPDATE
      sendBGTextUpdate(socket, 'start')
    })
    socket.on('blowUp', () => {
      player.blowUp(Matter)
    })
    socket.on('updatePlayerSkillPoints', name => {
      player.updatePlayerSkillPoints(name)
      player.decreaseSkillPoints()
      updatePlayerValues(socket, player)
    })

    leaderBoardChange(room)
    // Update Code
    setInterval(updateCentrePoints, 16)
    let updateInterval = setInterval(() => updateFrontEndInfo(room, socket, player), 15)
    socket.updateInterval = updateInterval
  })
})
/* ---------------------------------------------------- UPDATE CODE -------------------------------------------------------- */


function updateFrontEndInfo(room, socket, player) {
  let frontEndInfo = getFrontEndInfo(room)
  // Emit playerList, healthList, wallList
  let Pelvis = {
    x: player.pelvis.position.x,
    y: player.pelvis.position.y
  }
  socket.emit('draw', frontEndInfo.Players, frontEndInfo.HealthPacks, frontEndInfo.Walls, Pelvis, socket.id)
}

function updateLeaderboard(roomName) {
  let room = rooms[roomName]
  let currentLeaderBoard = room.leaderBoard
  let players = room.players
  let playerList = []
  for(player in players) {
    playerList.push(players[player])
  }
  let temp = playerList.map(player => {
    return {
      killStreak: player.killStreak,
      id: player.id,
      name: player.name,
      colour: player.colour
    }
  })
  temp = temp.sort((a1, a2) => a2.killStreak - a1.killStreak)
  room.leaderBoard = temp
}

function leaderBoardChange(roomName) {
  updateLeaderboard(roomName)
  sendLeaderBoard(roomName)
}

function sendLeaderBoard(roomName) {
  let room = io.sockets.adapter.rooms[roomName]
  let sockets = room ? room.sockets : {}
  let leaderBoard = getLeaderBoard(roomName)
  for(sckt in sockets) {
    let socket = io.sockets.connected[sckt]
    let isInLeaderBoard = isPlayerInLeaderBoard(roomName, sckt)
    if(isInLeaderBoard) {
      socket.emit('updateLeaderBoard', leaderBoard)
    }
    else {
      let position = playerPositionLeaderBoard(roomName, sckt)
      let player = rooms[roomName].leaderBoard[position - 1]
      let newLeaderBoard = leaderBoard.slice(0)
      newLeaderBoard.push(player)
      socket.emit('updateLeaderBoard', newLeaderBoard)
    }
  }
}

function sendDisplayBlood(bodyPart, roomName) {
  let x = bodyPart.position.x,
      y = bodyPart.position.y
  io.sockets.in(roomName).emit('createBlood', x, y)
}

/* ---------------------------------------------------- LeaderBoard CODE -------------------------------------------------------- */

function isPlayerInLeaderBoard(roomName, playerId) {
  let currentLeaderBoard = rooms[roomName].leaderBoard
  for(let i = 0; i < currentLeaderBoard.length; i++) {
    let player = currentLeaderBoard[i]
    if(player.id === playerId) return true
  }
  return false
}

function playerPositionLeaderBoard(roomName, playerId) {
  let leaderBoard = rooms[roomName].leaderBoard
  for(let i = 0; i < leaderBoard.length; i++) {
    let player = leaderBoard[i]
    if(player.id === playerId) return i + 1
  }
}

function getLeaderBoard(roomName) {
  return rooms[roomName].leaderBoard
}

/* ---------------------------------------------------- SEND CODE -------------------------------------------------------- */

// Takes in bodies array. Returns list of vertices
function verticesFromBodies(bodies) {
  let verticesToReturn = []
  for(let i = 0; i < bodies.length; i++) {
      let vertices = bodies[i].vertices
      let label = bodies[i].label
      vertices = vertices.map(e => ({
          x: e.x,
          y: e.y,
          label: label,
          // hitInfo: bodies[i].hitInfo
      }))
      verticesToReturn.push(vertices)
  }
  return verticesToReturn
}

function updatePlayerVertices() {
    for(room in rooms) {
        let players = rooms[room].players
        for(let player in players) {
          if(player.isDead) continue
          let Matter = io.sockets.adapter.rooms[room].Matter
          let Composite = Matter.Composite
          let playerComp = players[player].PlayerComposite
          let bodies = Composite.allBodies(playerComp)
          let playerVertices = verticesFromBodies(bodies)
          players[player].vertices = playerVertices
        }
    }
}

// returns Array of Player vertices and health e.g. => [{vertices: [], health: 200}]

function getPlayerVertices(room) {
    let list = []
    let players = rooms[room].players
    for(player in players) {
      if(player.isDead) continue
      let pushItem = {}
      pushItem.health = players[player].health
      pushItem.initialHealth = players[player].initialHealth
      pushItem.name = players[player].name
      pushItem.id = players[player].id
      pushItem.isDead = players[player].isDead
      pushItem.isBlownUp = players[player].isBlownUp
      pushItem.pelvis = {
        x: players[player].pelvis.position.x,
        y: players[player].pelvis.position.y
      }
      pushItem.colour = players[player].colour
      pushItem.pointsList = players[player].pointsList
      pushItem.circleList = players[player].circleList
      pushItem.headPosition = players[player].headPosition
      pushItem.armBandList = players[player].armBandList
      pushItem.beltList = players[player].beltList
      pushItem.skinType = players[player].skinType
      list.push(pushItem)
    }
    return list
}

function getHealthInfo(room) {
  //
}

function getWallInfo(roomName) {
  let room = io.sockets.adapter.rooms[roomName]
  if(!room) return
  // Find Composite by Label
  let comps = room.Matter.engine.world.composites
  let bodies;
  for(let i = 0; i < comps.length; i++) {
    if(comps[i].label === 'walls') bodies = comps[i].bodies
  }
  return verticesFromBodies(bodies)
}

function getFrontEndInfo(room) {
  /*
    - Players
      - Vertices
      - Health
    - Health Packs
      - Vertices
      - Status
    - Walls
    - Leaderboard

    Return {
      Players: [{vertices:..., health:10}, {vertices:..., health: 20}],
      HealthPacks: [{vertices:..., isActive: false}]
      Walls: [vertices]
    }
  */
    let item = {}
    let playerList = getPlayerVertices(room)
    let healthList = getHealthInfo(room)
    let wallList = getWallInfo(room)
    item.Players = playerList
    item.HealthPacks = healthList
    item.Walls = wallList
    return item
}

function updateCentrePoints() {
  for(room in rooms) {
    let players = rooms[room].players
    for(playerName in players) {
      let player = players[playerName]
      let pointsList = []
      let circleList = []
      let armBandList = []
      let beltList = []
      let headPosition = {}
      let composites = player.PlayerComposite.composites
      for(composite of composites) {
        let bodies = composite.bodies
        let bodyList = []
        for(let i = 0; i < bodies.length; i++) {
          let body = bodies[i]
          // End Circles
          if(body.isEnd) circleList.push({ x: body.position.x, y: body.position.y, hitInfo: body.hitInfo, radius: body.circleRadius })
          // Head Position
          if(body.label === 'head') headPosition = { x: body.position.x, y: body.position.y, hitInfo: body.hitInfo, radius: body.circleRadius }
          // Body List
          bodyList.push({ x: body.position.x, y: body.position.y, label: body.label, hitInfo: body.hitInfo, radius: body.circleRadius})
          // Armbands
          if(i < bodies.length - 1 && body.isArmBand && bodies[i+1].isArmBand) {
            let thingToPush = []
            let body1 = body
            let body2 = bodies[i+1]
            thingToPush.push({  x: body.position.x, y: body.position.y })
            thingToPush.push({  x: (body2.position.x), y: (body2.position.y)  })
            armBandList.push(thingToPush)
          }
          // Belt
          if(body.beltStart) {
            let position1 = body.position
            let theta = body.angle + Math.PI / 2
            let position2 = {
              x: position1.x + (body.circleRadius * Math.cos(theta)),
              y: position1.y + (body.circleRadius * Math.sin(theta))
            }
            beltList.push(position1)
            beltList.push(position2)
          }
        }
        pointsList.push(bodyList)
      }
      player.pointsList = pointsList
      player.circleList = circleList
      player.headPosition = headPosition
      player.armBandList = armBandList
      player.beltList = beltList
    }
  }
}



/* ---------------------------------------------------- COLLISION CODE -------------------------------------------------------- */


function collisionCheck(event, roomName, id) {
  let bodyA = event.pairs[0].bodyA
  let bodyB = event.pairs[0].bodyB
  // Check if colliding bodies are 2 different players
  let playerA = rooms[roomName].players[bodyA.playerId]
  let playerB = rooms[roomName].players[bodyB.playerId]
  if((bodyA.playerId && bodyB.playerId) && bodyA.playerId !== bodyB.playerId) {
    // Do nothing if its a blown up body piece
    if(playerA.isBlownUp || playerB.isBlownUp) return
    // Check if the hit is one which deals damage. Only if yes continue
    if(!isHit(bodyA, bodyB)) {
      repel(roomName, bodyA, bodyB)
      return
    }
    // bodyA is hitterPlayer
    if(isWinner(bodyA, bodyB)) {
      handleHit(bodyA.playerId, bodyB.playerId, bodyA.label, bodyB.label, roomName)
      bodyPartHit(bodyB, 3000, roomName)
    }
    // bodyB is hitterPlayer
    else {
      handleHit(bodyB.playerId, bodyA.playerId, bodyB.label, bodyA.label, roomName)
      bodyPartHit(bodyA, 3000, roomName)
    }

  }
}

function isHit(bodyPart1, bodyPart2) {
  // If bodyPart1 or bodyPart2 is dealDamage True
  return (bodyPart1.dealDamage && !bodyPart2.dealDamage) === true || (!bodyPart1.dealDamage && bodyPart2.dealDamage) === true
}

function isWinner(bodyPart1, bodyPart2) {
  return bodyPart1.dealDamage && !bodyPart2.dealDamage
}

function handleHit(hitterPlayer, hitPlayer, bodyPartHitter, bodyPartHit, roomName) {
  let room = rooms[roomName]
  let bodiesToMove = rooms[roomName].bodiesToRepel
  hitterPlayer = room.players[hitterPlayer]
  hitPlayer = room.players[hitPlayer]
  // Dead
  let socket = io.sockets.connected[hitPlayer.id]
  let socket2 = io.sockets.connected[hitterPlayer.id]
  if (isPlayerDead(hitPlayer, bodyPartHit, hitterPlayer)) {
    // SEND KILL BG UPDATE
    sendBGTextUpdate(socket2, 'kill')
    // SEND DEATH BG UPDATE
    sendBGTextUpdate(socket, 'death')
    // clearUpdates(socket.id)
    socket.emit('playerDeath', hitPlayer.killStreak)
    // Remove player
    hitPlayer.health = 0
    hitterPlayer.killStreak += 1
    let Matter = io.sockets.adapter.rooms[roomName].Matter
    // Update Leaderboard
    leaderBoardChange(roomName)
    // Update Killfeed
    updateKillFeed(hitPlayer, bodyPartHit, hitterPlayer, roomName)
    // Update Skill Points
    hitterPlayer.increaseSkillPoints()
    hitterPlayer.updateProgress()
    if(hitterPlayer.shouldIncreaseBelt()) hitterPlayer.increaseBelt()
    // updatePlayer => skillPoints, skillPointValues, beltColour
    // socket2.emit('updatePlayer', hitterPlayer.skillPoints, hitterPlayer.skillPointValues, hitterPlayer.beltColour, hitterPlayer.beltProgress)
    updatePlayerValues(socket2, hitterPlayer)
    hitPlayer.blowUp(Matter, bodiesToMove)
    setTimeout(() => {
      if(hitPlayer.isBlownUp) {
        Matter.Composite.clear(hitPlayer.PlayerComposite)
        // delete rooms[roomName].players[hitPlayer.id]
        hitPlayer.isDead = true
        // hitPlayer.isBlownUp = false
      }
    }, 5000)
  }
  // Not Dead
  else {
    let text = bodyPartHit === 'head' ? 'head' : 'body'
    hitPlayer.health -= damageAmount(hitterPlayer, bodyPartHit)
    // SEND HITTER BG UPDATE
    sendBGTextUpdate(socket2, text, true)
    // SEND HIT BG UPDATE
    sendBGTextUpdate(socket, text, false)
  }

}

function updatePlayerValues(socket, player) {
  socket.emit('updatePlayer', player.skillPoints, player.skillPointValues, player.beltColour, player.beltProgress, player.killStreak)
}

function isPlayerDead (hitPlayer, bodyPartHit, hitterPlayer) {
  return hitPlayer.health - damageAmount(hitterPlayer, bodyPartHit) <= 0
}

function damageAmount (hitterPlayer, bodyPartHit) {
  let damageDoneByHitter = c.playerTypes[hitterPlayer.characterType].damageDealt
  if(bodyPartHit === 'head') damageDoneByHitter *= 1.2
  return damageDoneByHitter
}

function clearUpdates(socketId) {
  let socket = io.sockets.connected[socketId]
  clearInterval(socket.updateInterval)
}

function repel(roomName, bodyA, bodyB) {
  let bodyALeft = bodyA.position.x < bodyB.position.x
  let bodyAUp = bodyA.position.y < bodyB.position.y
  let force = 0.005
  let forceA = {
    x: bodyALeft ? force * -1 : force,
    y: bodyAUp ? force * -1 : force,
  }
  let forceB = {
    x: bodyALeft ? force : force * -1,
    y: bodyAUp ? force : force * -1,
  }
  let elemA = {body: bodyA, force: forceA}
  let elemB = {body: bodyB, force: forceB}
  rooms[roomName].bodiesToRepel.push(elemA)
  rooms[roomName].bodiesToRepel.push(elemB)
}

function executeRepel(Matter, roomName) {
  let Body = Matter.Body
  let bodiesToMove = rooms[roomName].bodiesToRepel
	for(let item of bodiesToMove) {
		let body = item.body
		let force = item.force
		Body.applyForce(body, body.position, force)
	}
	rooms[roomName].bodiesToRepel = []
}

function updateKillFeed(hitPlayer, bodyPartHit, hitterPlayer, roomName) {
  let killType = bodyPartHit === 'head' ? 'head' : 'body'
  io.sockets.in(roomName).emit('updateKillFeed', hitterPlayer.name, killType, hitPlayer.name, hitterPlayer.colour, hitPlayer.colour)
}

function bodyPartHit(bodyPart, duration, roomName) {
  if(bodyPart.changeFunc) clearInterval(bodyPart.changeFunc)
  bodyPart.hitInfo = {
    isHit: true,
    current: Date.now(),
    duration: duration,
    end: Date.now() + duration,
    percent: 1,
    x: bodyPart.position.x,
    y: bodyPart.position.y,
    radius: bodyPart.circleRadius,
    id: bodyPart.playerId,
    label: bodyPart.label
  }
  bodyPart.changeFunc = setInterval(() => {
   bodyPart.hitInfo.current = Date.now()
   bodyPart.hitInfo.percent = (bodyPart.hitInfo.end - bodyPart.hitInfo.current) / duration
   bodyPart.hitInfo.x = bodyPart.position.x
   bodyPart.hitInfo.y = bodyPart.position.y
  })
  setTimeout(() => {
    bodyPart.hitInfo = null
    clearInterval(bodyPart.changeFunc)
  }, duration)
  sendDisplayBlood(bodyPart, roomName)
}

function sendBGTextUpdate(socket, textType, isHitter) {
  let textToSend;
  let colour;
  let blue = "#3498db"
  let red = "#e74c3c"

  if(textType === "body") {
    textToSend = "BODY SHOT!"
    colour = isHitter ? blue : red
  }
  else if(textType === "head") {
    textToSend = "HEAD SHOT!"
    colour = isHitter ? blue : red
  }
  else if(textType === "kill") {
    textToSend = "NICE KILL!"
    colour = blue
  }
  else if(textType === "death") {
    textToSend = "DEATH!"
    colour = red
  }
  else if(textType === "levelUp") {
    textToSend = "L-L-LEVEL UP!"
    colour = blue
  }
  else if(textType === "start") {
    textToSend = "FIGHT!"
    colour = blue
  }
  socket.emit("updateBGText", textToSend, colour)
}


/*
  Body
    1,2
  Head
    1,2
  Kill
  Death
  Level Up
*/
