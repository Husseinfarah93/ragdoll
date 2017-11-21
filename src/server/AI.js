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


  let left = xDiff > 0
  let up = yDiff > 0
  let right = !left
  let down = !up
  let spinDistance = 130
  let dodgeDistance = 130
  let shouldSpin = Math.abs(xDiff) < spinDistance && (Math.abs(yDiff) < spinDistance) && yDiff < 0
  let shouldDodgeLeft = Math.abs(xLeftLegDodge) < dodgeDistance && Math.abs(yLeftLegDodge) < dodgeDistance
  let shouldDodgeRight = Math.abs(xRightLegDodge) < dodgeDistance && Math.abs(yRightLegDodge) < dodgeDistance
  let shouldDodge = shouldDodgeLeft || shouldDodgeRight
  if(shouldDodge) {
    if(shouldDodgeLeft) {
      let dodgeLeft = xLeftLegDodge < 0
      let dodgeUp = yLeftLegDodge < 0
      let dodgeRight = !dodgeLeft
      let dodgeDown = !dodgeUp
      this.player.movePlayer(dodgeLeft, dodgeUp, dodgeRight, dodgeDown, Matter, 'head', 2)
    }
    else {
      let dodgeLeft = xRightLegDodge > 0
      let dodgeUp = yRightLegDodge > 0
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

AI.prototype.rotate = function() {

}

AI.prototype.update = function(Matter) {
  let ths = this
  this.interval = setInterval(() => ths.getDirection(Matter), 16)
}

AI.prototype.dead = function() {
  let ths = this
  clearInterval(ths.interval)
  this.targetPlayer = undefined
}

module.exports = AI
