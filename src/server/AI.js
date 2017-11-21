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
  let xDiff = this.player.pelvis.position.x - this.targetPlayer.pelvis.position.x
  let yDiff = this.player.pelvis.position.y - this.targetPlayer.pelvis.position.y
  let left = xDiff > 0
  let up = yDiff > 0
  let right = !left
  let down = !up
  let spinDistance = 130
  let shouldSpin = Math.abs(xDiff) < spinDistance && (Math.abs(yDiff) < spinDistance) && yDiff < 0
  // let shouldSpin = false
  if(shouldSpin) {
    if(yDiff < 0) {
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
