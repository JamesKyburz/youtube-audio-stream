window.onload = function() {
  var player = new Audio('youtube.com/watch?v=s-mOy8VUEBk')
  player.preload = 'metadata';
  player.play();
  player.controls = true;
  document.body.appendChild(player);
};
