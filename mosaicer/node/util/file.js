var path=require('path')
var fs=require('fs')
var fse=require('fs-extra')

exports.make=(Path)=>{
  if(!fs.existsSync(Path)){
  fs.mkdirSync(Path)
}
else {
  console.log('already exists')
}
}

exports.remove=(Path)=>{
  if (fs.existsSync(Path)) {
    fse.removeSync(Path)
  }
}

exports.move=(src,dest,option)=>{
  if (fs.existsSync(src)) {
    fse.move(src, dest,option)
  }
}

exports.copy=(src,dest,option)=>{
  if (fs.existsSync(src)) {
    fse.copySync(src, dest,option)
  }
}


exports.empty=(Path)=>{
    if (fs.existsSync(Path)) {
      fse.emptyDir(Path)
    }
}

exports.readJson=(file)=>fse.readJsonSync(file,{throws: false})

exports.writeJson=(file,content) =>{
  fse.writeJsonSync(file,content)
}
