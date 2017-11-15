function AI(player) {
  this.player = player
  this.targetPlayer;
}

AI.prototype.selectTarget = function(players) {
  let min = Infinity
  let targetPlayer;
  for(let player of players) {
    if(player.id === this.player.id) continue
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
  this.player.movePlayer(left, up, right, down, Matter)
}

AI.prototype.update = function(Matter) {
  let ths = this
  setInterval(() => ths.getDirection(Matter), 16)
}

module.exports = AI
