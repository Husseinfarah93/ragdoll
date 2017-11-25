let c = require('../../config.json')
let randColour = require('./helper.js').randColour

function Player(name, id, characterType, skinGroupName, skinName, isAI) {
  // TEST
  this.name = name ? name : 'PLAYER'
  this.id = id
  this.characterType = characterType
  this.isAI = isAI
  this.initialHealth = c.playerTypes[characterType].initialHealth
  this.health = this.maxHealth = this.initialHealth
  this.killStreak = 0
  this.beltNumber = 0
  this.beltColour = c.gameInfo.belts[0].colour
  this.beltProgress = 0
  this.skillPoints = 0
  this.force = this.initialForce = (25 / 5500) * 1.35
  this.initialSkillPointValues = {
    maxHealth: {initialVal: 200, curVal: 200, maxVal: 400, colour: '#FFBC40', text: 'Max Health', name: 'maxHealth', updateAmount: 20},
    maxSpeed: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#F16F61', text: 'Max Speed', name: 'maxSpeed', updateAmount: 0.1},
    damageDealt: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#4A89AA', text: 'Damage Dealt', name: 'damageDealt', updateAmount: 0.1},
    healthRegen: {initialVal: 30000, curVal: 30000, maxVal: 20000, colour: '#18C29C', text: 'Health Regen', name: 'healthRegen', updateAmount: -1000}
  }
  this.skillPointValues = {
    maxHealth: {initialVal: 200, curVal: 200, maxVal: 400, colour: '#FFBC40', text: 'Max Health', name: 'maxHealth', updateAmount: 20},
    maxSpeed: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#F16F61', text: 'Max Speed', name: 'maxSpeed', updateAmount: 0.1},
    damageDealt: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#4A89AA', text: 'Damage Dealt', name: 'damageDealt', updateAmount: 0.1},
    healthRegen: {initialVal: 30000, curVal: 30000, maxVal: 20000, colour: '#18C29C', text: 'Health Regen', name: 'healthRegen', updateAmount: -1000}
  }
  this.isDead = false
  this.isBlownUp = false
  this.colour = randColour()
  this.skinCategory = skinGroupName
  this.skinName = skinName
  this.healthRegenInterval = null
  this.startHealthRegenInterval()
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
  let offBy = 1


  let torsoStiffness = 0.7
  let armStiffness = 0.1
  let foreArmStiffness = 0.1
  let thighStifness = 0.5
  let legStiffness = 0.5
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
			pointA: {x: 0, y: radius * offBy},
			pointB: {x: 0, y: -radius * offBy},
			render: {visible: false}
		})
		torsoConstraints.push(constraint)
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		torsoConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: torsoStiffness,
			render: {visible: false}
		})
		torsoConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: torsoStiffness,
			render: {visible: false}
		})
		torsoConstraints.push(constraint4)
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
		pointA: {x: radius * offBy, y: 0},
		pointB: {x: -radius * offBy, y: 0},
		render: {visible: false}
	})
	rightArmConstraints.push(torsoRightArmConstraint);
	for(let i = 0; i < 1; i++) {
		let bodyA = rightArmCircles[i]
		let bodyB = rightArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: radius * offBy, y: 0},
			pointB: {x: -radius * offBy, y: 0},
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
			pointA: {x: 0, y: radius * offBy},
			pointB: {x: 0, y: -radius * offBy},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightArmCircles[0],
		pointA: {x: radius * offBy, y: 0},
		pointB: {x: -radius * offBy, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightArmCircles[0],
		render: {visible: false}
	})
	rightArmCircles.unshift(sensorCircle)
	rightArmConstraints.push(sensorCircleInitialConstraint)
	rightArmConstraints.push(sensorCircleConstraint2)
	rightArmConstraints.push(sensorCircleConstraint3)


  for(let i = 0; i < rightArmCircles.length - 1; i++) {
    let bodyA = rightArmCircles[i]
    let bodyB = rightArmCircles[i+1]
    let constraint3 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: -radius},
			pointB:	{x: 0, y: -radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		rightArmConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: radius},
			pointB:	{x: 0, y: radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		rightArmConstraints.push(constraint4)
  }


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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	rightForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = rightForeArmCircles[i]
		let bodyB = rightForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
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
		pointA: {x: radius * offBy, y: 0},
		pointB: {x: -radius * offBy, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightForeArmCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightForeArmCircles[0],
		render: {visible: false}
	})
	rightForeArmCircles.unshift(sensorCircle)
	rightForeArmConstraints.push(sensorCircleInitialConstraint)
	rightForeArmConstraints.push(sensorCircleConstraint2)
	rightForeArmConstraints.push(sensorCircleConstraint3)

  for(let i = 0; i < rightForeArmCircles.length - 1; i++) {
    let bodyA = rightForeArmCircles[i]
    let bodyB = rightForeArmCircles[i+1]
    let constraint3 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: -radius},
			pointB:	{x: 0, y: -radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		rightForeArmConstraints.push(constraint3)
		let constraint4 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: radius},
			pointB:	{x: 0, y: radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		rightForeArmConstraints.push(constraint4)
  }
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
		pointA: {x: -radius * offBy, y: 0},
		pointB: {x: radius * offBy, y: 0},
		render: {visible: false}
	})
	leftArmConstraints.push(torsoLeftArmConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftArmCircles[i]
		let bodyB = leftArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: -radius * offBy, y: 0},
			pointB: {x: radius * offBy, y: 0},
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
			pointA: {x: 0, y: radius * offBy},
			pointB: {x: 0, y: -radius * offBy},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftArmCircles[0],
		pointA: {x: -radius * offBy, y: 0},
		pointB: {x: radius * offBy, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftArmCircles[0],
		render: {visible: false}
	})
	leftArmCircles.unshift(sensorCircle)
	leftArmConstraints.push(sensorCircleInitialConstraint)
	leftArmConstraints.push(sensorCircleConstraint2)
	leftArmConstraints.push(sensorCircleConstraint3)



  for(let i = 0; i < leftArmCircles.length - 1; i++) {
    let bodyA = leftArmCircles[i]
    let bodyB = leftArmCircles[i+1]
    let constraint3 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: -radius},
			pointB:	{x: 0, y: -radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		leftArmConstraints.push(constraint3)
		let constraint4 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: radius},
			pointB:	{x: 0, y: radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		leftArmConstraints.push(constraint4)
  }
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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	leftForeArmConstraints.push(initialConstraint)
	for(let i = 0; i < 1; i++) {
		let bodyA = leftForeArmCircles[i]
		let bodyB = leftForeArmCircles[i + 1]
		let constraint = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint)
		leftForeArmConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: foreArmStiffness,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: foreArmStiffness,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint4)
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
		pointA: {x: -radius * offBy, y: 0},
		pointB: {x: radius * offBy, y: 0},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftForeArmCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftForeArmCircles[0],
		render: {visible: false}
	})
	leftForeArmCircles.unshift(sensorCircle)
	leftForeArmConstraints.push(sensorCircleInitialConstraint)
	leftForeArmConstraints.push(sensorCircleConstraint2)
	leftForeArmConstraints.push(sensorCircleConstraint3)


  for(let i = 0; i < leftForeArmCircles.length - 1; i++) {
    let bodyA = leftForeArmCircles[i]
    let bodyB = leftForeArmCircles[i+1]
    let constraint3 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: -radius},
			pointB:	{x: 0, y: -radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint3)
		let constraint4 = Constraint.create({
      bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: 0, y: radius},
			pointB:	{x: 0, y: radius},
			stiffness: armStiffness,
			render: {visible: false}
		})
		leftForeArmConstraints.push(constraint4)
  }
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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
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
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightThighConstraints.push(constraint)
		rightThighConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: thighStifness,
			render: {visible: false}
		})
		rightThighConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: thighStifness,
			render: {visible: false}
		})
		rightThighConstraints.push(constraint4)
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
			pointA: {x: 0, y: radius * offBy},
			pointB: {x: 0, y: -radius * offBy},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightThighCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightThighCircles[0],
		render: {visible: false}
	})
	rightThighCircles.unshift(sensorCircle)
	rightThighConstraints.push(sensorCircleInitialConstraint)
	rightThighConstraints.push(sensorCircleConstraint2)
	rightThighConstraints.push(sensorCircleConstraint3)
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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
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
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		rightLegConstraints.push(constraint)
		rightLegConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: legStiffness,
			render: {visible: false}
		})
		rightLegConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: legStiffness,
			render: {visible: false}
		})
		rightLegConstraints.push(constraint4)
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
			pointA: {x: oldXDiff * offBy / 2, y: oldYDiff * offBy / 2},
			pointB: {x: -oldXDiff * offBy / 2, y: -oldYDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightLegCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: rightLegCircles[0],
		render: {visible: false}
	})
	rightLegCircles.unshift(sensorCircle)
	rightLegConstraints.push(sensorCircleInitialConstraint)
	rightLegConstraints.push(sensorCircleConstraint2)
	rightLegConstraints.push(sensorCircleConstraint3)
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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
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
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftThighConstraints.push(constraint)
		leftThighConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: thighStifness,
			render: {visible: false}
		})
		leftThighConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: thighStifness,
			render: {visible: false}
		})
		leftThighConstraints.push(constraint4)
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
			pointA: {x: 0, y: radius * offBy},
			pointB: {x: 0, y: -radius * offBy},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftThighCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftThighCircles[0],
		render: {visible: false}
	})
	leftThighCircles.unshift(sensorCircle)
	leftThighConstraints.push(sensorCircleInitialConstraint)
	leftThighConstraints.push(sensorCircleConstraint2)
	leftThighConstraints.push(sensorCircleConstraint3)
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
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
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
			pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
			pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
			render: {visible: false}
		})
		let constraint2 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			render: {visible: false}
		})
		leftLegConstraints.push(constraint)
		leftLegConstraints.push(constraint2)
    let constraint3 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: radius, y: 0},
			pointB:	{x: radius, y: 0},
			stiffness: legStiffness,
			render: {visible: false}
		})
		leftLegConstraints.push(constraint3)
		let constraint4 = Constraint.create({
			bodyA: bodyA,
			bodyB: bodyB,
			pointA:	{x: -radius, y: 0},
			pointB:	{x: -radius, y: 0},
			stiffness: legStiffness,
			render: {visible: false}
		})
		leftLegConstraints.push(constraint4)
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
			pointA: {x: oldXDiff * offBy / 2, y: oldYDiff * offBy / 2},
			pointB: {x: -oldXDiff * offBy / 2, y: -oldYDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint2 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftLegCircles[0],
		pointA: {x: xDiff * offBy / 2, y: yDiff * offBy / 2},
		pointB: {x: -xDiff * offBy / 2, y: -yDiff * offBy / 2},
		render: {visible: false}
	})
	sensorCircleConstraint3 = Constraint.create({
		bodyA: sensorCircle,
		bodyB: leftLegCircles[0],
		render: {visible: false}
	})
	leftLegCircles.unshift(sensorCircle)
	leftLegConstraints.push(sensorCircleInitialConstraint)
	leftLegConstraints.push(sensorCircleConstraint2)
	leftLegConstraints.push(sensorCircleConstraint3)
	///////////////////////////////////////////////////////////////////////////////
  // BELT
  let torsoElem = torsoCircles[torsoCircles.length - 1]
  let beltX = beltOriginalX = torsoElem.position.x
  let beltY = beltOriginalY = torsoElem.position.y
  let beltRadius = 5
  let rightBeltBodies = []
  let leftBeltBodies = []
  let rightBeltConstraints = []
  let leftBeltConstraints = []
  let circleNum = 4
  let beltAngle = 70
  let beltTheta = beltAngle * Math.PI / 180
  let beltXDiff = 2 * beltRadius * Math.cos(beltTheta)
  let beltYDiff = 2 * beltRadius * Math.sin(beltTheta)
  let beltOptions = {
    collisionFilter: {
  		category: 0x002,
  		mask: 0x002
  	},
  }
  let beltOptions2 = {isSensor: true}
  let connectingCircle = Bodies.circle(beltX, beltY, beltRadius, beltOptions2)
  let beltRectangle = Bodies.rectangle(beltX, beltY, radius * 2, radius, beltOptions2)
  rightBeltBodies.push(connectingCircle)
  leftBeltBodies.push(connectingCircle)
  beltRectangle.isBelt = true
  beltRectangle.isRectangle = true

  // Right Circles
  for(let i = 0; i < circleNum; i++) {
    beltX += beltXDiff
    beltY += beltYDiff
    let newCircle = Bodies.circle(beltX, beltY, beltRadius, beltOptions)
    newCircle.isBelt = true
    rightBeltBodies.push(newCircle)
  }
  beltX = beltOriginalX
  beltY = beltOriginalY
  // Left Circles
  for(let i = 0; i < circleNum; i++) {
    beltX -= beltXDiff
    beltY += beltYDiff
    let newCircle = Bodies.circle(beltX, beltY, beltRadius, beltOptions)
    newCircle.isBelt = true
    leftBeltBodies.push(newCircle)
  }
  beltX = beltOriginalX
  beltY = beltOriginalY
  // Constraints
  for(let i = 0; i < circleNum; i++) {
    let bodyRightA = rightBeltBodies[i]
    let bodyRightB = rightBeltBodies[i + 1]

    let bodyLeftA = leftBeltBodies[i]
    let bodyLeftB = leftBeltBodies[i + 1]
    let constraintRight = Constraint.create({
      bodyA: bodyRightA,
      bodyB: bodyRightB,
      pointA: { x: beltXDiff * offBy / 2, y: beltYDiff * offBy / 2},
      pointB: { x: -beltXDiff * offBy / 2, y: -beltYDiff * offBy / 2},
    })
    let constraintLeft = Constraint.create({
      bodyA: bodyLeftA,
      bodyB: bodyLeftB,
      pointA: { x: -beltXDiff * offBy / 2, y: beltYDiff * offBy / 2},
      pointB: { x: beltXDiff * offBy / 2, y: -beltYDiff * offBy / 2},
    })

    rightBeltConstraints.push(constraintRight)
    leftBeltConstraints.push(constraintLeft)
  }
  // Extra Constraints
  // Rectangle Connecting Circle Constraint
  let beltRectangleConnectingConstraint = Constraint.create({
    bodyA: beltRectangle,
    bodyB: connectingCircle
  })
  // Rectangle Torso Constraints
  let leftBeltTorsoConstraint = Constraint.create({
    bodyA: beltRectangle,
    bodyB: torsoElem,
    pointA: {x: -radius * offBy / 2, y: 0},
    pointB: {x: -radius * offBy / 2, y: 0}
  })
  let rightBeltTorsoConstraint = Constraint.create({
    bodyA: beltRectangle,
    bodyB: torsoElem,
    pointA: {x: radius * offBy / 2, y: 0},
    pointB: {x: radius * offBy / 2, y: 0}
  })
  // Composites
  let rightBeltComposite = Composite.create({
    bodies: rightBeltBodies,
    constraints: rightBeltConstraints
  })
  let leftBeltComposite = Composite.create({
    bodies: leftBeltBodies,
    constraints: leftBeltConstraints
  })
  let rectangleBeltComposite = Composite.create({
    bodies: [beltRectangle],
    constraints: [beltRectangleConnectingConstraint, rightBeltTorsoConstraint, leftBeltTorsoConstraint]
  })
  rightBeltComposite.isBelt = true
  leftBeltComposite.isBelt = true
  rectangleBeltComposite.isBelt = true

	///////////////////////////////////////////////////////////////////////////////
	// Head
	x = initialX
	y = initialY - (2 * radius)
	radius *= 2.5
	let headCircles = [Bodies.circle(x, y, radius, options)]
	let headConstraint = Constraint.create({
		bodyA: headCircles[0],
		bodyB: torsoCircles[0],
		pointA: {x: 0, y: radius * offBy},
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
		composites: [
      torso,
      rightArm,
      rightForeArm,
      leftArm,
      leftForeArm,
      rightThigh,
      rightLeg,
      leftThigh,
      leftLeg,
      head,
      rightBeltComposite,
      leftBeltComposite,
      rectangleBeltComposite
    ]
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
		rightArmCircle.label = 'rightArm'
		rightArmCircle.dealDamage = false
	}
	// rightForeArm
	for(rightForeArmCircle of rightForeArmCircles) {
		rightForeArmCircle.label = 'rightForeArm'
		rightForeArmCircle.dealDamage = true
	}
	// leftArm
	for(leftArmCircle of leftArmCircles) {
		leftArmCircle.label = 'leftArm'
		leftArmCircle.dealDamage = false
	}
	// leftForeArm
	for(leftForeArmCircle of leftForeArmCircles) {
		leftForeArmCircle.label = 'leftForeArm'
		leftForeArmCircle.dealDamage = true
	}
	// rightThigh
	for(rightThighCircle of rightThighCircles) {
		rightThighCircle.label = 'rightThigh'
		rightThighCircle.dealDamage = false
	}
	// rightLeg
	for(rightLegCircle of rightLegCircles) {
		rightLegCircle.label = 'rightLeg'
		rightLegCircle.dealDamage = true
	}
	// leftThigh
	for(leftThighCircle of leftThighCircles) {
		leftThighCircle.label = 'leftThigh'
		leftThighCircle.dealDamage = false
	}
	// leftLeg
	for(leftLegCircle of leftLegCircles) {
		leftLegCircle.label = 'leftLeg'
		leftLegCircle.dealDamage = true
	}
  // Left Belt Bodies
  for(leftBeltBody of leftBeltBodies) {
    leftBeltBody.dealDamage = false
  }
  // Right Belt Bodies
  for(rightBeltBody of rightBeltBodies) {
    rightBeltBody.dealDamage = false
  }
  beltRectangle.dealDamage = false
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


  for(circle of Composite.allBodies(player)) {
    circle.playerId = playerId
    circle.hitInfo = null
  }
  this.head = headCircles[0]
  this.pelvis = torsoCircles[torsoCircles.length - 1]
  this.rightArm = rightArmCircles[rightArmCircles.length - 1]
  this.leftArm = leftArmCircles[leftArmCircles.length - 1]
  this.rightLeg = rightLegCircles[rightLegCircles.length - 1]
  this.leftLeg = leftLegCircles[leftLegCircles.length - 1]
  this.PlayerComposite = player
  World.add(Matter.engine.world, player)
}

