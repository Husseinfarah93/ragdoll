var Matter = require('matter-js');
// module aliases
var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Constraint = Matter.Constraint,
  Composite = Matter.Composite,
  MouseConstraint = Matter.MouseConstraint,
  Render = Matter.Render,
  Events = Matter.Events

// create an engine
var engine = Engine.create();
var world = engine.world
world.gravity.y = 0
var mouseConstraint = MouseConstraint.create(engine);
// create a renderer
let canvas = document.getElementById('matterJS')
var render = Render.create({
    element: document.body,
    engine: engine,
    canvas: canvas,
    options: {
		width: 500,
		height: 500,
		background: '#fafafa',
		wireframeBackground: '#222',
		hasBounds: false,
		enabled: true,
		wireframes: false,
		showSleeping: false,
		showDebug: false,
		showBroadphase: false,
		showBounds: false,
		showVelocity: false,
		showCollisions: false,
		showAxes: false,
		showPositions: false,
		showAngleIndicator: true,
		showIds: false,
		showShadows: false
    }
});
Engine.run(engine);
// run the renderer
Render.run(render);
World.add(world, mouseConstraint)


function ragdoll(initialX, initialY, radius, arrowKeys, id, skinColour) {
	let options = {collisionFilter: { group: Body.nextGroup(true) }}
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
	// torsoCircles[1].render.visible = false
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
	radius *= 2
	let headCircles = [Bodies.circle(x, y, radius, options)]
	// console.log(headCircles[0].axes)
	headCircles[0].render.fillStyle = torsoCircles[0].render.fillStyle
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
	World.add(world, player)
	///////////////////////////////////////////////////////////////////////////////
	
	
	

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
	
	
	rightForeArmCircles[rightForeArmCircles.length - 1].isEnd = true
	leftForeArmCircles[leftForeArmCircles.length - 1].isEnd = true
	rightLegCircles[rightLegCircles.length - 1].isEnd = true
	leftLegCircles[leftLegCircles.length - 1].isEnd = true
	
	
	window.addEventListener('keydown', e => {
		let c = e.keyCode
		// let force = 0.045
		let force = radius / 300
		let body = headCircles[0]
		if(arrowKeys) {
			if(c === 37) Body.applyForce(body, body.position, {x: -force, y: 0})
			else if(c === 38) Body.applyForce(body, body.position, {x: 0, y: -force})
			else if(c === 39) Body.applyForce(body, body.position, {x: force, y: 0})
			else if(c === 40) Body.applyForce(body, body.position, {x: 0, y: force})
		}
		else {
			if(c === 65) Body.applyForce(body, body.position, {x: -force, y: 0})
			else if(c === 87) Body.applyForce(body, body.position, {x: 0, y: -force})
			else if(c === 68) Body.applyForce(body, body.position, {x: force, y: 0})
			else if(c === 83) Body.applyForce(body, body.position, {x: 0, y: force})
		}
	})
	 for(circle of Composite.allBodies(player)) circle.playerId = id
	player.skinColour = skinColour
	return player
}




let player3 = ragdoll(100, 150, 10, true, 3,  "rgb(52, 73, 94)")
let player4 = ragdoll(330, 150, 10, false, 4, "rgb(52, 73, 94)")

/// Test
///////////////////////////////////////////////////////////////////////////////////////////

Events.on(mouseConstraint, 'mousedown', updateMouse)
function updateMouse() {
	let body = mouseConstraint.body
	let constraint = mouseConstraint.constraint
	if(body) {
		// console.log(body.angle)
		// console.log(body.axes[body.axes.length - 1])
	}
}

function updatePoints(player) {
  let circleList = []
  let composites = player.composites
  for(composite of composites) {
    let bodies = composite.bodies
    let list = []
    for(body of bodies) {
      let colour = '#2F3B40'
      if(body.isEnd) circleList.push({ x: body.position.x, y: body.position.y })
      if(body.label === 'head') player.head = { x: body.position.x, y: body.position.y }
      if(body.label === 'torso' || body.label === 'thigh' || body.label === 'arm') colour = player.skinColour
      list.push({ x: body.position.x, y: body.position.y, colour: colour})
    }
    composite.list = list
  }
  player.circleList = circleList
}

function drawBody(player, ctx, circleColour) {
  let composites = player.composites
  let torso;
  for(composite of composites) {
    let list = composite.list
    if(!composite.layers) continue
    if(composite.label === 'torso') torso = composite
    drawBodyPart(list, composite.layers, ctx, 20)
  }
  drawBodyPart(torso.list, torso.layers, ctx, 20)
  let pelvis = torso.list[torso.list.length - 1]
  drawPants(pelvis, ctx, circleColour)
}

