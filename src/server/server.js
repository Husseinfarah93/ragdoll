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
    }
    // Set up camera front end 
    let worldWidth = c.gameModes[gameInfo.gameType].gameWidth
    let worldHeight = c.gameModes[gameInfo.gameType].gameHeight
    socket.emit('setUpWorld', worldWidth, worldHeight)
    // Create Player
    let player = new Player('player1', socket.id, gameInfo.character, gameInfo.skin)
    player.createMatterPlayer2(Matter, 5000, 5000)
    // Add player to room in rooms
    rooms[room].players[socket.id] = player
    // Collision Code
    Matter.Events.on(Matter.engine, 'collisionStart', (e) => collisionCheck(e, room))
    // Body 
    socket.on('keydown', (left, up, right, down) => {
      player.movePlayer(left, up, right, down, Matter)
    })
    socket.on('disconnect', () => {
      if(rooms[room].players[player.id]) {
        Matter.Composite.clear(player.PlayerComposite)
        delete rooms[room].players[player.id]
      }
    })
    // Update Code
    setInterval(updatePlayerVertices, 16)
    setInterval(() => updateFrontEndInfo(room, socket, player), 15)
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
  socket.emit('draw', frontEndInfo.Players, frontEndInfo.HealthPacks, frontEndInfo.Walls, Pelvis)
}

/* ---------------------------------------------------- SEND CODE -------------------------------------------------------- */

// Takes in bodies array. Returns list of vertices
function verticesFromBodies(bodies) {
  let verticesToReturn = []
  for(let i = 0; i < bodies.length; i++) {
      let vertices = bodies[i].vertices
      vertices = vertices.map(e => ({
          x: e.x,
          y: e.y
      }))
      verticesToReturn.push(vertices)
  }
  return verticesToReturn
}

function updatePlayerVertices() {
    for(room in rooms) {
        let players = rooms[room].players
        for(let player in players) {
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
      let pushItem = {}
      pushItem.vertices = players[player].vertices
      pushItem.health = players[player].health 
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


function collisionCheck(event, roomName) {
  let bodyA = event.pairs[0].bodyA
  let bodyB = event.pairs[0].bodyB
  // Check if colliding bodies are 2 different players
  if((bodyA.playerId && bodyB.playerId) && bodyA.playerId !== bodyB.playerId) {
    // Check if the hit is one which deals damage. Only if yes continue
    if(!isHit(bodyA, bodyB)) return
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
  return (bodyPart1.dealDamage && !bodyPart2.dealDamage) || (!bodyPart1.dealDamage && bodyPart2.dealDamage)
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
    // Remove player
    // socket.emit('death', hitPlayer, hitterPlayer, bodyPartHit)
    hitPlayer.health = 0
    let Matter = io.sockets.adapter.rooms[roomName].Matter
    Matter.Composite.clear(hitPlayer.PlayerComposite)
    delete rooms[roomName].players[hitPlayer.id]
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