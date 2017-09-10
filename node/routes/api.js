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
var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

var uploadstorage = multer.diskStorage({
  destination: function(req, file, cb) {
    var folder = path.join('/tmp/', req.body.id, req.body.folder)
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
  var dir = path.join('/tmp/', id, 'upload', folder)
  fs.existsSync(dir) || fs.mkdirSync(dir)
  res.send(dir)
})

router.get('/train', function(req, res, next) {
      var id = req.query.id
      var imageDir = path.join('/tmp/', id, 'upload')
      var folders = []
      fs.readdir(imageDir, function(error, files) {
        async.eachSeries(files, function iteratee(file, callback) {
          var stat = fs.statSync(path.join(Path, file))
          if (stat.isDirectory()) {
            folders.push(path.join(Path, file))
          }
          callback()

        }) //async
      }) //readdir

      // /tmp/id/upload 안에 있는 모든 폴더들 학습하자...
      // 아직 미완성 (ㄲㄲㄲㄲㄱ)
      var trainDir = path.join('/tmp/', id, 'train')
      var dataDir = path.join('/tmp/', id, 'data')
      var trainData = {
        'train_dir': trainDir,
        'data_dir': dataDir
      }

      async.eachSeries(folders, function iteratee(folder, callback) {
          var convertData = {
            'image_dir': folder,
            'data_dir': dataDir,
            'label': label
          }
          axios.get(pythonServer + 'convert', {
            params: convertData
          }).then(function(response) {
            console.log('convert finished')

          }).finally(function(){
              callback()
          })

        })

        axios.get(pythonServer + 'train', {
          params: trainData
        }).then(function(response) {
          console.log(response.data)
          res.json(response.data)
        })


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
      var id = req.query.id
      var filename = req.query.filename
      var label = req.query.label
      var trainDir = path.join('/tmp/', id, 'train')
      var videoPath = path.join('/tmp/', id, 'video', filename)
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
      var id = req.query.id
      var filename = req.query.filename
      var Path = path.join('/tmp/', id, 'video', 'result', filename)
      console.log(Path)
      res.download(Path);
    })


    module.exports = router