Player.prototype.addSkin = function(skinCategory, skinName) {
  console.log(skinCategory, skinName)
  return
  let composites = this.PlayerComposite
  let skin = c.gameInfo.skins[skinCategory][skinName]
  for(composite of composites) {
    let label = composite.label
    let layers = skin[label]
    composite.layers = layers
  }
}

Player.prototype.movePlayer = function(left, up, right, down, Matter, bodyPart, extraForce) {
  let head = this.head
  let Body = Matter.Body
  let force = !extraForce ? this.force : this.force * extraForce
  let rightArm = this.rightArm
  let leftArm = this.leftArm
  let rightLeg = this.rightLeg
  let leftLeg = this.leftLeg
  if(bodyPart === 'rightArm') bodyPart = rightArm
  else if(bodyPart === 'leftArm') bodyPart = leftArm
  else if(bodyPart === 'rightLeg') bodyPart = rightLeg
  else if(bodyPart === 'leftLeg') bodyPart = leftLeg
  else bodyPart = head

  if(left) Body.applyForce(bodyPart, bodyPart.position, { x: - force, y: 0 })
  if(up) Body.applyForce(bodyPart, bodyPart.position, { x: 0, y: - force })
  if(right) Body.applyForce(bodyPart, bodyPart.position, { x: force, y: 0 })
  if(down) Body.applyForce(bodyPart, bodyPart.position, { x: 0, y: force })
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
  this.skillPointValues[skillPoint].curVal += this.skillPointValues[skillPoint].updateAmount
  switch(skillPoint) {
    case "maxHealth":
      this.updateMaxHealth();
      break;
    case "healthRegen":
      this.stopHealthRegenInterval();
      this.startHealthRegenInterval();
      break;
    case "maxSpeed":
      this.updateMaxSpeed();
      break;
  }
}

