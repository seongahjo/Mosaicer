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
    var folder=''
    if(path.extname(file)==".jpg")
    folder=path.join('../','image',req.body.folder)
    else if(path.extname(file)==".avi")
    folder=path.join('../','video')
    //var folder = path.join('/tmp/', req.body.id, req.body.folder)
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
      var id = req.query.id
      var imageDir = path.join('/tmp/', id, 'upload')
      var folders = []
      var trainDir = path.join('/tmp/', id, 'train')
      var dataDir = path.join('/tmp/', id, 'data')
      var index=0;
      var trainData = {
        'train_dir': trainDir,
        'data_dir': dataDir
      }
      async.waterfall([
          function(callback) {
            var files=fs.readdirSync(imageDir)
                async.eachSeries(files, function iteratee(file, fcallback) {
                    console.log('read file')
                    var stat = fs.statSync(path.join(imageDir, file))
                    if (stat.isDirectory()) {
                      folders.push(path.join(imageDir, file))
                    }
                    fcallback()
                  })
                callback(null, folders)
              },
              function(folders, callback) {
                console.log("folder : " + folders)

                async.eachSeries(folders, function iteratee(folder, fcallback) {
                  console.log('convert inside' +  folder)
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

              }
            ],function(err, result){
                console.log('train start')
                axios.get(pythonServer + 'train', {
                  params: trainData
                }).then(function(response) {
                  console.log(response.data)
                  res.json(response.data)
                })
              });

        /*async.each(files, function(file, callback) {
          var stat = fs.statSync(path.join(imageDir, file))
          console.log('inside')
          if (stat.isDirectory()) {
            console.log("files : "+path.join(imageDir,file))
            folders.push(path.join(imageDir, file))
          }
          callback()

        })
        */

        // /tmp/id/upload 안에 있는 모든 폴더들 학습하자...
        // 아직 미완성 (ㄲㄲㄲㄲㄱ)

        /*
        axios.get(pythonServer + 'train', {
          params: trainData
        }).then(function(response) {
          console.log(response.data)
          res.json(response.data)
        })
*/

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
