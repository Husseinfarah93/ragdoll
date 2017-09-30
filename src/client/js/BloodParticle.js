let bloodConfig = require('../../../config.json').gameInfo.bloodParticles

function BloodParticle(x, y) {
  this.x = x
  this.y = y
  this.radius = Math.ceil(Math.random() * bloodConfig.maxParticleSize)
  this.speed = Math.pow(Math.floor(Math.random() * bloodConfig.maxSpeed), .6)
  this.direction = Math.round(Math.random() * 360)
  this.colour = bloodConfig.colour
  
  this.dead = false
  this.lifeLength = this.diff = bloodConfig.lifeLength
  this.startTime = this.currentTime = Date.now()
  this.finalTime = this.startTime + this.lifeLength
  this.percent = this.diff / this.lifeLength
}

BloodParticle.prototype.updateTime = function() {
  this.currentTime = Date.now()
  this.diff = this.finalTime - this.currentTime > 0 ? this.finalTime - this.currentTime : 0
  this.percent = this.diff / this.lifeLength
  if(this.currentTime > this.finalTime) this.dead = true
}

BloodParticle.prototype.updatePosition = function() {
  let a = 180 - (this.direction + 90)
  this.direction > 0 && this.direction < 180 ? this.x += this.speed * Math.sin(this.direction) / Math.sin(this.speed) 
  : this.x -= this.speed * Math.sin(this.direction) / Math.sin(this.speed)
  this.direction > 90 && this.direction < 270 ? this.y += this.speed * Math.sin(a) / Math.sin(this.speed) 
  : this.y -= this.speed * Math.sin(a) / Math.sin(this.speed)
}

BloodParticle.prototype.drawParticle = function(ctx) {
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 0, 0, ' + this.percent.toString() + ')'
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}

export default BloodParticle