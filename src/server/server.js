let express = require('express')
let app = express()
let path = require('path')
let http = require('http').Server(app)
let io = require('socket.io')(http)
let c = require('../../config.json')
let Player = require('./Player.js')

app.use('/', express.static(path.resolve(__dirname + '/../client')));
let port = 4000;

http.listen(port, function () {
    console.log('listening on:', port);
});

let rooms = {}

/*
To do Today

Camera Angle thing
Player look like ragdoll
Fill players
Different players

Tomorrow 
Homepage
*/

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
    player.createMatterPlayer2(Matter, 5000, 5000)
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
      player.isDead = false
      player.createMatterPlayer2(Matter, 5000, 5000)
      player.health = player.initialHealth
      clearUpdates(socket.id)
      let updateInterval = setInterval(() => updateFrontEndInfo(room, socket, player), 15)
      socket.updateInterval = updateInterval
      leaderBoardChange(room)
    })
    leaderBoardChange(room)
    // Update Code
    setInterval(updatePlayerVertices, 16)
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
      name: player.name
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
          label: label
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
            let playerComp = players[player].PlayerComposite
            let bodies = playerComp.bodies
            let playerVertices = verticesFromBodies(bodies)
            // for(let i = 0; i < bodies.length; i++) {
            //     let vertices = bodies[i].vertices
            //     vertices = vertices.map(e => ({
            //         x: e.x,
            //         y: e.y
            //     }))
            //     playerVertices.push(vertices)
            // }
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
      pushItem.vertices = players[player].vertices
      pushItem.health = players[player].health 
      pushItem.name = players[player].name
      pushItem.id = players[player].id
      pushItem.isDead = players[player].isDead
      pushItem.pelvis = {
        x: players[player].pelvis.position.x,
        y: players[player].pelvis.position.y
      }
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


/* ---------------------------------------------------- COLLISION CODE -------------------------------------------------------- */


function collisionCheck(event, roomName, id) {
  let bodyA = event.pairs[0].bodyA
  let bodyB = event.pairs[0].bodyB
  // Check if colliding bodies are 2 different players
  if((bodyA.playerId && bodyB.playerId) && bodyA.playerId !== bodyB.playerId) {
    // Check if the hit is one which deals damage. Only if yes continue
    if(!isHit(bodyA, bodyB)) {
      repel(roomName, bodyA, bodyB)
      return
    }
    // bodyA is hitterPlayer
    if(isWinner(bodyA, bodyB)) {
      handleHit(bodyA.playerId, bodyB.playerId, bodyA.label, bodyB.label, roomName)
    }
    // bodyB is hitterPlayer
    else {
      handleHit(bodyB.playerId, bodyA.playerId, bodyB.label, bodyA.label, roomName)
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
  hitterPlayer = room.players[hitterPlayer]
  hitPlayer = room.players[hitPlayer]
  // Dead
  if (isPlayerDead(hitPlayer, bodyPartHit, hitterPlayer)) {
    let socket = io.sockets.connected[hitPlayer.id]
    // clearUpdates(socket.id)
    socket.emit('playerDeath', hitPlayer.killStreak)
    // Remove player
    hitPlayer.health = 0
    console.log('hitterPlayer: ', hitterPlayer.killStreak)
    hitterPlayer.killStreak += 1
    let Matter = io.sockets.adapter.rooms[roomName].Matter
    Matter.Composite.clear(hitPlayer.PlayerComposite)
    // delete rooms[roomName].players[hitPlayer.id]
    hitPlayer.isDead = true
    // Update Leaderboard
    leaderBoardChange(roomName)
    // Update Killfeed
    updateKillFeed(hitPlayer, bodyPartHit, hitterPlayer, roomName)
  }
  // Not Dead
  else {
    hitPlayer.health -= damageAmount(hitterPlayer, bodyPartHit)
  }
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
  io.sockets.in(roomName).emit('updateKillFeed', hitterPlayer.name, killType, hitPlayer.name)
}


/*
Send Information
- Player Info
  - Player Positions
  - Player Health
- Health Pack Info
  - Health Pack Position
  - Health Pack Status
- Walls
*/