function randColour() {
  let colours = ['#9966CC', '#FF033E', '#7CB9E8', '#3B444B', '#F4C2C2', '#DDE26A', 'black', 'orange', 'purple', 'grey']
  let colour = colours[Math.floor(Math.random()* colours.length)]
  return colour
}

module.exports = {
  randColour
}