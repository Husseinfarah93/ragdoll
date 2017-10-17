let c = require('../../config.json')
let randColour = require('./helper.js').randColour

function Player(name, id, characterType, skinType) {
  this.name = name ? name : 'PLAYER'
  this.id = id
  this.characterType = characterType 
  this.skinType = skinType
  this.initialHealth = c.playerTypes[characterType].initialHealth
  this.health = this.initialHealth
  this.killStreak = 0
  this.beltNumber = 0
  this.beltColour = "White"
  this.beltProgress = 0
  this.skillPoints = 0
  this.skillPointValues = {
    maxHealth: {val: 0, colour: '#FFBC40', text: 'Max Health', name: 'maxHealth', updateAmount: 10},
    maxSpeed: {val: 0, colour: '#F16F61', text: 'Max Speed', name: 'maxSpeed', updateAmount: 10},
    damageDealt: {val: 0, colour: '#4A89AA', text: 'Damage Dealt', name: 'damageDealt', updateAmount: 10},
    damageReceived: {val: 0, colour: '#5A3662', text: 'Damage Received', name: 'damageReceived', updateAmount: 10},
    healthRegen: {val: 0, colour: '#18C29C', text: 'Health Regen', name: 'healthRegen', updateAmount: 10}
  }
  this.isDead = false
  this.isBlownUp = false
  this.colour = randColour()
}

