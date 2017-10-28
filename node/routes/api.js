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
    else if(result.type=="video")
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
  var id = req.query.id
  var folder = req.query.folder
  //var dir = path.join('/tmp/', id, 'upload', folder)
  var dir = path.join('../','image',folder)
  fs.existsSync(dir) || fs.mkdirSync(dir)
  res.send(dir)
})

router.get('/train', function(req, res, next) {
      var folders=req.query.folder
      console.log(folders)
      var trainDir = path.join('../', 'model')
      var dataDir=path.join('data');
      fs.existsSync(trainDir) || fs.mkdirSync(trainDir)
      for(var s=0;s<9;s++){
        console.log(path.join(trainDir,s.toString()))
        if(!fs.existsSync(path.join(trainDir,s.toString())))
        break;
      }
      trainDir=path.join('model',s.toString())
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
                    if(index==folders.length)
                    callback(null)
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
      res.json('good')
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
