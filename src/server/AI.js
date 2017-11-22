function AI(player) {
  this.player = player
  this.targetPlayer;
  this.player.AI = this
  this.intrv = undefined
  this.spin = {
    left: false,
    up: false,
    right: false,
    down: false
  }
}

AI.prototype.selectTarget = function(players) {
  let min = Infinity
  let targetPlayer;
  for(let player of players) {
    if(player.id === this.player.id || player.isDead || player.isBlownUp) continue
    let xDiff = Math.abs(this.player.pelvis.position.x - player.pelvis.position.x)
    let yDiff = Math.abs(this.player.pelvis.position.y - player.pelvis.position.y)
    let diff = xDiff + yDiff
    if(diff < min) {
      min = diff
      targetPlayer = player
    }
  }
  this.targetPlayer = targetPlayer
}

AI.prototype.getDirection = function(Matter) {
  let xDiff = this.player.head.position.x - this.targetPlayer.head.position.x
  let yDiff = this.player.head.position.y - this.targetPlayer.head.position.y

  let xLeftLegDodge = this.player.head.position.x - this.targetPlayer.leftLeg.position.x
  let yLeftLegDodge = this.player.head.position.y - this.targetPlayer.leftLeg.position.y

  let xRightLegDodge = this.player.head.position.x - this.targetPlayer.rightLeg.position.x
  let yRightLegDodge = this.player.head.position.y - this.targetPlayer.rightLeg.position.y

  let xLeftArmDodge = this.player.head.position.x - this.targetPlayer.leftArm.position.x
  let yLeftArmDodge = this.player.head.position.y - this.targetPlayer.leftArm.position.y

  let xRightArmDodge = this.player.head.position.x - this.targetPlayer.rightArm.position.x
  let yRightArmDodge = this.player.head.position.y - this.targetPlayer.rightArm.position.y

  let left = xDiff > 0
  let up = yDiff > 0
  let right = !left
  let down = !up
  let spinDistance = 130
  let dodgeDistance = 130
  let shouldSpin = Math.abs(xDiff) < spinDistance && (Math.abs(yDiff) < spinDistance) && yDiff < 0


  let shouldDodgeLeftLeg = Math.abs(xLeftLegDodge) < dodgeDistance && Math.abs(yLeftLegDodge) < dodgeDistance
  let shouldDodgeRightLeg = Math.abs(xRightLegDodge) < dodgeDistance && Math.abs(yRightLegDodge) < dodgeDistance
  let shouldDodgeLeftArm = Math.abs(xLeftArmDodge) < dodgeDistance && Math.abs(yLeftArmDodge) < dodgeDistance
  let shouldDodgeRightArm = Math.abs(xRightArmDodge) < dodgeDistance && Math.abs(yRightArmDodge) < dodgeDistance


  let shouldDodge = shouldDodgeRightLeg || shouldDodgeLeftLeg || shouldDodgeRightArm || shouldDodgeLeftArm
  if(shouldDodge) {
    if(shouldDodgeLeftLeg) {
      let dodgeLeft = xLeftLegDodge < 0
      let dodgeUp = yLeftLegDodge < 0
      let dodgeRight = !dodgeLeft
      let dodgeDown = !dodgeUp
      this.player.movePlayer(dodgeLeft, dodgeUp, dodgeRight, dodgeDown, Matter, 'head', 2)
    }
    else if(shouldDodgeRightLeg) {
      let dodgeLeft = xRightLegDodge > 0
      let dodgeUp = yRightLegDodge > 0
      let dodgeRight = !dodgeLeft
      let dodgeDown = !dodgeUp
      this.player.movePlayer(dodgeLeft, dodgeUp, dodgeRight, dodgeDown, Matter, 'head', 2)
    }
    else if(shouldDodgeLeftArm) {
      let dodgeLeft = xLeftArmDodge < 0
      let dodgeUp = yLeftArmDodge < 0
      let dodgeRight = !dodgeLeft
      let dodgeDown = !dodgeUp
      this.player.movePlayer(dodgeLeft, dodgeUp, dodgeRight, dodgeDown, Matter, 'head', 2)
    }
    else if(shouldDodgeRightArm) {
      let dodgeLeft = xRightArmDodge > 0
      let dodgeUp = yRightArmDodge > 0
      let dodgeRight = !dodgeLeft
      let dodgeDown = !dodgeUp
      this.player.movePlayer(dodgeLeft, dodgeUp, dodgeRight, dodgeDown, Matter, 'head', 2)
    }

  }
  else if(shouldSpin) {
    if(yDiff < 0 && this.player.head.position.y < this.player.rightLeg.position.y) {
      if(xDiff < 0) {
        this.player.movePlayer(left, up, right, down, Matter, 'rightLeg')
      }
      else {
        this.player.movePlayer(left, up, right, down, Matter, 'leftLeg')
      }
    }
    else {
      if(xDiff < 0) {
        this.player.movePlayer(left, up, right, down, Matter, 'rightArm')
      }
      else {
        this.player.movePlayer(left, up, right, down, Matter, 'leftArm')
      }
    }
  }
  else {
    this.player.movePlayer(left, up, right, down, Matter)
  }
}

AI.prototype.rotate = function() {}

AI.prototype.update = function(Matter) {
  let ths = this
  this.interval = setInterval(() => ths.getDirection(Matter), 16)
}

AI.prototype.updateSkillPoint = function() {
  let skillPoints = this.player.skillPointValues
  let keys = Object.keys(skillPoints)
  let randomKey = keys[getRandom(0, keys.length - 1)]
  let isMaxed = skillPoints[randomKey].curVal === skillPoints[randomKey].maxVal
  while(isMaxed) {
    randomKey = keys[getRandom(0, keys.length - 1)]
    isMaxed = skillPoints[randomKey].curVal === skillPoints[randomKey].maxVal
  }
  this.player.updatePlayerSkillPoints(randomKey)
  this.player.decreaseSkillPoints()
}

AI.prototype.dead = function() {
  let ths = this
  clearInterval(ths.interval)
  this.targetPlayer = undefined
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports = AI