Player.prototype.createMatterPlayer1 = function(Matter, x, y) {
  let Bodies = Matter.Bodies,
      Constraint = Matter.Constraint,
      Composite = Matter.Composite

  let circleX = x,
    circleY = y,
    circleRad = 15,
    neckWidth = 10,
    neckHeight = 5,
    torsoHeight = 30,
    armWidth = 20,
    armHeight = 10,
    foreArmWidth = 40, 
    pelvisHeight = 20, 
    legWidth = neckWidth, 
    thighHeight = 30,
    calfHeight = 40
  
  // Options
  let options = {
    isStatic: false,
  }
  let rightForeArmOption = {
    chamfer: { radius: [0, 5, 5, 0] },
    render: {
      fillStyle: 'white',
      strokeStyle: 'white',
      lineWidth: 3
    }
  }
  let leftForeArmOption = {
    chamfer: { 
      radius: [5, 0, 0, 5] 
    },
    render: {
      fillStyle: 'white',
      strokeStyle: 'white',
      lineWidth: 3
    }
  }
  let rightCalfOption = {
    chamfer: { 
      radius: [0, 0, 5, 5] 
    },
    render: {
      fillStyle: 'white',
      strokeStyle: 'white',
      lineWidth: 3
    }
  }
  let leftCalfOption = {
    chamfer: { 
      radius: [0, 0, 5, 5] 
    },
    render: {
      fillStyle: 'white',
      strokeStyle: 'white',
      lineWidth: 3
    }
  }
  // Bodies
  let head = Bodies.circle(circleX, circleY, circleRad, options)
  let neck = Bodies.rectangle(head.position.x, head.position.y + head.circleRadius + neckHeight / 2, neckWidth, neckHeight, options)
  let torso = Bodies.rectangle(head.position.x, neck.position.y + neckHeight / 2 + torsoHeight / 2, neckWidth, torsoHeight, options)
  let rightArm = Bodies.rectangle(head.position.x + neckWidth / 2 + armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let leftArm = Bodies.rectangle(head.position.x - neckWidth / 2 - armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let rightForeArm = Bodies.rectangle(rightArm.position.x + armWidth / 2 + foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, rightForeArmOption)
  let leftForeArm = Bodies.rectangle(leftArm.position.x - armWidth / 2 - foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, leftForeArmOption)
  let pelvis = Bodies.rectangle(head.position.x, torso.position.y + torsoHeight / 2+ pelvisHeight / 2, neckWidth, pelvisHeight, options)
  let rightThigh = Bodies.rectangle(head.position.x + legWidth / 2, pelvis.position.y + pelvisHeight / 2 + thighHeight / 2, legWidth, thighHeight, options)
  let leftThigh = Bodies.rectangle(head.position.x - legWidth / 2, pelvis.position.y + pelvisHeight / 2 + thighHeight / 2, legWidth, thighHeight, options)
  let rightCalf = Bodies.rectangle(head.position.x + legWidth / 2, rightThigh.position.y + thighHeight / 2 + calfHeight / 2, legWidth, calfHeight, rightCalfOption)
  let leftCalf = Bodies.rectangle(head.position.x - legWidth / 2, leftThigh.position.y + thighHeight / 2 + calfHeight / 2, legWidth, calfHeight, leftCalfOption)

  // Joints
  let neckHead = Constraint.create({ bodyA: head, bodyB: neck })
  let neckTorso = Constraint.create({
    bodyA: neck,
    bodyB: torso, 
    pointB: {
      x: 0, 
      y: -torsoHeight / 2
    },
    stiffness: 1
  })
  let rightShoulder = Constraint.create({
    bodyA: torso,
    bodyB: rightArm,
    pointA: {
      x: neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: - armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
    
  })
  let leftShoulder = Constraint.create({
    bodyA: torso, 
    bodyB: leftArm,
    pointA: {
      x: - neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })
  let rightElbow = Constraint.create({
    bodyA: rightArm,
    bodyB: rightForeArm,
    pointA: {
      x: armWidth / 2,
      y: 0
    },
    pointB: {
      x: - foreArmWidth / 2,
      y: 0
    },
    render: {
      visible: false
    }
  })
  let leftElbow = Constraint.create({
    bodyA: leftArm,
    bodyB: leftForeArm,
    pointA: {
      x: - armWidth / 2, 
      y: 0
    },
    pointB: {
      x: foreArmWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })
  let pelvisJoint = Constraint.create({
    bodyA: torso, 
    bodyB: pelvis,
    pointA: {
      x: 0, 
      y: torsoHeight / 2
    }, 
    pointB: {
      x: 0, 
      y: - pelvisHeight / 2
    },
    render: {
      visible: false
    }
  })
  let rightPelvisThigh = Constraint.create({
    bodyA: pelvis,
    bodyB: rightThigh,
    pointA: {
      x: legWidth / 2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: 0,
      y: - thighHeight / 2
    },
    render: {
      visible: false
    }
  })
  let leftPelvisThigh = Constraint.create({
    bodyA: pelvis, 
    bodyB: leftThigh, 
    pointA: {
      x: - legWidth / 2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: 0, 
      y: - thighHeight / 2
    },
    render: {
      visible: false
    }
  })
  let rightKnee = Constraint.create({
    bodyA: rightThigh,
    bodyB: rightCalf, 
    pointA: {
      x: 0,
      y: thighHeight / 2
    },
    pointB: {
      x: 0, 
      y: - calfHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let leftKnee = Constraint.create({
    bodyA: leftThigh,
    bodyB: leftCalf, 
    pointA: {
      x: 0,
      y: thighHeight / 2
    },
    pointB: {
      x: 0, 
      y: - calfHeight / 2
    },
    render: {     
      visible: true
    },
    stiffness: 1
  })

  let playerComposite = Composite.create({
    bodies: [head, neck, torso, rightArm, leftArm, rightForeArm, leftForeArm, pelvis, rightThigh, leftThigh, rightCalf, leftCalf],
    constraints: [neckHead, neckTorso, rightShoulder, leftShoulder, rightElbow, leftElbow, pelvisJoint, rightPelvisThigh, leftPelvisThigh, rightKnee, leftKnee]
  })
  this.PlayerComposite = playerComposite
  return playerComposite
}

Player.prototype.createMatterPlayer = function(Matter, x, y) {
  let Bodies = Matter.Bodies,
      Constraint = Matter.Constraint,
      Composite = Matter.Composite
  
  let options = {isStatic: false}
  let head = Bodies.circle(x, y, 20, options)
  let neck = Bodies.rectangle(x, y + 20 + 5, 10, 10)
  let headNeck = Constraint.create({
    bodyA: head,
    bodyB: neck,
  })
  let torso = Bodies.rectangle(x, y + 20 + 10 + 10, 10, 20)
  let neckTorso = Constraint.create({
    bodyA: neck,
    bodyB: torso
  })
  let pc = Composite.create({
    bodies: [head, neck, torso],
    constraints: [headNeck, neckTorso]
  })
  this.PlayerComposite = pc
  return pc
}

// Old
Player.prototype.createMatterPlayer2 = function(Matter, x, y) {
  let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite

  // Sizes 
  let circleX = x,
    circleY = y,
    circleRad = 15,
    neckWidth = 10,
    neckHeight = 5,
    torsoHeight = 30,
    armWidth = 20,
    armBandWidth = 10,
    armHeight = 10,
    foreArmWidth = 30, 
    pelvisHeight = 20, 
    legWidth = neckWidth, 
    thighHeight = 30,
    calfHeight = 40
  
  // Options
  let options = {
    isStatic: false,
    playerId: this.id,
  }
  let rightForeArmOption = {
    chamfer: { radius: [0, 5, 5, 0] },
    playerId: this.id,
  }
  let leftForeArmOption = {
    chamfer: { 
      radius: [5, 0, 0, 5] 
    },
    playerId: this.id,
  }
  let rightCalfOption = {
    chamfer: { 
      radius: [0, 0, 5, 5] 
    },
    playerId: this.id,
  }
  let leftCalfOption = {
    chamfer: { 
      radius: [0, 0, 5, 5] 
    },
    playerId: this.id,
  }
  // Bodies
  let head = Bodies.circle(circleX, circleY, circleRad, options)
  let neck = Bodies.rectangle(head.position.x, head.position.y + head.circleRadius + neckHeight / 2, neckWidth, neckHeight, options)
  let torso = Bodies.rectangle(head.position.x, neck.position.y + neckHeight / 2 + torsoHeight / 2, neckWidth, torsoHeight, options)
  let rightArm = Bodies.rectangle(head.position.x + neckWidth / 2 + armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let leftArm = Bodies.rectangle(head.position.x - neckWidth / 2 - armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let rightArmBand = Bodies.rectangle(rightArm.position.x + armWidth / 2 + armBandWidth / 2, torso.position.y, armBandWidth, armHeight, options)
  let leftArmBand = Bodies.rectangle(leftArm.position.x - armWidth / 2 - armBandWidth / 2, torso.position.y, armBandWidth, armHeight, options)
  let rightForeArm = Bodies.rectangle(rightArmBand.position.x + armBandWidth / 2 + foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, options)
  let leftForeArm = Bodies.rectangle(leftArmBand.position.x - armBandWidth / 2 - foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, options)
  let pelvis = Bodies.rectangle(head.position.x, torso.position.y + torsoHeight / 2+ pelvisHeight / 2, neckWidth, pelvisHeight, options)
  let rightThigh = Bodies.rectangle(head.position.x + legWidth / 2, pelvis.position.y + pelvisHeight / 2 + thighHeight / 2, legWidth, thighHeight, options)
  let leftThigh = Bodies.rectangle(head.position.x - legWidth / 2, pelvis.position.y + pelvisHeight / 2 + thighHeight / 2, legWidth, thighHeight, options)
  let rightCalf = Bodies.rectangle(head.position.x + legWidth / 2, rightThigh.position.y + thighHeight / 2 + calfHeight / 2, legWidth, calfHeight, rightCalfOption)
  let leftCalf = Bodies.rectangle(head.position.x - legWidth / 2, leftThigh.position.y + thighHeight / 2 + calfHeight / 2, legWidth, calfHeight, leftCalfOption)

  // Labels
  head.label = 'head'
  neck.label = 'neck'
  torso.label = 'torso'
  rightArm.label = 'arm'
  leftArm.label = 'arm'
  rightArmBand.label = 'armband'
  leftArmBand.label = 'armband'
  rightForeArm.label = 'forearm'
  leftForeArm.label = 'forearm'
  pelvis.label = 'pelvis'
  rightThigh.label = 'thigh'
  leftThigh.label = 'thigh'
  rightCalf.label = 'foot'
  leftCalf.label = 'foot'

  // Body Parts Take/Deal Damage
  head.dealDamage = false
  neck.dealDamage = false 
  torso.dealDamage = false 
  rightArm.dealDamage = false 
  leftArm.dealDamage = false 
  rightArmBand.dealDamage = false 
  leftArmBand.dealDamage = false
  rightForeArm.dealDamage = true 
  leftForeArm.dealDamage = true 
  pelvis.dealDamage = false 
  rightThigh.dealDamage = false 
  leftThigh.dealDamage = false 
  rightCalf.dealDamage = true 
  leftCalf.dealDamage = true

  this.head = head
  this.pelvis = pelvis

  // Joints
  let neckHead = Constraint.create({
    bodyA: head, 
    bodyB: neck,
    pointA: {
      x: 0, 
      y: 0
    },
    render: {
      visible: true
    }
  })
  let neckTorso = Constraint.create({
    bodyA: neck,
    bodyB: torso, 
    pointB: {
      x: 0, 
      y: -torsoHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let rightShoulder = Constraint.create({
    bodyA: torso,
    bodyB: rightArm,
    pointA: {
      x: neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: - armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
    
  })
  let leftShoulder = Constraint.create({
    bodyA: torso, 
    bodyB: leftArm,
    pointA: {
      x: - neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })

  let rightArmArmBand = Constraint.create({
    bodyA: rightArm,
    bodyB: rightArmBand,
    pointA: {
      x: armWidth / 2,
      y: 0
    },
    pointB: {
      x: - armBandWidth / 2,
      y: 0
    },
    render: {
      visible: false
    }
  })
  let leftArmArmBand = Constraint.create({
    bodyA: leftArm,
    bodyB: leftArmBand,
    pointA: {
      x: - armWidth / 2, 
      y: 0
    },
    pointB: {
      x: armBandWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })
  
  let rightElbow = Constraint.create({
    bodyA: rightArmBand,
    bodyB: rightForeArm,
    pointA: {
      x: armBandWidth / 2,
      y: 0
    },
    pointB: {
      x: - foreArmWidth / 2,
      y: 0
    },
    render: {
      visible: false
    }
  })
  let leftElbow = Constraint.create({
    bodyA: leftArmBand,
    bodyB: leftForeArm,
    pointA: {
      x: - armBandWidth / 2, 
      y: 0
    },
    pointB: {
      x: foreArmWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })

  let pelvisJoint = Constraint.create({
    bodyA: torso, 
    bodyB: pelvis,
    pointA: {
      x: 0, 
      y: torsoHeight / 2
    }, 
    pointB: {
      x: 0, 
      y: - pelvisHeight / 2
    },
    render: {
      visible: false
    }
  })
  let rightPelvisThigh = Constraint.create({
    bodyA: pelvis,
    bodyB: rightThigh,
    pointA: {
      x: legWidth / 2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: 0,
      y: - thighHeight / 2
    },
    render: {
      visible: false
    }
  })
  let leftPelvisThigh = Constraint.create({
    bodyA: pelvis, 
    bodyB: leftThigh, 
    pointA: {
      x: - legWidth / 2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: 0, 
      y: - thighHeight / 2
    },
    render: {
      visible: false
    }
  })
  let rightKnee = Constraint.create({
    bodyA: rightThigh,
    bodyB: rightCalf, 
    pointA: {
      x: 0,
      y: thighHeight / 2
    },
    pointB: {
      x: 0, 
      y: - calfHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let leftKnee = Constraint.create({
    bodyA: leftThigh,
    bodyB: leftCalf, 
    pointA: {
      x: 0,
      y: thighHeight / 2
    },
    pointB: {
      x: 0, 
      y: - calfHeight / 2
    },
    render: {     
      visible: false
    },
    stiffness: 1
  })

  // add all of the bodies to the world
  let player = Composite.create({
    bodies: [head, neck, torso, rightArm, leftArm, rightArmBand, leftArmBand, rightForeArm, leftForeArm, pelvis, rightThigh, leftThigh, rightCalf, leftCalf],
    constraints: [neckHead, neckTorso, rightShoulder, leftShoulder, rightArmArmBand, leftArmArmBand, rightElbow, leftElbow, pelvisJoint, rightPelvisThigh, leftPelvisThigh, rightKnee, leftKnee]
  })
  World.add(Matter.engine.world, player)
  this.PlayerComposite = player 
  // return player
}

// New 
Player.prototype.createMatterPlayer3 = function(Matter, x1, y1) {
  let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Vertices = Matter.Vertices

  let circleX = x1,
    circleY = y1,
    neckWidth = 10,
    circleRad = neckWidth * 1.5,
    neckHeight = 5,
    torsoHeight = 10,
    armWidth = 20,
    armHeight = 10,
    foreArmWidth = 40, 
    pelvisHeight = 20, 
    legWidth = neckWidth, 
    thighHeight = 30,
    calfHeight = 40,
    legLength = 40
      
  let angle = Math.acos(0.5)
  // let radians = angle * Math.PI / 180
  let triangleHeight = Math.tan(angle) * 0.5 * neckWidth
  // Options
  let options = {
    isStatic: false,
    playerId: this.id,
  }
  let rightForeArmOption = {
    chamfer: { radius: [0, 5, 5, 0] },
    playerId: this.id
  }
  let leftForeArmOption = {
    chamfer: { radius: [5, 0, 0, 5] },
    playerId: this.id
  }

  // Bodies
  let head = Bodies.circle(circleX, circleY, circleRad, options)
  let neck = Bodies.rectangle(head.position.x, head.position.y + head.circleRadius + neckHeight / 2, neckWidth, neckHeight, options)
  let torso = Bodies.rectangle(head.position.x, neck.position.y + neckHeight / 2 + torsoHeight / 2, neckWidth, torsoHeight, options)
  let rightArm = Bodies.rectangle(head.position.x + neckWidth / 2 + armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let leftArm = Bodies.rectangle(head.position.x - neckWidth / 2 - armWidth / 2, torso.position.y, armWidth, armHeight, options)
  let rightForeArm = Bodies.rectangle(rightArm.position.x + armWidth / 2 + foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, rightForeArmOption)
  let leftForeArm = Bodies.rectangle(leftArm.position.x - armWidth / 2 - foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, leftForeArmOption)
  let pelvis = Bodies.rectangle(head.position.x, torso.position.y + torsoHeight / 2+ pelvisHeight / 2, neckWidth, pelvisHeight, options)


  let x = circleX
  let y = pelvis.position.y + (pelvisHeight/2)
  let width = neckWidth
  let vertices = [{x: x, y: y}, {x: x + width, y: y}, {x: x + (width / 2), y: y + triangleHeight}, {x: x, y: y}]
  let triangle = Bodies.fromVertices(x, y + (triangleHeight / 3), vertices, options)


  let leftRes = this.genLeftLeg(circleX - (neckWidth / 2), pelvis.position.y + (pelvisHeight / 2), triangleHeight, angle, neckWidth, legLength)
  let rightRes = this.genRightLeg(circleX + (neckWidth / 2), pelvis.position.y + (pelvisHeight / 2), triangleHeight, angle, neckWidth, legLength)

  // Left Foot
  let lv = leftRes.vertices 
  let leftFootRes = this.genLeftLeg(lv[3].x, lv[3].y, triangleHeight, angle, neckWidth, legLength)

  // Right Foot
  let rv = rightRes.vertices
  let rightFootRes = this.genRightLeg(rv[3].x, rv[3].y, triangleHeight, angle, neckWidth, legLength)


  let leftBallX = (leftFootRes.vertices[2].x + leftFootRes.vertices[3].x) / 2
  let leftBallY = (leftFootRes.vertices[2].y + leftFootRes.vertices[3].y) / 2
  let ball = Bodies.circle(leftBallX, leftBallY, 0.9*width / 2, options)

  let rightBallX = (rightFootRes.vertices[2].x + rightFootRes.vertices[3].x) / 2
  let rightBallY = (rightFootRes.vertices[2].y + rightFootRes.vertices[3].y) / 2
  let ball2 = Bodies.circle(rightBallX, rightBallY, 0.9*width / 2, options)


  let rightLeg = Bodies.fromVertices(rightRes.midX, rightRes.midY, rightRes.vertices, options)
  let leftLeg = Bodies.fromVertices(leftRes.midX, leftRes.midY, leftRes.vertices, options)
  let leftFoot = Bodies.fromVertices(leftFootRes.midX, leftFootRes.midY, leftFootRes.vertices, options)
  let rightFoot = Bodies.fromVertices(rightFootRes.midX, rightFootRes.midY, rightFootRes.vertices, options)


  // Labels
  head.label = 'head'
  neck.label = 'neck'
  torso.label = 'torso'
  rightArm.label = 'arm'
  leftArm.label = 'arm'
  rightForeArm.label = 'forearm'
  leftForeArm.label = 'forearm'
  pelvis.label = 'pelvis'
  leftLeg.label = 'thigh'
  rightLeg.label = 'thigh'
  leftFoot.label = 'calf'
  rightFoot.label = 'calf'
  ball.label = 'foot'
  ball2.label = 'foot'

  // Body Parts Take/Deal Damage
  head.dealDamage = false
  neck.dealDamage = false 
  torso.dealDamage = false 
  rightArm.dealDamage = false 
  leftArm.dealDamage = false 
  rightForeArm.dealDamage = true 
  leftForeArm.dealDamage = true 
  pelvis.dealDamage = false 
  leftLeg.dealDamage = false 
  rightLeg.dealDamage = false 
  leftFoot.dealDamage = true 
  rightFoot.dealDamage = true 
  ball.dealDamage = true 
  ball2.dealDamage = true

  this.head = head
  this.pelvis = pelvis

  // Joints
  let neckHeadL = Constraint.create({
    bodyA: head, 
    bodyB: neck,
    pointA: {
      x: -neckWidth / 2, 
      y: circleRad
    },
    pointB: {
      x: -neckWidth / 2,
      y: -neckHeight / 2
    },
    render: {
      visible: false
    }
  })
  let neckHeadM = Constraint.create({
    bodyA: head, 
    bodyB: neck,
    pointA: {
      x: 0, 
      y: circleRad
    },
    pointB: {
      x: 0, 
      y: -neckHeight / 2
    },
    render: {
      visible: false
    }
  })
  let neckHeadR = Constraint.create({
    bodyA: head, 
    bodyB: neck,
    pointA: {
      x: neckWidth / 2, 
      y: circleRad
    },
    pointB: {
      x: neckWidth / 2,
      y: - neckHeight / 2
    },
    render: {
      visible: false
    }
  })

  let neckTorsoL = Constraint.create({
    bodyA: neck,
    bodyB: torso, 
    pointA: {
      x: - neckWidth / 2,
      y: neckHeight / 2
    },
    pointB: {
      x: - neckWidth / 2, 
      y: -torsoHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let neckTorsoM = Constraint.create({
    bodyA: neck,
    bodyB: torso, 
    pointA: {
      x: 0,
      y: neckHeight / 2
    },
    pointB: {
      x: 0, 
      y: -torsoHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let neckTorsoR = Constraint.create({
    bodyA: neck,
    bodyB: torso, 
    pointA: {
      x: neckWidth / 2,
      y: neckHeight / 2
    },
    pointB: {
      x: neckWidth / 2, 
      y: -torsoHeight / 2
    },
    render: {
      visible: false
    },
    stiffness: 1
  })

  let rightShoulderL = Constraint.create({
    bodyA: torso,
    bodyB: rightArm,
    pointA: {
      x: neckWidth / 2, 
      y: - torsoHeight / 2
    },
    pointB: {
      x: - armWidth / 2, 
      y: - armHeight / 2
    },
    render: {
      visible: false
    }
    
  })
  let rightShoulderM = Constraint.create({
    bodyA: torso,
    bodyB: rightArm,
    pointA: {
      x: neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: - armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
    
  })
  let rightShoulderR = Constraint.create({
    bodyA: torso,
    bodyB: rightArm,
    pointA: {
      x: neckWidth / 2, 
      y: torsoHeight / 2
    },
    pointB: {
      x: - armWidth / 2, 
      y: armHeight / 2
    },
    render: {
      visible: false
    }
    
  })

  let leftShoulderL = Constraint.create({
    bodyA: torso, 
    bodyB: leftArm,
    pointA: {
      x: - neckWidth / 2, 
      y: - torsoHeight / 2
    },
    pointB: {
      x: armWidth / 2, 
      y: - armHeight / 2
    },
    render: {
      visible: false
    }
  })
  let leftShoulderM = Constraint.create({
    bodyA: torso, 
    bodyB: leftArm,
    pointA: {
      x: - neckWidth / 2, 
      y: 0
    },
    pointB: {
      x: armWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })
  let leftShoulderR = Constraint.create({
    bodyA: torso, 
    bodyB: leftArm,
    pointA: {
      x: - neckWidth / 2, 
      y: torsoHeight / 2
    },
    pointB: {
      x: armWidth / 2, 
      y: armHeight / 2
    },
    render: {
      visible: false
    }
  })

  let rightElbowL = Constraint.create({
    bodyA: rightArm,
    bodyB: rightForeArm,
    pointA: {
      x: armWidth / 2,
      y: - armHeight / 2
    },
    pointB: {
      x: - foreArmWidth / 2,
      y: - armHeight / 2
    },
    render: {
      visible: false
    }
  })
  let rightElbowM = Constraint.create({
    bodyA: rightArm,
    bodyB: rightForeArm,
    pointA: {
      x: armWidth / 2,
      y: 0
    },
    pointB: {
      x: - foreArmWidth / 2,
      y: 0
    },
    render: {
      visible: false
    }
  })
  let rightElbowR = Constraint.create({
    bodyA: rightArm,
    bodyB: rightForeArm,
    pointA: {
      x: armWidth / 2,
      y: armHeight / 2
    },
    pointB: {
      x: - foreArmWidth / 2,
      y: armHeight / 2
    },
    render: {
      visible: false
    }
  })

  let leftElbowL = Constraint.create({
    bodyA: leftArm,
    bodyB: leftForeArm,
    pointA: {
      x: - armWidth / 2, 
      y: - armHeight / 2
    },
    pointB: {
      x: foreArmWidth / 2, 
      y: - armHeight / 2
    },
    render: {
      visible: false
    }
  })
  let leftElbowM = Constraint.create({
    bodyA: leftArm,
    bodyB: leftForeArm,
    pointA: {
      x: - armWidth / 2, 
      y: 0
    },
    pointB: {
      x: foreArmWidth / 2, 
      y: 0
    },
    render: {
      visible: false
    }
  })
  let leftElbowR = Constraint.create({
    bodyA: leftArm,
    bodyB: leftForeArm,
    pointA: {
      x: - armWidth / 2, 
      y: armHeight / 2
    },
    pointB: {
      x: foreArmWidth / 2, 
      y: armHeight / 2
    },
    render: {
      visible: false
    }
  })

  let pelvisJointL = Constraint.create({
    bodyA: torso, 
    bodyB: pelvis,
    pointA: {
      x: - neckWidth / 2, 
      y: torsoHeight / 2
    }, 
    pointB: {
      x: - neckWidth / 2, 
      y: - pelvisHeight / 2
    },
    render: {
      visible: false
    }
  }) 
  let pelvisJointM = Constraint.create({
    bodyA: torso, 
    bodyB: pelvis,
    pointA: {
      x: 0, 
      y: torsoHeight / 2
    }, 
    pointB: {
      x: 0, 
      y: - pelvisHeight / 2
    },
    render: {
      visible: false
    }
  })
  let pelvisJointR = Constraint.create({
    bodyA: torso, 
    bodyB: pelvis,
    pointA: {
      x: neckWidth / 2, 
      y: torsoHeight / 2
    }, 
    pointB: {
      x: neckWidth / 2, 
      y: - pelvisHeight / 2
    },
    render: {
      visible: false
    }
  })

  let pelvisTriangleL = Constraint.create({
    bodyA: pelvis,
    bodyB: triangle,
    pointA: {
      x: -width/2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: -width / 2,
      y: -triangleHeight / 3
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let pelvisTriangleM = Constraint.create({
    bodyA: pelvis,
    bodyB: triangle,
    pointA: {
      x: 0,
      y: pelvisHeight / 2
    },
    pointB: {
      x: 0,
      y: -triangleHeight / 3
    },
    render: {
      visible: false
    },
    stiffness: 1
  })
  let pelvisTriangleR = Constraint.create({
    bodyA: pelvis,
    bodyB: triangle,
    pointA: {
      x: width / 2,
      y: pelvisHeight / 2
    },
    pointB: {
      x: width / 2,
      y: -triangleHeight / 3
    },
    render: {
      visible: false
    },
    stiffness: 1
  })

  let triangleLeftLegL = Constraint.create({
    bodyA: triangle,
    bodyB: leftLeg,
    pointA: {
      x: -width / 2,
      y: -triangleHeight / 3
    },
    pointB: {
      x: triangle.position.x - leftLeg.position.x - (width / 2),
      y: triangle.position.y - leftLeg.position.y - (triangleHeight / 3)
    },
    render: {
      visible: false
    }
  })
  let triangleLeftLegM = Constraint.create({
    bodyA: triangle,
    bodyB: leftLeg,
    pointA: {
      x: -width / 4,
      y: -(triangleHeight / 3) + (triangleHeight / 2)
    },
    pointB: {
      x: triangle.position.x - leftLeg.position.x - (width / 4),
      y: triangle.position.y - leftLeg.position.y  -(triangleHeight / 3) + (triangleHeight / 2)
    },
    render: {
      visible: false
    }
  })
  let triangleLeftLegR = Constraint.create({
    bodyA: triangle,
    bodyB: leftLeg,
    pointA: {
      x: 0,
      y: triangleHeight * 2 / 3
    },
    pointB: {
      x: triangle.position.x - leftLeg.position.x,
      y: triangle.position.y - leftLeg.position.y + (triangleHeight * 2 / 3)
    },
    render: {
      visible: false
    }
  })

  let triangleRightLegL = Constraint.create({
    bodyA: triangle,
    bodyB: rightLeg,
    pointA: {
      x: width / 2,
      y: - triangleHeight / 3
    },
    pointB: {
      x: triangle.position.x - rightLeg.position.x + (width / 2),
      y: triangle.position.y - rightLeg.position.y - (triangleHeight / 3)
    },
    render: {
      visible: false
    }
  })  
  let triangleRightLegM = Constraint.create({
    bodyA: triangle,
    bodyB: rightLeg,
    pointA: {
      x: width / 4,
      y: - (triangleHeight / 3) + (triangleHeight / 2)
    },
    pointB: {
      x: triangle.position.x - rightLeg.position.x + (width / 4),
      y: triangle.position.y - rightLeg.position.y - (triangleHeight / 3) + (triangleHeight / 2)
    },
    render: {
      visible: false
    }
  })
  let triangleRightLegR = Constraint.create({
    bodyA: triangle,
    bodyB: rightLeg,
    pointA: {
      x: 0,
      y: triangleHeight * 2 / 3
    },
    pointB: {
      x: triangle.position.x - rightLeg.position.x,
      y: triangle.position.y - rightLeg.position.y + ( triangleHeight * 2 / 3)
    },
    render: {
      visible: false
    }
  })

  let xDiff = triangle.position.x - leftLeg.position.x - (width / 2)
  let yDiff = leftLeg.position.y - triangle.position.y + (triangleHeight / 3)
  let xDiff2 = triangle.position.x - leftLeg.position.x
  let yDiff2 = triangle.position.y - leftLeg.position.y + (triangleHeight * 2 / 3)

  let leftLegFootL = Constraint.create({
    bodyA: leftLeg,
    bodyB: leftFoot,
    pointA: {
      x: -xDiff2,
      y: -yDiff2
    },
    pointB: {
      x: xDiff,
      y: -yDiff
    },
    render: {
      visible: false
    }
  })
  let leftLegFootM = Constraint.create({
    bodyA: leftLeg,
    bodyB: leftFoot,
    pointA: {
      x: (leftFoot.position.x - leftLeg.position.x) / 2,
      y: (leftFoot.position.y - leftLeg.position.y) / 2
    },
    pointB: {
      x: -(leftFoot.position.x - leftLeg.position.x) / 2,
      y: -(leftFoot.position.y - leftLeg.position.y) / 2
    },
    render: {
      visible: false
    }
  })
  let leftLegFootR = Constraint.create({
    bodyA: leftLeg,
    bodyB: leftFoot,
    pointA: {
      x: -xDiff,
      y: yDiff
    },
    pointB: {
      x: xDiff2,
      y: yDiff2
    },
    render: {
      visible: false
    }
  })

  let rightLegFootL = Constraint.create({
    bodyA: rightLeg,
    bodyB: rightFoot,
    pointA: {
      x: xDiff,
      y: yDiff
    },
    pointB: {
      x: -xDiff2,
      y: yDiff2
    },
    render: {
      visible: false
    }
  }) 
  let rightLegFootM = Constraint.create({
    bodyA: rightLeg,
    bodyB: rightFoot,
    pointA: {
      x: (rightFoot.position.x - rightLeg.position.x) / 2,
      y: (rightFoot.position.y - rightLeg.position.y) / 2
    },
    pointB: {
      x: -(rightFoot.position.x - rightLeg.position.x) / 2,
      y: -(rightFoot.position.y - rightLeg.position.y) / 2
    },
    render: {
      visible: false
    }
  })
  let rightLegFootR = Constraint.create({
    bodyA: rightLeg,
    bodyB: rightFoot,
    pointA: {
      x: xDiff2,
      y: -yDiff2
    },
    pointB: {
      x: -xDiff,
      y: -yDiff
    },
    render: {
      visible: false
    }
  }) 

  let leftFootBall = Constraint.create({
    bodyA: leftFoot,
    bodyB: ball,
    pointA: {
      x: ball.position.x - leftFoot.position.x,
      y: ball.position.y - leftFoot.position.y
    },
    pointB: {
      x: 0,
      y: 0
    },
    render: {
      visible: false
    }
  })
  let rightFootBall = Constraint.create({
    bodyA: rightFoot,
    bodyB: ball2,
    pointA: {
      x: ball2.position.x - rightFoot.position.x,
      y: ball2.position.y - rightFoot.position.y
    },
    pointB: {
      x: 0,
      y: 0
    },
    render: {
      visible: false
    }
  })

  // add all of the bodies to the world
  let player = Composite.create({
    bodies: [head, neck, torso, rightArm, leftArm, rightForeArm, leftForeArm, pelvis, triangle, leftLeg, rightLeg, leftFoot, rightFoot, ball, ball2],
    constraints: [
      neckHeadL, neckHeadM, neckHeadR, 
      neckTorsoL, neckTorsoM, neckTorsoR,
      rightShoulderL, rightShoulderM, rightShoulderR,
      leftShoulderL, leftShoulderM, leftShoulderR,
      rightElbowL, rightElbowM, rightElbowR, 
      leftElbowL, leftElbowM, leftElbowR, 
      pelvisJointL, pelvisJointM, pelvisJointR, 
      pelvisTriangleL, pelvisTriangleM, pelvisTriangleR, 
      triangleLeftLegL, triangleLeftLegM, triangleLeftLegR,
      triangleRightLegL, triangleRightLegM, triangleRightLegR, 
      leftLegFootL, leftLegFootM, leftLegFootR, 
      rightLegFootL, rightLegFootM, rightLegFootR, 
      leftFootBall, rightFootBall]
  })
  this.PlayerComposite = player
  World.add(Matter.engine.world, player)
  return player
}

// NEW NEW CIRCLES
Player.prototype.createMatterPlayerCircles = function(Matter, initialX, initialY, radius) {
  let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    world = Matter.engine.world
  let options = {collisionFilter: { group: Body.nextGroup(true) }}
  let playerId = this.id
	// Torso
	let torsoCircles = []
	let torsoConstraints = []
	let x = initialX
	let y = initialY
	// Generate torsoCircles
	for(let i = 0; i < 5; i++) {
		let circle;
		if(i === 0) circle = Bodies.circle(x, y, radius, options)
		else circle = Bodies.circle(x, y, radius)
		torsoCircles.push(circle)
		y += (radius * 2)
	}
	// Generate torsoConstraints
	for(let i = 0; i < 4; i++) {
		let bodyA = torsoCircles[i]
		let bodyB = torsoCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
			render: {visible: false}
		})
		torsoConstraints.push(constraint)
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		torsoConstraints.push(constraint2)
	}
	let addedConstraint = Constraint.create({
		bodyA: torsoCircles[0],
		bodyB: torsoCircles[1],
		render: {visible: false}
	})
	torsoConstraints.push(addedConstraint)
	let torso = Composite.create({
		bodies: torsoCircles,
		constraints: torsoConstraints
	})
	// World.add(world, torso)

		
	// Right Arm
	let rightArmCircles = []
	let rightArmConstraints = []
	x = initialX + (2 * radius)
	y = initialY + (2 * radius)
	// Generate rightArmCircles 
	for(let i = 0; i < 2; i++) {
		let circle = Bodies.circle(x, y, radius)
		rightArmCircles.push(circle)
		x += (radius * 2)
	}
	// Generate rightArmConstraints 
	let torsoRightArmConstraint = Constraint.create({
		bodyA: torsoCircles[1],
		bodyB: rightArmCircles[0],
		pointA: {x: radius, y: 0},
		pointB: {x: -radius, y: 0},
		render: {visible: false}
	})
	rightArmConstraints.push(torsoRightArmConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = rightArmCircles[i]
		let bodyB = rightArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: radius, y: 0},
			pointB: {x: -radius, y: 0},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightArmConstraints.push(constraint)
		rightArmConstraints.push(constraint2)
	}
	let rightArm = Composite.create({
		bodies: rightArmCircles,
		constraints: rightArmConstraints
	})

	// Right Forearm
	let rightForeArmCircles = []
	let rightForeArmConstraints = []
	y = initialY + (2 * radius)
	x = initialX + (4 * radius)
	let angle = 110
	let theta = angle * Math.PI / 180
	let yDiff = 2 * radius * Math.cos(theta)
	let xDiff = 2 * radius * Math.sin(theta)
	// Generate rightForeArmCircles
	for(let i = 0; i < 2; i++) {
		x += xDiff
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		rightForeArmCircles.push(circle)
	}
	// Generate rightForeArmConstraints
	let initialConstraint = Constraint.create({
		bodyA: rightArmCircles[rightArmCircles.length - 1],
		bodyB: rightForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	rightForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = rightForeArmCircles[i]
		let bodyB = rightForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightForeArmConstraints.push(constraint)
		rightForeArmConstraints.push(constraint2)
	}
	
	let rightForeArm = Composite.create({
		bodies: rightForeArmCircles,
		constraints: rightForeArmConstraints
	})

	
	// Left Arm
	let leftArmCircles = []
	let leftArmConstraints = []
	x = initialX - (2 * radius)
	y = initialY + (2 * radius)
	// Generate leftArmCircles
	for(let i = 0; i < 2; i++) {
		let circle = Bodies.circle(x, y, radius)
		leftArmCircles.push(circle)
		x -= (radius * 2)
	}
	// Generate leftArmConstraints 
	let torsoLeftArmConstraint = Constraint.create({
		bodyA: torsoCircles[1],
		bodyB: leftArmCircles[0],
		pointA: {x: -radius, y: 0},
		pointB: {x: radius, y: 0},
		render: {visible: false}
	})
	leftArmConstraints.push(torsoLeftArmConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftArmCircles[i]
		let bodyB = leftArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: -radius, y: 0},
			pointB: {x: radius, y: 0},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftArmConstraints.push(constraint)
		leftArmConstraints.push(constraint2)
	}
	let leftArm = Composite.create({
		bodies: leftArmCircles,
		constraints: leftArmConstraints
	})

	
	// Left Forearm 
	let leftForeArmCircles = []
	let leftForeArmConstraints = []
	y = initialY + (2 * radius)
	x = initialX - (4 * radius)
	angle = 110
	theta = angle * Math.PI / 180
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = - 2 * radius * Math.sin(theta)
	// Generate leftForeArmCircles
	for(let i = 0; i < 2; i++) {
		x += xDiff
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		leftForeArmCircles.push(circle)
	}
	// Generate leftForeArmConstraints
	initialConstraint = Constraint.create({
		bodyA: leftArmCircles[rightArmCircles.length - 1],
		bodyB: leftForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	leftForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftForeArmCircles[i]
		let bodyB = leftForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint)
		leftForeArmConstraints.push(constraint2)
	}
	
	let leftForeArm = Composite.create({
		bodies: leftForeArmCircles,
		constraints: leftForeArmConstraints
	})

	
	let initialConstraint2;
	// Right Thigh 
	let rightThighCircles = []
	let rightThighConstraints = []
	x = initialX 
	y = initialY + (8 * radius)
	xDiff = radius 
	yDiff = Math.pow((3 * radius * radius), 0.5)
	// Generate rightThighCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff 
		let circle = Bodies.circle(x, y, radius)
		rightThighCircles.push(circle)
	}
	initialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: rightThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: rightThighCircles[0],
		render: {visible: false}
	})
	rightThighConstraints.push(initialConstraint)
	rightThighConstraints.push(initialConstraint2)
	
	// Generate rightThighConstraints
	for(let i = 0; i < 2; i++) {
		let bodyA = rightThighCircles[i]
		let bodyB = rightThighCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightThighConstraints.push(constraint)
		rightThighConstraints.push(constraint2)
	}
	let rightThigh = Composite.create({
		bodies: rightThighCircles,
		constraints: rightThighConstraints
  })
  
	// Right Leg 
	let rightLegCircles = []
	let rightLegConstraints = []
	angle = 45
	theta = angle * Math.PI / 180
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = 2 * radius * Math.sin(theta)
	
	// Generate rightLegCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		rightLegCircles.push(circle)
	}
	// Generate rightLegConstraints 
	initialConstraint = Constraint.create({
		bodyA: rightThighCircles[rightThighCircles.length - 1],
		bodyB: rightLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: rightThighCircles[rightThighCircles.length - 1],
		bodyB: rightLegCircles[0],
		render: {visible: false}
	})
	rightLegConstraints.push(initialConstraint)
	rightLegConstraints.push(initialConstraint2)
	for(let i = 0; i < 2; i++) {
		let bodyA = rightLegCircles[i]
		let bodyB = rightLegCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightLegConstraints.push(constraint)
		rightLegConstraints.push(constraint2)
	}
	let rightLeg = Composite.create({
		bodies: rightLegCircles,
		constraints: rightLegConstraints
	})
	
	// Left Thigh 
	let leftThighCircles = []
	let leftThighConstraints = []
	x = initialX 
	y = initialY + (8 * radius)
	xDiff = -radius 
	yDiff = Math.pow((3 * radius * radius), 0.5)
	// Generate rightThighCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff 
		let circle = Bodies.circle(x, y, radius)
		leftThighCircles.push(circle)
	}
	initialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: leftThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: leftThighCircles[0],
		render: {visible: false}
	})
	leftThighConstraints.push(initialConstraint)
	leftThighConstraints.push(initialConstraint2)
	// Generate rightThighConstraints
	for(let i = 0; i < 2; i++) {
		let bodyA = leftThighCircles[i]
		let bodyB = leftThighCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftThighConstraints.push(constraint)
		leftThighConstraints.push(constraint2)
	}
	let leftThigh = Composite.create({
		bodies: leftThighCircles,
		constraints: leftThighConstraints
	})

	
	// Right Leg 
	let leftLegCircles = []
	let leftLegConstraints = []
	angle = 45
	theta = angle * Math.PI / 180
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = - 2 * radius * Math.sin(theta)
	
	// Generate rightLegCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		leftLegCircles.push(circle)
	}
	// Generate rightLegConstraints 
	initialConstraint = Constraint.create({
		bodyA: leftThighCircles[rightThighCircles.length - 1],
		bodyB: leftLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: leftThighCircles[rightThighCircles.length - 1],
		bodyB: leftLegCircles[0],
		render: {visible: false}
	})
	leftLegConstraints.push(initialConstraint)
	leftLegConstraints.push(initialConstraint2)
	for(let i = 0; i < 2; i++) {
		let bodyA = leftLegCircles[i]
		let bodyB = leftLegCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftLegConstraints.push(constraint)
		leftLegConstraints.push(constraint2)
	}
	let leftLeg = Composite.create({
		bodies: leftLegCircles,
		constraints: leftLegConstraints
	})

	
	
	// Head
	x = initialX
	y = initialY - (2 * radius) 
	radius *= 2
	let headCircles = [Bodies.circle(x, y, radius, options)]
	let headConstraint = Constraint.create({
		bodyA: headCircles[0],
		bodyB: torsoCircles[0],
		pointA: {x: 0, y: radius},
		pointB: {x: 0, y: 0},
		render: {visible: false}
	})
	let headConstraint2 = Constraint.create({
		bodyA: headCircles[0],
		bodyB: torsoCircles[0],
		pointA: {x: 0, y: 0},
		pointB: {x: 0, y: -10},
		render: {visible: false}
	})
	let head = Composite.create({
		bodies: headCircles,
		constraints: [headConstraint, headConstraint2]
	})
	
	let player = Composite.create({
		composites: [head, torso, rightArm, rightForeArm, leftArm, leftForeArm, rightThigh, rightLeg, leftThigh, leftLeg]
	})
	
	// Labels and dealDamage
	
	// head 
	for(let headCircle in headCircles) {
		headCircle.label = 'head'
		headCircle.dealDamage = false
	}
	// Torso 
	for(torsoCircle of torsoCircles) {
		torsoCircle.label = 'torso'
		torsoCircle.dealDamage = false
	}
	// rightArm 
	for(rightArmCircle of rightArmCircles) {
		rightArmCircle.label = 'arm'
		rightArmCircle.dealDamage = false
	}
	// rightForeArm 
	for(rightForeArmCircle of rightForeArmCircles) {
		rightForeArmCircle.label = 'forearm'
		rightForeArmCircle.dealDamage = true
	}
	// leftArm 
	for(leftArmCircle of leftArmCircles) {
		leftArmCircle.label = 'arm'
		leftArmCircle.dealDamage = false
	}
	// leftForeArm 
	for(leftForeArmCircle of leftForeArmCircles) {
		leftForeArmCircle.label = 'forearm'
		leftForeArmCircle.dealDamage = true
	}
	// rightThigh
	for(rightThighCircle of rightThighCircles) {
		rightThighCircle.label = 'thigh'
		rightThighCircle.dealDamage = false
	}
	// rightLeg 
	for(rightLegCircle of rightLegCircles) {
		rightLegCircle.label = 'leg'
		rightLegCircle.dealDamage = true
	}
	// leftThigh 
	for(leftThighCircle of leftThighCircles) {
		leftThighCircle.label = 'thigh'
		leftThighCircle.dealDamage = false
	}
	// leftLeg
	for(leftLegCircle of leftLegCircles) {
		leftLegCircle.label = 'leg'
		leftLegCircle.dealDamage = true
  }
  for(circle of Composite.allBodies(player)) circle.playerId = playerId
  this.head = headCircles[0]
  this.pelvis = torsoCircles[torsoCircles.length - 2]
  this.PlayerComposite = player
  this.force = radius / 5500
  World.add(Matter.engine.world, player)
}

Player.prototype.createMatterPlayerCircles2 = function(Matter, initialX, initialY, radius) {
  let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    world = Matter.engine.world
  let options = {collisionFilter: { group: Body.nextGroup(true) }}
  let playerId = this.id
	let rotateAngle;
	let sensorCircle;
	let sensorCircleOptions = {isSensor: true}
	let sensorCircleInitialConstraint;
	let sensorCircleConstraint2;
	let sensorCircleConstraint3;
	let sensorCircles = []
  let sensorConstraints = []
	///////////////////////////////////////////////////////////////////////////////
	// Torso
	let torsoCircles = []
	let torsoConstraints = []
	let x = initialX
	let y = initialY
	// Generate torsoCircles
	for(let i = 0; i < 5; i++) {
		let circle;
		if(i === 0) circle = Bodies.circle(x, y, radius, options)
		else circle = Bodies.circle(x, y, radius)
		torsoCircles.push(circle)
		y += (radius * 2)
	}
	// Generate torsoConstraints
	for(let i = 0; i < 4; i++) {
		let bodyA = torsoCircles[i]
		let bodyB = torsoCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
			render: {visible: false}
		})
		torsoConstraints.push(constraint)
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		torsoConstraints.push(constraint2)
	}
	let addedConstraint = Constraint.create({
		bodyA: torsoCircles[0],
		bodyB: torsoCircles[1],
		render: {visible: false}
	})
	torsoConstraints.push(addedConstraint)
	let torso = Composite.create({
		bodies: torsoCircles,
		constraints: torsoConstraints
	})
	torso.label = 'torso'
	///////////////////////////////////////////////////////////////////////////////
  
  
	///////////////////////////////////////////////////////////////////////////////
	// Right Arm
	let rightArmCircles = []
	let rightArmConstraints = []
	x = initialX + (2 * radius)
	y = initialY + (2 * radius)
	// Generate rightArmCircles 
	for(let i = 0; i < 2; i++) {
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, Math.PI / 2)
		rightArmCircles.push(circle)
		x += (radius * 2)
	}
	// Generate rightArmConstraints 
	let torsoRightArmConstraint = Constraint.create({
		bodyA: torsoCircles[1],
		bodyB: rightArmCircles[0],
		pointA: {x: radius, y: 0},
		pointB: {x: -radius, y: 0},
		render: {visible: false}
	})
	rightArmConstraints.push(torsoRightArmConstraint);
	for(let i = 0; i < 1; i++) {
		let bodyA = rightArmCircles[i]
		let bodyB = rightArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: radius, y: 0},
			pointB: {x: -radius, y: 0},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightArmConstraints.push(constraint)
		rightArmConstraints.push(constraint2)
	}
	let rightArm = Composite.create({
		bodies: rightArmCircles,
		constraints: rightArmConstraints
	})
	rightArm.label = 'rightArm';


	sensorCircle = Bodies.circle(initialX, initialY + (2 * radius), radius, sensorCircleOptions)
	Body.rotate(sensorCircle, Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: torsoCircles[0],
		bodyB: sensorCircle,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightArmCircles[0],
		pointA: {x: radius, y: 0},
		pointB: {x: -radius, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightArmCircles[0],
		render: {visible: false}
	})
	rightArmCircles.unshift(sensorCircle)
	rightArmConstraints.unshift(sensorCircleInitialConstraint)
	rightArmConstraints.unshift(sensorCircleConstraint2)
	rightArmConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Right Forearm
	let rightForeArmCircles = []
	let rightForeArmConstraints = []
	x = initialX + (4 * radius)
	y = initialY + (2 * radius)
	let angle = 90
	let theta = angle * Math.PI / 180
	let yDiff = 2 * radius * Math.cos(theta)
	let xDiff = 2 * radius * Math.sin(theta)
	rotateAngle = Math.atan(yDiff / xDiff)
	// Generate rightForeArmCircles
	for(let i = 0; i < 2; i++) {
		x += xDiff
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle + Math.PI / 2)
		rightForeArmCircles.push(circle)
	}
	// Generate rightForeArmConstraints
	let initialConstraint = Constraint.create({
		bodyA: rightArmCircles[rightArmCircles.length - 1],
		bodyB: rightForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	rightForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = rightForeArmCircles[i]
		let bodyB = rightForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightForeArmConstraints.push(constraint)
		rightForeArmConstraints.push(constraint2)
	}
	let rightForeArm = Composite.create({
		bodies: rightForeArmCircles,
		constraints: rightForeArmConstraints
	})
	rightForeArm.label = 'rightForeArm'
	
	rightArmCircles[2].render.visible = false
	sensorCircle = Bodies.circle(initialX + (4 * radius) , initialY + (2 * radius), radius, sensorCircleOptions)
	Body.rotate(sensorCircle, Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: rightArmCircles[rightArmCircles.length - 2],
		bodyB: sensorCircle,
		pointA: {x: radius, y: 0},
		pointB: {x: -radius, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightForeArmCircles[0],
		render: {visible: false}
	})
	rightForeArmCircles.unshift(sensorCircle)
	rightForeArmConstraints.unshift(sensorCircleInitialConstraint)
	rightForeArmConstraints.unshift(sensorCircleConstraint2)
	rightForeArmConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	


	///////////////////////////////////////////////////////////////////////////////
	// Left Arm
	let leftArmCircles = []
	let leftArmConstraints = []
	x = initialX - (2 * radius)
	y = initialY + (2 * radius)
	// Generate leftArmCircles
	for(let i = 0; i < 2; i++) {
		let circle = Bodies.circle(x, y, radius)
		leftArmCircles.push(circle)
		Body.rotate(circle, -Math.PI / 2)
		x -= (radius * 2)
	}
	// Generate leftArmConstraints 
	let torsoLeftArmConstraint = Constraint.create({
		bodyA: torsoCircles[1],
		bodyB: leftArmCircles[0],
		pointA: {x: -radius, y: 0},
		pointB: {x: radius, y: 0},
		render: {visible: false}
	})
	leftArmConstraints.push(torsoLeftArmConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftArmCircles[i]
		let bodyB = leftArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: -radius, y: 0},
			pointB: {x: radius, y: 0},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftArmConstraints.push(constraint)
		leftArmConstraints.push(constraint2)
	}
	let leftArm = Composite.create({
		bodies: leftArmCircles,
		constraints: leftArmConstraints
	})
	leftArm.label = 'leftArm'
	
	
	torsoCircles[1].render.visible = false
	rightArmCircles[0].render.visible = false
	sensorCircle = Bodies.circle(initialX, initialY + (2 * radius), radius, sensorCircleOptions)
	Body.rotate(sensorCircle, -Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: torsoCircles[0],
		bodyB: sensorCircle,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftArmCircles[0],
		pointA: {x: -radius, y: 0},
		pointB: {x: radius, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftArmCircles[0],
		render: {visible: false}
	})
	leftArmCircles.unshift(sensorCircle)
	leftArmConstraints.unshift(sensorCircleInitialConstraint)
	leftArmConstraints.unshift(sensorCircleConstraint2)
	leftArmConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Left Forearm 
	let leftForeArmCircles = []
	let leftForeArmConstraints = []
	x = initialX - (4 * radius)
	y = initialY + (2 * radius)
	angle = 90
	theta = angle * Math.PI / 180
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = - 2 * radius * Math.sin(theta)
	rotateAngle = Math.atan(yDiff / xDiff)
	// Generate leftForeArmCircles
	for(let i = 0; i < 2; i++) {
		x += xDiff
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle - Math.PI / 2)
		leftForeArmCircles.push(circle)
	}
	// Generate leftForeArmConstraints
	initialConstraint = Constraint.create({
		bodyA: leftArmCircles[leftArmCircles.length - 1],
		bodyB: leftForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	leftForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftForeArmCircles[i]
		let bodyB = leftForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint)
		leftForeArmConstraints.push(constraint2)
	}
	let leftForeArm = Composite.create({
		bodies: leftForeArmCircles,
		constraints: leftForeArmConstraints
	})
	leftForeArm.label = 'leftForeArm'
	
	
	leftArmCircles[2].render.visible = false
	sensorCircle = Bodies.circle(initialX - (4 * radius), initialY + (2 * radius), radius, sensorCircleOptions)
	Body.rotate(sensorCircle, -Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: leftArmCircles[leftArmCircles.length - 2],
		bodyB: sensorCircle,
		pointA: {x: -radius, y: 0},
		pointB: {x: radius, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftForeArmCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftForeArmCircles[0],
		render: {visible: false}
	})
	leftForeArmCircles.unshift(sensorCircle)
	leftForeArmConstraints.unshift(sensorCircleInitialConstraint)
	leftForeArmConstraints.unshift(sensorCircleConstraint2)
	leftForeArmConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	let initialConstraint2;
	// Right Thigh 
	let rightThighCircles = []
	let rightThighConstraints = []
	x = initialX 
	y = initialY + (8 * radius)
	xDiff = radius 
	yDiff = Math.pow((3 * radius * radius), 0.5)
	rotateAngle = Math.atan(yDiff / xDiff)
	// Generate rightThighCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff 
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle - Math.PI / 2)
		rightThighCircles.push(circle)
	}
	initialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: rightThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: rightThighCircles[0],
		render: {visible: false}
	})
	rightThighConstraints.push(initialConstraint)
	rightThighConstraints.push(initialConstraint2)
	// Generate rightThighConstraints
	for(let i = 0; i < 2; i++) {
		let bodyA = rightThighCircles[i]
		let bodyB = rightThighCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightThighConstraints.push(constraint)
		rightThighConstraints.push(constraint2)
	}
	let rightThigh = Composite.create({
		bodies: rightThighCircles,
		constraints: rightThighConstraints
	})
	rightThigh.label = 'rightThigh'
	
	torsoCircles[torsoCircles.length - 1].render.visible = false
	sensorCircle = Bodies.circle(initialX, initialY + (8 * radius), radius, sensorCircleOptions)
	// Body.rotate(sensorCircle, rotateAngle - Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 2],
		bodyB: sensorCircle,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightThighCircles[0],
		render: {visible: false}
	})
	rightThighCircles.unshift(sensorCircle)
	rightThighConstraints.unshift(sensorCircleInitialConstraint)
	rightThighConstraints.unshift(sensorCircleConstraint2)
	rightThighConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Right Leg 
	let rightLegCircles = []
	let rightLegConstraints = []
	angle = 30
	theta = angle * Math.PI / 180
	let oldXDiff = xDiff
	let oldYDiff = yDiff
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = 2 * radius * Math.sin(theta)
	let oldRotateAngle = rotateAngle - Math.PI / 2
	rotateAngle = Math.atan(yDiff / xDiff)
	let startX = x 
	let startY = y
	// Generate rightLegCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle - Math.PI / 2)
		rightLegCircles.push(circle)
	}
	// Generate rightLegConstraints 
	initialConstraint = Constraint.create({
		bodyA: rightThighCircles[rightThighCircles.length - 1],
		bodyB: rightLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: rightThighCircles[rightThighCircles.length - 1],
		bodyB: rightLegCircles[0],
		render: {visible: false}
	})
	rightLegConstraints.push(initialConstraint)
	rightLegConstraints.push(initialConstraint2)
	for(let i = 0; i < 2; i++) {
		let bodyA = rightLegCircles[i]
		let bodyB = rightLegCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightLegConstraints.push(constraint)
		rightLegConstraints.push(constraint2)
	}
	let rightLeg = Composite.create({
		bodies: rightLegCircles,
		constraints: rightLegConstraints
	})
	rightLeg.label = 'rightLeg'	
	
	
	
	rightThighCircles[rightThighCircles.length - 1].render.visible = false
	sensorCircle = Bodies.circle(startX, startY, radius, sensorCircleOptions)
	Body.rotate(sensorCircle, rotateAngle - Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: rightThighCircles[rightThighCircles.length - 2],
		bodyB: sensorCircle,
			pointA: {x: oldXDiff / 2, y: oldYDiff / 2},
			pointB: {x: -oldXDiff / 2, y: -oldYDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightLegCircles[0],
		render: {visible: false}
	})
	rightLegCircles.unshift(sensorCircle)
	rightLegConstraints.unshift(sensorCircleInitialConstraint)
	rightLegConstraints.unshift(sensorCircleConstraint2)
	rightLegConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Left Thigh 
	let leftThighCircles = []
	let leftThighConstraints = []
	x = initialX 
	y = initialY + (8 * radius)
	xDiff = -radius 
	yDiff = Math.pow((3 * radius * radius), 0.5)
	rotateAngle = Math.atan(yDiff / xDiff)
	// Generate rightThighCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff 
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle + Math.PI  / 2)
		leftThighCircles.push(circle)
	}
	initialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: leftThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 1],
		bodyB: leftThighCircles[0],
		render: {visible: false}
	})
	leftThighConstraints.push(initialConstraint)
	leftThighConstraints.push(initialConstraint2)
	// Generate leftThighConstraints
	for(let i = 0; i < 2; i++) {
		let bodyA = leftThighCircles[i]
		let bodyB = leftThighCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftThighConstraints.push(constraint)
		leftThighConstraints.push(constraint2)
	}
	let leftThigh = Composite.create({
		bodies: leftThighCircles,
		constraints: leftThighConstraints
	})
	leftThigh.label = 'leftThigh'
	
	
	torsoCircles[torsoCircles.length - 1].render.visible = false
	rightThighCircles[0].render.visible = false
	sensorCircle = Bodies.circle(initialX, initialY + (8 * radius), radius, sensorCircleOptions)
	// Body.rotate(sensorCircle, rotateAngle - Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: torsoCircles[torsoCircles.length - 2],
		bodyB: sensorCircle,
			pointA: {x: 0, y: radius},
			pointB: {x: 0, y: -radius},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftThighCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftThighCircles[0],
		render: {visible: false}
	})
	leftThighCircles.unshift(sensorCircle)
	leftThighConstraints.unshift(sensorCircleInitialConstraint)
	leftThighConstraints.unshift(sensorCircleConstraint2)
	leftThighConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Left Leg 
	let leftLegCircles = []
	let leftLegConstraints = []
	angle = 30
	theta = angle * Math.PI / 180
	startX = x 
	startY = y
	oldXDiff = xDiff
	oldYDiff = yDiff
	yDiff = 2 * radius * Math.cos(theta)
	xDiff = - 2 * radius * Math.sin(theta)
	oldRotateAngle = rotateAngle + Math.PI / 2
	rotateAngle = Math.atan(yDiff / xDiff)
	// Generate rightLegCircles
	for(let i = 0; i < 3; i++) {
		x += xDiff 
		y += yDiff
		let circle = Bodies.circle(x, y, radius)
		Body.rotate(circle, rotateAngle + Math.PI / 2)
		leftLegCircles.push(circle)
	}
	// Generate rightLegConstraints 
	initialConstraint = Constraint.create({
		bodyA: leftThighCircles[leftThighCircles.length - 1],
		bodyB: leftLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	initialConstraint2 = Constraint.create({
		bodyA: leftThighCircles[leftThighCircles.length - 1],
		bodyB: leftLegCircles[0],
		render: {visible: false}
	})
	leftLegConstraints.push(initialConstraint)
	leftLegConstraints.push(initialConstraint2)
	for(let i = 0; i < 2; i++) {
		let bodyA = leftLegCircles[i]
		let bodyB = leftLegCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff / 2, y: yDiff / 2},
			pointB: {x: -xDiff / 2, y: -yDiff / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftLegConstraints.push(constraint)
		leftLegConstraints.push(constraint2)
	}
	let leftLeg = Composite.create({
		bodies: leftLegCircles,
		constraints: leftLegConstraints
	})
	leftLeg.label = 'leftLeg'
	
	
	leftThighCircles[leftThighCircles.length - 1].render.visible = false
	sensorCircle = Bodies.circle(startX, startY, radius, sensorCircleOptions)
	Body.rotate(sensorCircle, rotateAngle + Math.PI / 2)
	sensorCircleInitialConstraint = Constraint.create({
		bodyA: leftThighCircles[leftThighCircles.length - 2],
		bodyB: sensorCircle,
			pointA: {x: oldXDiff / 2, y: oldYDiff / 2},
			pointB: {x: -oldXDiff / 2, y: -oldYDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftLegCircles[0],
		pointA: {x: xDiff / 2, y: yDiff / 2},
		pointB: {x: -xDiff / 2, y: -yDiff / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftLegCircles[0],
		render: {visible: false}
	})
	leftLegCircles.unshift(sensorCircle)
	leftLegConstraints.unshift(sensorCircleInitialConstraint)
	leftLegConstraints.unshift(sensorCircleConstraint2)
	leftLegConstraints.unshift(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Head
	x = initialX
	y = initialY - (2 * radius) 
	radius *= 2.5
	let headCircles = [Bodies.circle(x, y, radius, options)]
	let headConstraint = Constraint.create({
		bodyA: headCircles[0],
		bodyB: torsoCircles[0],
		pointA: {x: 0, y: radius},
		pointB: {x: 0, y: 0},
		render: {visible: false}
	})
	let headConstraint2 = Constraint.create({
		bodyA: headCircles[0],
		bodyB: torsoCircles[0],
		pointA: {x: 0, y: 0},
		pointB: {x: 0, y: -10},
		render: {visible: false}
	})
	let head = Composite.create({
		bodies: headCircles,
		constraints: [headConstraint, headConstraint2]
	})
	headCircles[0].label = 'head'
	let player = Composite.create({
		composites: [head, torso, rightArm, rightForeArm, leftArm, leftForeArm, rightThigh, rightLeg, leftThigh, leftLeg]
	})
  // World.add(world, player)
	// Labels and dealDamage
	// head 
	for(let headCircle in headCircles) {
		headCircle.label = 'head'
		headCircle.dealDamage = false
	}
	// Torso 
	for(torsoCircle of torsoCircles) {
		torsoCircle.label = 'torso'
		torsoCircle.dealDamage = false
	}
	// rightArm 
	for(rightArmCircle of rightArmCircles) {
		rightArmCircle.label = 'arm'
		rightArmCircle.dealDamage = false
	}
	// rightForeArm 
	for(rightForeArmCircle of rightForeArmCircles) {
		rightForeArmCircle.label = 'forearm'
		rightForeArmCircle.dealDamage = true
	}
	// leftArm 
	for(leftArmCircle of leftArmCircles) {
		leftArmCircle.label = 'arm'
		leftArmCircle.dealDamage = false
	}
	// leftForeArm 
	for(leftForeArmCircle of leftForeArmCircles) {
		leftForeArmCircle.label = 'forearm'
		leftForeArmCircle.dealDamage = true
	}
	// rightThigh
	for(rightThighCircle of rightThighCircles) {
		rightThighCircle.label = 'thigh'
		rightThighCircle.dealDamage = false
	}
	// rightLeg 
	for(rightLegCircle of rightLegCircles) {
		rightLegCircle.label = 'leg'
		rightLegCircle.dealDamage = true
	}
	// leftThigh 
	for(leftThighCircle of leftThighCircles) {
		leftThighCircle.label = 'thigh'
		leftThighCircle.dealDamage = false
	}
	// leftLeg
	for(leftLegCircle of leftLegCircles) {
		leftLegCircle.label = 'leg'
		leftLegCircle.dealDamage = true
	}
	
	// End Circles
	rightForeArmCircles[rightForeArmCircles.length - 1].isEnd = true
	leftForeArmCircles[leftForeArmCircles.length - 1].isEnd = true
	rightLegCircles[rightLegCircles.length - 1].isEnd = true
  leftLegCircles[leftLegCircles.length - 1].isEnd = true
  // Armbands
  rightForeArmCircles[rightForeArmCircles.length - 1].isArmBand = true
  rightForeArmCircles[rightForeArmCircles.length - 2].isArmBand = true
  leftForeArmCircles[leftForeArmCircles.length - 1].isArmBand = true
  leftForeArmCircles[leftForeArmCircles.length - 2].isArmBand = true
  // Belt
  torsoCircles[torsoCircles.length - 2].beltStart = true

  for(circle of Composite.allBodies(player)) {
    circle.playerId = playerId
    circle.hitInfo = null
  }
  this.head = headCircles[0]
  this.pelvis = torsoCircles[torsoCircles.length - 2]
  this.PlayerComposite = player
  this.force = radius / 5500
  World.add(Matter.engine.world, player)
}

Player.prototype.movePlayer = function(left, up, right, down, Matter) {
  let head = this.head
  let Body = Matter.Body 
  let force = this.force
  if(left) Body.applyForce(head, head.position, { x: - force, y: 0 })
  if(up) Body.applyForce(head, head.position, { x: 0, y: - force })
  if(right) Body.applyForce(head, head.position, { x: force, y: 0 })
  if(down) Body.applyForce(head, head.position, { x: 0, y: force })
}

Player.prototype.genLeftLeg = function(x, y, triangleHeight, angle, width, legLength) {
	let p1 = {x:x, y: y}
	let p2= {x: x + (width / 2), y: p1.y + triangleHeight}
	let p3 = {x: x - (legLength * Math.cos(angle)), y: y  + triangleHeight + (legLength * Math.sin(angle))}
	let p4 = {x: p3.x - (width * Math.cos(angle)), y: p3.y - (width * Math.sin(angle))}
	return {
		vertices: [p1, p2, p3, p4, p1],
		midX: (p4.x + p2.x) / 2,
		midY: (p1.y + p3.y) / 2
	}
}

Player.prototype.genRightLeg = function(x, y, triangleHeight, angle, width, legLength) {
	let p1 = {x:x, y: y}
	let p2= {x: x - (width / 2), y: p1.y + triangleHeight}
	let p3 = {x: x + (legLength * Math.cos(angle)), y: y  + triangleHeight + (legLength * Math.sin(angle))}
	let p4 = {x: p3.x + (width * Math.cos(angle)), y: p3.y - (width * Math.sin(angle))}
	return {
		vertices: [p1, p2, p3, p4, p1],
		midX: (p4.x + p2.x) / 2,
		midY: (p1.y + p3.y) / 2
	}
}

Player.prototype.blowUp = function(Matter, bodiesToMove) {
  this.isBlownUp = true
  let force = 0.005
  let Composite = Matter.Composite
  let Body = Matter.Body
  for(composite of Composite.allComposites(this.PlayerComposite)) composite.constraints = []
  for(body of Composite.allBodies(this.PlayerComposite)) {
    let randomDirection = Math.floor(Math.random() * 360)
    let randomAngle = randomDirection * Math.PI / 180
    let x = force * Math.cos(randomAngle)
    let y = force * Math.sin(randomAngle)
    bodiesToMove.push({ body: body, force: { x: x, y: y } })
  }
}

Player.prototype.increaseSkillPoints = function() {
  this.skillPoints += 1
}

Player.prototype.decreaseSkillPoints = function() {
  this.skillPoints -= 1
  this.skillPoints = this.skillPoints < 0 ? 0: this.skillPoints
}

Player.prototype.updatePlayerSkillPoints = function(skillPoint) {
  this.skillPointValues[skillPoint].val += this.skillPointValues[skillPoint].updateAmount
}

// Returns True / False for if player should move belt group
Player.prototype.shouldIncreaseBelt = function() {
  let maxBeltNumber = c.gameInfo.belts.length - 1
  if(this.beltNumber >= maxBeltNumber) return false
  let killTarget = c.gameInfo.belts[this.beltNumber + 1].kills
  return this.killStreak >= killTarget
}

Player.prototype.increaseBelt = function() {
  this.beltNumber += 1
  this.beltColour = c.gameInfo.belts[this.beltNumber].colour
  this.beltProgress = 0
}

Player.prototype.updateProgress = function() {
  let increastBy = c.gameInfo.belts[this.beltNumber].increaseNum
  this.beltProgress += increastBy
}


module.exports = Player