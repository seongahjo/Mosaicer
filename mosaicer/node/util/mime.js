const _ = require('underscore');
const path = require('path');


const map = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
  text: ['txt', 'md', ''],
  movie: ['mkv', 'avi', 'rmvb'],
};
exports.ext = (file) => {
  const ext = path.extname(file).substr(1).toLowerCase();
  for (const key in map) {
    if (_.include(map[key], ext)) {
      return key;
    }
  }
  return undefined;
};

exports.stat = (folder, file) => {
  const result = {
    name: path.basename(file, path.extname(file)),
    dir: folder,
  };
  const ext = path.extname(file).substr(1).toLowerCase();
  result.type = 'blank';
  if (!ext) {
    result.type = 'folder'; // change required
    result.dir = path.join(folder, file);
  } else {
    for (const key in map) {
      if (_.include(map[key], ext)) {
        result.type = key;
        break;
      }
    }
  }
  return result;
};
