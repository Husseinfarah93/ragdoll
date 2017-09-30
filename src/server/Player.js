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
  this.isDead = false
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

Player.prototype.movePlayer = function(left, up, right, down, Matter) {
  let head = this.head
  let Body = Matter.Body 
  let force = 0.001
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

module.exports = Player