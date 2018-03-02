const _ = require('underscore');
const path = require('path');


const map = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    'text': ['txt', 'md', ''],
    'movie': ['mkv', 'avi', 'rmvb'],
};
exports.ext=(file)=>{
  'use strict';
  const ext = path.extname(file).substr(1).toLowerCase();
   for (let key in map) {
    if (_.include(map[key], ext)) {
        return key;
    }
}
};

exports.stat= function(folder, file) {
  'use strict';
    const result = {
        name: path.basename(file, path.extname(file)),
        dir: folder,
    };
    const ext = path.extname(file).substr(1).toLowerCase();
    result.type = 'blank';
    if (!ext){
        result.type = 'folder'; // change required
        result.dir=path.join(folder, file);
      }
    else {
        for (let key in map) {
            if (_.include(map[key], ext)) {
                result.type = key;
                break;
            }
        }
    }
    return result;
};
