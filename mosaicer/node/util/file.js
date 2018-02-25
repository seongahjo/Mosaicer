var fs=require('fs');
var fse=require('fs-extra');

exports.make=(Path)=>{
  'use strict';
  if(!fs.existsSync(Path)){
  fs.mkdirSync(Path);
}
else {
}
};

exports.remove=(Path)=>{
  'use strict';
  if (fs.existsSync(Path)) {
    fse.removeSync(Path);
  }
};

exports.move=(src,dest,option)=>{
  'use strict';
  if (fs.existsSync(src)) {
    fse.move(src, dest,option);
  }
};

exports.copy=(src,dest,option)=>{
  'use strict';
  if (fs.existsSync(src)) {
    fse.copySync(src, dest,option);
  }
};


exports.empty=(Path)=>{
  'use strict';
    if (fs.existsSync(Path)) {
      fse.emptyDir(Path);
    }
};

exports.readJson=(file)=>{'use strict'; fse.readJsonSync(file,{throws: false});};

exports.writeJson=(file,content) =>{
  'use strict';
  fse.writeJsonSync(file,content);
};
