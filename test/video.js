window.onload = function () {
  var player = new window.Audio('youtube.com/watch?v=s-mOy8VUEBk')
  player.preload = 'metadata'
  player.play()
  player.controls = true
  document.body.appendChild(player)
}
