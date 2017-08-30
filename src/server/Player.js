let c = require('../../config.json')

function Player(name, id, characterType, skinType) {
  this.name = name 
  this.id = id
  this.characterType = characterType 
  this.skinType = skinType
  this.health = c.playerTypes[characterType].initialHealth
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
    armHeight = 10,
    foreArmWidth = 40, 
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
  let rightForeArm = Bodies.rectangle(rightArm.position.x + armWidth / 2 + foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, rightForeArmOption)
  let leftForeArm = Bodies.rectangle(leftArm.position.x - armWidth / 2 - foreArmWidth / 2, torso.position.y, foreArmWidth, armHeight, leftForeArmOption)
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
      visible: false
    },
    stiffness: 1
  })

  // add all of the bodies to the world
  let player = Composite.create({
    bodies: [head, neck, torso, rightArm, leftArm, rightForeArm, leftForeArm, pelvis, rightThigh, leftThigh, rightCalf, leftCalf],
    constraints: [neckHead, neckTorso, rightShoulder, leftShoulder, rightElbow, leftElbow, pelvisJoint, rightPelvisThigh, leftPelvisThigh, rightKnee, leftKnee]
  })
  World.add(Matter.engine.world, player)
  this.PlayerComposite = player 
  // return player
}

Player.prototype.movePlayer = function(left, up, right, down, Matter) {
  let head = this.head
  let Body = Matter.Body 
  if(left) Body.applyForce(head, head.position, { x: - 0.001, y: 0 })
  if(up) Body.applyForce(head, head.position, { x: 0, y: - 0.001 })
  if(right) Body.applyForce(head, head.position, { x: 0.001, y: 0 })
  if(down) Body.applyForce(head, head.position, { x: 0, y: 0.001 })
}

module.exports = Player