function drawBodyPart(list, layers, ctx, lineWidth) {
	for(layer of layers) {
		let width = layer.width
		let colour = layer.colour
		ctx.lineWidth = lineWidth * width
	    ctx.beginPath()
	    ctx.lineCap = layer.lineCap ? layer.lineCap : "round"
	    let start = layer.start ? layer.start : 0
	    let end = layer.end ? layer.end : list.length - 1
	    ctx.moveTo(list[start].x, list[start].y)
	    ctx.strokeStyle = colour
	    for(let i = start + 1; i <= end; i++) {
	      ctx.lineTo(list[i].x, list[i].y)
	    }
	    ctx.stroke()
	}
}

function drawCircles(player, ctx) {
  let list = player.circleList
  ctx.fillStyle = "#428B37"
  for(elem of list) {
    ctx.beginPath()
    ctx.arc(elem.x, elem.y, 10, 0, 2 * Math.PI, false)
    ctx.fill()
  }
}

function drawHead(player, ctx) {
	ctx.fillStyle = "#F8C28A"
    let head = player.head
    ctx.beginPath()
    ctx.arc(head.x, head.y, 25, 0, 2 * Math.PI, false)
    ctx.fill()
}

function draw(players, ctx, sp, circleColour) {
  ctx.clearRect(0, 0, ctx.w, ctx.h)
  for(player of players) {
	  updatePoints(player)
	  addSkin(player, sp)
	  drawBody(player, ctx, circleColour)
	  //drawCircles(player, ctx, )
	  drawHead(player, ctx)
  }
  ctx.lineWidth /= 2
}

function drawPants(pelvis, ctx, circleColour) {
	return
	ctx.beginPath()
	ctx.fillStyle = circleColour
	ctx.arc(pelvis.x, pelvis.y, 10, 0, 2 * Math.PI, false)
	ctx.fill()
}


function addSkin(player, sp) {
	let composites = player.composites
	for(composite of composites) {
		let label = composite.label 
		let layers = sp[label]
		composite.layers = layers
	}
}


//////////////////// COMICS ///////////////////////

