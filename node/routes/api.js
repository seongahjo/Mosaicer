var express = require('express')
var router = express.Router()
var path = require('path')
var axios = require('axios')
var multer = require('multer')
var pythonServer = 'http://localhost:9999/'
var fs = require('fs')
var FormData = require('form-data')
var async = require('async')
var jade = require('jade')
var wreck = require('wreck')
var mime = require('../util/mime')
var fse=require('fs-extra')
var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

var uploadstorage = multer.diskStorage({
  destination: function(req, file, cb) {
    var folder=''
    var result=mime.stat(req.body.folder,file.originalname)
    console.log(result)
    if(result.type=="image")
    folder=path.join('../','image',req.body.folder)
    else if(result.type=="movie")
    folder=path.join('../','video')
    console.log("upload to "+folder)
    cb(null, folder)
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})


var compareupload = multer({
  storage: storage
})
var upload = multer({
  storage: uploadstorage
})


router.get('/makeFolder', function(req, res, next) {
  var folder = req.query.folder
  var dir = path.join('../','image',folder)
  console.log('makeFolder : '+dir)
  fs.existsSync(dir) || fs.mkdirSync(dir)
  res.send(dir)
})


router.get('/delete', function(req, res, next) {
  var files = req.query.files
  console.log(files +" to delete")
  async.eachSeries(files, function iteratee(file, fcallback) {
    var Path=path.join('../','image',file)
    if(fs.existsSync(Path)){
    fse.removeSync(Path)
    }
    fcallback()
  })
  res.sendStatus(200)
})


router.get('/feedback', function(req, res, next) {
  var video=req.query.video
  var files = req.query.files
  var etc_path=path.join('image',video,'etc')
  var dest = req.query.to
  var dataDir='data'
dest = path.join('../','image',dest,'/')
  console.log(files+ ' to '+dest)
 try {
async.eachSeries(files, function iteratee(file, fcallback) {
    var Path=path.join('../','image',file)
    if(fs.existsSync(Path)){
    fse.move(Path,path.join(dest,path.basename(file)), { overwrite: true })
    }
    fcallback()
})

                  var convertData = {
                    'image_dir': etc_path,
                    'data_dir': dataDir,
                    'label': 9
                  }
                  axios.get(pythonServer + 'convert', {
                    params: convertData
                  }).then(function(response) {
                    fse.emptyDir('../'+etc_path)
                    console.log('convert finished')
		})

res.send(video)
}
catch(err){
  console.log(err)
}
})

router.get('/paste', function(req, res, next) {
  var srcs = req.query.src
  var dest = req.query.to
  dest = path.join('../','image',dest,'/')
  console.log(srcs+ ' to '+dest)
  try {
  async.eachSeries(srcs, function iteratee(src, fcallback) {
    var Path=path.join('../','image',src)
    if(fs.existsSync(Path)){
    fse.copySync(Path,path.join(dest,path.basename(src)))
    }
    fcallback()
  })
}catch(err){
  console.log(err)
}
  res.sendStatus(200)
})


router.get('/train', function(req, res, next) {
      var name= req.query.name
      var folders=req.query.folder
      console.log(folders)
      var trainDir = path.join('../', 'model')
      var dataDir=path.join('data');
      fs.existsSync(trainDir) || fs.mkdirSync(trainDir)
      fs.existsSync(dataDir) || fs.mkdirSync(dataDir)
      if(!name){
      for(var s=0;s<9;s++){
        console.log(path.join(trainDir,s.toString()))
        if(!fs.existsSync(path.join(trainDir,s.toString())))
        break;
      }
      trainDir=path.join('model',s.toString())
      }
      trainDir=path.join('model',name)
      dataDir=path.join(dataDir,name)
      fs.existsSync(dataDir) || fs.mkdirSync(dataDir)

      var index=0;
      var trainData = {
        'train_dir': trainDir,
        'data_dir': dataDir
      }
      async.waterfall([
          function(callback) {

                async.eachSeries(folders, function iteratee(folder, fcallback) {
                  console.log('convert inside ' +  folder)
                  folder=path.join('image',folder)
                  console.log('folder '+folder)
                  var convertData = {
                    'image_dir': folder,
                    'data_dir': dataDir,
                    'label': index
                  }

                  axios.get(pythonServer + 'convert', {
                    params: convertData
                  }).then(function(response) {
                    console.log('convert finished')
                    index+=1
                    fcallback()
                    if(index==folders.length){
	callback(null)
		}
                  })
                })

              },
            ],function(err, result){
                axios.get(pythonServer + 'train', {
                  params: trainData
                }).then(function(response) {
                  console.log(response.data)
                  res.json(response.data)
                })
              });
      })

    var upload_view = jade.compile([
      '- each precision in precisions',
      ' .progress',
      '   .progress-bar.progress-bar-success.progress-bar-striped(role="progressbar", aria-valuenow="#{precision.value}", aria-valuemin="0", aria-valuemax="100", style="width: #{precision.value}%")',
      '     span #{precision.label}',
    ].join('\n'))

    router.post('/upload', upload.single('file'), function(req, res, next) {
      res.json('good')
    })

    router.post('/videoUpload', upload.single('file'), function(req, res, next) {
      res.json(req.file.originalname)
    })

    router.get('/mosaic', function(req, res, next) {
      var filename = req.query.filename
      var model=req.query.model
      var label = 9
      var trainDir = path.join('model',model)
      var videoPath = path.join('video', filename)
      var data = {
        'train_dir': trainDir,
        'video_path': videoPath,
        'label': label
      }
      axios.get(pythonServer + 'mosaic', {
        params: data
      }).then(function(response) {
        console.log(response.data)
        res.json(response.data)
      })
    })

    router.get('/download', function(req, res, next) {
      var filename = req.query.filename
      var Path = path.join('../','video', 'result', filename)
      console.log(Path)
      res.download(Path);
    })


    module.exports = router