Player.prototype.updateMaxHealth = function() {
  this.maxHealth = this.skillPointValues.maxHealth.curVal
}

Player.prototype.startHealthRegenInterval = function() {
  let health = this.initialHealth
  let regenSeconds = this.skillPointValues.healthRegen.curVal / 1000
  let updateAmount = 1
  let regenRate = (health / regenSeconds) * (updateAmount)
  let ths = this
  this.healthRegenInterval = setInterval(() => {
    ths.health = ths.health + regenRate > ths.maxHealth ? ths.maxHealth : ths.health + regenRate
  }, 1000 * updateAmount)
}

Player.prototype.stopHealthRegenInterval = function() {
  // console.log('STOPPING: ', this.healthRegenInterval)
  if(this.healthRegenInterval) {
    clearInterval(this.healthRegenInterval)
    this.healthRegenInterval = null
  }
}

Player.prototype.updateMaxSpeed = function() {
  this.force = this.initialForce * this.skillPointValues.maxSpeed.curVal
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

Player.prototype.resetPlayer = function() {
  this.health = this.initialHealth
  this.killStreak = 0
  this.beltNumber = 0
  this.beltColour = c.gameInfo.belts[0].colour
  this.beltProgress = 0
  this.skillPoints = 0
  this.force = this.initialForce
  this.skillPointValues = {
    maxHealth: {initialVal: 200, curVal: 200, maxVal: 400, colour: '#FFBC40', text: 'Max Health', name: 'maxHealth', updateAmount: 20},
    maxSpeed: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#F16F61', text: 'Max Speed', name: 'maxSpeed', updateAmount: 0.1},
    damageDealt: {initialVal: 1, curVal: 1, maxVal: 2, colour: '#4A89AA', text: 'Damage Dealt', name: 'damageDealt', updateAmount: 0.1},
    healthRegen: {initialVal: 30000, curVal: 30000, maxVal: 20000, colour: '#18C29C', text: 'Health Regen', name: 'healthRegen', updateAmount: -1000}
  }
  this.isDead = false
  this.isBlownUp = false
  this.startHealthRegenInterval()
}

////////////////////////////// SKILL POINTS /////////////////////////////



module.exports = Player