let spiderman = {
	torso: [{width: 1, colour: '#072A7F', start: 0, end: 4}, {width: 0.5, colour: '#EA291C', start: 0, end: 4}],
	rightArm: [{width: 1, colour: '#EA291C', start: 0, end: 2}, {width: 0.75, colour: "#072A7F", start: 0, end: 2}],
	rightForeArm: [{width: 1, colour: '#EA291C', start: 0, end: 2}],
	leftArm: [{width: 1, colour: '#EA291C', start: 0, end: 2}, {width: 0.75, colour: "#072A7F", start: 0, end: 2}],
	leftForeArm: [{width: 1, colour: '#EA291C', start: 0, end: 2}],
	rightThigh: [{width: 1, colour: '#072A7F', start: 0, end: 3}],
	rightLeg: [{width: 1, colour: '#EA291C', start: 0, end: 3}],
	leftThigh: [{width: 1, colour: '#072A7F', start: 0, end: 3}],
	leftLeg: [{width: 1, colour: '#EA291C', start: 0, end: 3}]
} // ✓
let deadpool = {
	torso: [{width: 1, colour: 'black', start: 0, end: 4}, {width: 0.4, colour: 'red', start: 0, end: 4}],
	rightArm: [{width: 1, colour: 'black', start: 0, end: 2}],
	rightForeArm: [{width: 1, colour: 'red', start: 0, end: 2}],
	leftArm: [{width: 1, colour: 'black', start: 0, end: 2}],
	leftForeArm: [{width: 1, colour: 'red', start: 0, end: 2}],
	rightThigh: [{width: 1, colour: 'red', start: 0, end: 3}],
	rightLeg: [{width: 1, colour: 'black', start: 0, end: 3}],
	leftThigh: [{width: 1, colour: 'red', start: 0, end: 3}],
	leftLeg: [{width: 1, colour: 'black', start: 0, end: 3}]
} // ✓
let wolverine = {
	torso: [{width: 1, colour: "#ffd300"}],
	rightArm: [{width: 1, colour: '#FEBF8F'}],
	rightForeArm: [{width: 1, colour: '#FEBF8F'}, {width: 1, colour: 'blue', start: 1}],
	leftArm: [{width: 1, colour: '#FEBF8F'}],
	leftForeArm: [{width: 1, colour: '#FEBF8F'}, {width: 1, colour: 'blue', start: 1}],
	rightThigh: [{width: 1, colour: '#ffd300'}],
	rightLeg: [{width: 1, colour: '#ffd300'},{width: 1, colour: 'blue', start: 1}],
	leftThigh: [{width: 1, colour: '#ffd300'}],
	leftLeg: [{width: 1, colour: '#ffd300'},{width: 1, colour: 'blue', start: 1}]
} // ✓
let wonderwoman = {
	torso: [{width: 1, colour: '#F8C28A'}, {width: 1, colour: 'red', start: 1}, {width: 1, colour: 'yellow', start: 4}],
	rightArm: [{width: 1, colour: '#F8C28A'}],
	rightForeArm: [{width: 1, colour: '#F8C28A'}],
	leftArm: [{width: 1, colour: '#F8C28A'}],
	leftForeArm: [{width: 1, colour: '#F8C28A'}],
	rightThigh: [{width: 1, colour: '#F8C28A'}, {width: 1, colour: 'blue', end: 1, lineCap: 'butt'}],
	rightLeg: [{width: 1, colour: '#F8C28A'},{width: 1, colour: 'red', start: 1}],
	leftThigh: [{width: 1, colour: '#F8C28A'}, {width: 1, colour: 'blue', end: 1, lineCap: 'butt'}],
	leftLeg: [{width: 1, colour: '#F8C28A'},{width: 1, colour: 'red', start: 1}]
} // ✓
let catwoman = {
	torso: [{width: 1, colour: 'black'}],
	rightArm: [{width: 1, colour: 'black'}],
	rightForeArm: [{width: 1, colour: 'black'}],
	leftArm: [{width: 1, colour: 'black'}],
	leftForeArm: [{width: 1, colour: 'black'}],
	rightThigh: [{width: 1, colour: 'black'}],
	rightLeg: [{width: 1, colour: 'black'}],
	leftThigh: [{width: 1, colour: 'black'}],
	leftLeg: [{width: 1, colour: 'black'}]
} // ✓
let ironman = {
	torso: [{width: 1, colour: '#C4421B'}],
	rightArm: [{width: 1, colour: '#E7CE13'}],
	rightForeArm: [{width: 1, colour: '#C4421B'}],
	leftArm: [{width: 1, colour: '#E7CE13'}],
	leftForeArm: [{width: 1, colour: '#C4421B'}],
	rightThigh: [{width: 1, colour: '#E7CE13'}],
	rightLeg: [{width: 1, colour: '#C4421B'}],
	leftThigh: [{width: 1, colour: '#E7CE13'}],
	leftLeg: [{width: 1, colour: '#C4421B'}]
} // ✓
let hulk = {
	torso: [{width: 1, colour: '#428B37'}],
	rightArm: [{width: 1, colour: '#428B37'}],
	rightForeArm: [{width: 1, colour: '#428B37'}],
	leftArm: [{width: 1, colour: '#428B37'}],
	leftForeArm: [{width: 1, colour: '#428B37'}],
	rightThigh: [{width: 1, colour: '#753AA6'}],
	rightLeg: [{width: 1, colour: '#428B37'}],
	leftThigh: [{width: 1, colour: '#753AA6'}],
	leftLeg: [{width: 1, colour: '#428B37'}]
} // ✓
let superman = {
	torso: [{width: 1, colour: '#2B366A'}],
	rightArm: [{width: 1, colour: '#2B366A'}],
	rightForeArm: [{width: 1, colour: '#2B366A'}],
	leftArm: [{width: 1, colour: '#2B366A'}],
	leftForeArm: [{width: 1, colour: '#2B366A'}],
	rightThigh: [{width: 1, colour: '#2B366A'}],
	rightLeg: [{width: 1, colour: '#DE0C43'}],
	leftThigh: [{width: 1, colour: '#2B366A'}],
	leftLeg: [{width: 1, colour: '#DE0C43'}]
} // ✓
let flash = {
	torso: [{width: 1, colour: '#E01913'}],
	rightArm: [{width: 1, colour: '#E01913'}],
	rightForeArm: [{width: 1, colour: '#FFD300'}],
	leftArm: [{width: 1, colour: '#E01913'}],
	leftForeArm: [{width: 1, colour: '#FFD300'}],
	rightThigh: [{width: 1, colour: '#E01913'}],
	rightLeg: [{width: 1, colour: '#FFD300'}],
	leftThigh: [{width: 1, colour: '#E01913'}],
	leftLeg: [{width: 1, colour: '#FFD300'}]
} // ✓
let magneto = {
	torso: [{width: 1, colour: '#BF383D'}],
	rightArm: [{width: 1, colour: '#BF383D'}],
	rightForeArm: [{width: 1, colour: '#765686'}],
	leftArm: [{width: 1, colour: '#BF383D'}],
	leftForeArm: [{width: 1, colour: '#765686'}],
	rightThigh: [{width: 1, colour: '#BF383D'}],
	rightLeg: [{width: 1, colour: '#765686'}],
	leftThigh: [{width: 1, colour: '#BF383D'}],
	leftLeg: [{width: 1, colour: '#765686'}]
} // ✓
let batman = {
	torso: [{width: 1, colour: 'grey'}],
	rightArm: [{width: 1, colour: 'grey'}],
	rightForeArm: [{width: 1, colour: 'black'}],
	leftArm: [{width: 1, colour: 'grey'}],
	leftForeArm: [{width: 1, colour: 'black'}],
	rightThigh: [{width: 1, colour: 'grey'}],
	rightLeg: [{width: 1, colour: 'black'}],
	leftThigh: [{width: 1, colour: 'grey'}],
	leftLeg: [{width: 1, colour: 'black'}]
}
let blackwidow = {
	torso: [{width: 1, colour: 'black'}, {width: 1, colour: '#F8C28A', end: 1, reduction: 0.5}],
	rightArm: [{width: 1, colour: 'black'}],
	rightForeArm: [{width: 1, colour: 'black'}],
	leftArm: [{width: 1, colour: 'black'}],
	leftForeArm: [{width: 1, colour: 'black'}],
	rightThigh: [{width: 1, colour: 'black'}],
	rightLeg: [{width: 1, colour: 'black'}],
	leftThigh: [{width: 1, colour: 'black'}],
	leftLeg: [{width: 1, colour: 'black'}]
}
let mystique = {
	torso: [{width: 1, colour: '#434E94'}],
	rightArm: [{width: 1, colour: '#434E94'}],
	rightForeArm: [{width: 1, colour: '#434E94'}],
	leftArm: [{width: 1, colour: '#434E94'}],
	leftForeArm: [{width: 1, colour: '#434E94'}],
	rightThigh: [{width: 1, colour: '#434E94'}],
	rightLeg: [{width: 1, colour: '#434E94'}],
	leftThigh: [{width: 1, colour: '#434E94'}],
	leftLeg: [{width: 1, colour: '#434E94'}]
}
let ca = {
	torso: [{width: 1, colour: '#009CC4'}],
	rightArm: [{width: 1, colour: '#009CC4'}],
	rightForeArm: [{width: 1, colour: '#8F2625'}],
	leftArm: [{width: 1, colour: '#009CC4'}],
	leftForeArm: [{width: 1, colour: '#8F2625'}],
	rightThigh: [{width: 1, colour: '#009CC4'}],
	rightLeg: [{width: 1, colour: '#8F2625'}],
	leftThigh: [{width: 1, colour: '#009CC4'}],
	leftLeg: [{width: 1, colour: '#8F2625'}]
}

