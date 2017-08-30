function Camera(xPos, yPos, canvasWidth, canvasHeight, worldWidth, worldHeight) {
	this.xPos = xPos 
  this.yPos = yPos 
  this.deadZoneX = 0 
  this.deadZoneY = 0
  this.width = canvasWidth
  this.height = canvasHeight
  this.worldWidth = worldWidth
  this.worldHeight = worldHeight
}

Camera.prototype.follow = function(x, y) {
	this.deadZoneX = x
  this.deadZoneY = y
}

Camera.prototype.update = function(follow) {
  this.followed = follow
  // WHAT IS THIS?
  if (this.followed.x - this.xPos + this.deadZoneX > this.width) {
    this.xPos = this.followed.x - (this.width - this.deadZoneX)
  }
  else if (this.followed.x - this.xPos + this.deadZoneX < this.width) {
    this.xPos = this.followed.x - this.deadZoneX
  }
  // WHAT IS THIS?
  if (this.followed.y - this.yPos + this.deadZoneY > this.height) {
    this.yPos = this.followed.y - (this.width - this.deadZoneY)
  }
  else if (this.followed.y - this.yPos + this.deadZoneY < this.height) {
    console.log('2')
    this.yPos = this.followed.y - this.deadZoneY
  }
  // Left
  if(this.xPos < 0) this.xPos = 0
  // Right 
  if(this.xPos > this.worldWidth) this.xPos = this.worldWidth
  // Up 
  if(this.yPos < 0) this.yPos = 0
  // Down
  if(this.yPos > this.worldHeight) this.yPos = this.worldHeight
  // console.log(this.xPos, this.yPos)
}

export default Camera