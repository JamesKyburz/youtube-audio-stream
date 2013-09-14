var defaults = {
  videoFormat: 'mp4',
  quality: 'lowest',
  audioFormat: 'mp3',
};

exports.set = set;

function set(opt) {
  for(var key in defaults) opt[key] = opt[key] || defaults[key];
};

