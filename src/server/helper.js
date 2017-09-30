function randColour() {
  let colours = ['#9966CC', '#FF033E', '#7CB9E8', '#3B444B', '#DDE26A', 'orange', 'purple',]
  let colour = colours[Math.floor(Math.random()* colours.length)]
  return colour
}

module.exports = {
  randColour
}