/////////////////// ANIME /////////////////////

let vegeta = {
	torso: [{width: 1, colour: '#3A4D8D', start: 0, end: 4}, {width: 0.4, colour: "#F8B991", start: 0, end: 1}],
	rightArm: [{width: 1, colour: '#F8B991', start: 0, end: 2}],
	rightForeArm: [{width: 1, colour: '#F8B991', start: 0, end: 2}],
	leftArm: [{width: 1, colour: '#F8B991', start: 0, end: 2}],
	leftForeArm: [{width: 1, colour: '#F8B991', start: 0, end: 2}],
	rightThigh: [{width: 1, colour: '#3A4D8D', start: 0, end: 3}],
	rightLeg: [{width: 1, colour: '3A4D8D', start: 0, end: 3}],
	leftThigh: [{width: 1, colour: '#3A4D8D', start: 0, end: 3}],
	leftLeg: [{width: 1, colour: '3A4D8D', start: 0, end: 3}]
}
let goku = {
	torso: [{width: 1, colour: '#EE5931', start: 0, end: 4}],
	rightArm: [{width: 1, colour: '#EE5931', start: 0, end: 2}],
	rightForeArm: [{width: 1, colour: '#F8B990', start: 0, end: 2}],
	leftArm: [{width: 1, colour: '#EE5931', start: 0, end: 2}],
	leftForeArm: [{width: 1, colour: '#F8B990', start: 0, end: 2}],
	rightThigh: [{width: 1, colour: '#EE5931', start: 0, end: 3}],
	rightLeg: [{width: 1, colour: "#EE5931"},{width: 1, colour: '#025090', start: 1}],
	leftThigh: [{width: 1, colour: '#EE5931', start: 0, end: 3}],
	leftLeg: [{width: 1, colour: "#EE5931"},{width: 1, colour: '#025090', start: 1}]
}
let naruto = {
	torso: [{width: 1, colour: 'orange'}, {width: 1, colour: 'black', end: 1, lineCap: 'butt'}, {width: 0.5, colour: 'black', start: 1, lineCap: 'square'}],
	rightArm: [{width: 1, colour: 'black'}],
	rightForeArm: [{width: 1, colour: 'black'}],
	leftArm: [{width: 1, colour: 'black'}],
	leftForeArm: [{width: 1, colour: 'black'}],
	rightThigh: [{width: 1, colour: 'orange'}],
	rightLeg: [{width: 1, colour: "orange"}],
	leftThigh: [{width: 1, colour: 'orange'}],
	leftLeg: [{width: 1, colour: "orange"}]
}
let rocklee = {
	torso: [{width: 1, colour: '#3D6F50'}],
	rightArm: [{width: 1, colour: '#3D6F50'}],
	rightForeArm: [{width: 1, colour: '#3D6F50'}, {width: 1, colour: '#E9E7DC', start: 1}],
	leftArm: [{width: 1, colour: '#3D6F50'}],
	leftForeArm: [{width: 1, colour: '#3D6F50'}, {width: 1, colour: '#E9E7DC', start: 1}],
	rightThigh: [{width: 1, colour: '#3D6F50'}],
	rightLeg: [{width: 1, colour: "#3D6F50"}, {width: 1, colour: '#DD9A5C', start: 1}],
	leftThigh: [{width: 1, colour: '#3D6F50'}],
	leftLeg: [{width: 1, colour: "#3D6F50"}, {width: 1, colour: '#DD9A5C', start: 1}]
}
let aang = {
	torso: [{width: 1, colour: '#fefd7f'},{width: 1, colour: '#D63E1F', end: 3}],
	rightArm: [{width: 1, colour: '#D63E1F'}],
	rightForeArm: [{width: 1, colour: '#D63E1F'}, {width: 1, colour: '#fefd7f', start: 1}],
	leftArm: [{width: 1, colour: '#D63E1F'}],
	leftForeArm: [{width: 1, colour: '#D63E1F'}, {width: 1, colour: '#fefd7f', start: 1}],
	rightThigh: [{width: 1, colour: '#fefd7f'}],
	rightLeg: [{width: 1, colour: "#fefd7f"}, {width: 1, colour: "#B1644F", start: 1}],
	leftThigh: [{width: 1, colour: '#fefd7f'}],
	leftLeg: [{width: 1, colour: "#fefd7f"}, {width: 1, colour: "#B1644F", start: 1}]
}
let saitama = {
	torso: [{width: 1, colour: '#DEB36C'}],
	rightArm: [{width: 1, colour: '#DEB36C'}],
	rightForeArm: [{width: 1, colour: '#DEB36C'}, {width: 1, colour: '#993C31', start: 1}],
	leftArm: [{width: 1, colour: '#DEB36C'}],
	leftForeArm: [{width: 1, colour: '#DEB36C'}, {width: 1, colour: '#993C31', start: 1}],
	rightThigh: [{width: 1, colour: '#DEB36C'}],
	rightLeg: [{width: 1, colour: '#DEB36C'}, {width: 1, colour: '#993C31', start: 1}],
	leftThigh: [{width: 1, colour: '#DEB36C'}],
	leftLeg: [{width: 1, colour: '#DEB36C'}, {width: 1, colour: '#993C31', start: 1}]
}
let luffy = {
	torso: [{width: 1, colour: 'red'}, {width: 0.5, colour: '#F8B990', end: 1}],
	rightArm: [{width: 1, colour: '#F8B990'}],
	rightForeArm: [{width: 1, colour: '#F8B990'}],
	leftArm: [{width: 1, colour: '#F8B990'}],
	leftForeArm: [{width: 1, colour: '#F8B990'}],
	rightThigh: [{width: 1, colour: '#506CAF'}],
	rightLeg: [{width: 1, colour: '#F8B990'}],
	leftThigh: [{width: 1, colour: '#506CAF'}],
	leftLeg: [{width: 1, colour: '#F8B990'}]
} 
let kaneki = {}



let testCanvas = document.getElementById('test')
let ctx = testCanvas.getContext('2d')
ctx.w = testCanvas.width 
ctx.h = testCanvas.height
// draw([player4], ctx, hu, "#428B37")

setInterval(() => draw([player4], ctx, luffy, "black"), 15)
/*
Sonic 
Mario 
Ezio 
Lara Croft 
Master Cheif
Steve Minecraft
Ryu 
Link 
Vault Boy
Samus
Tracer 
Crash Bandicoot
*/




