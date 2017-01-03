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
        console.log(req.body.folder)
        var folder = path.join('/tmp/', req.body.id, req.body.folder)
        console.log(folder)
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
router.get('/convert', function(req, res, next) {
    var id = req.query.id
    var folder = req.query.folder
    var label = req.query.label
    var imageDir = path.join('/tmp/', id, 'upload', folder)
    var dataDir = path.join('/tmp/', id, 'data')
    var data = {
        'image_dir': imageDir,
        'data_dir': dataDir,
        'label': label
    }
    axios.get(pythonServer + 'convert', {
        params: data
    }).then(function(response) {
        console.log(response.data)
        res.json(response.data)
    })
})

router.get('/makeFolder', function(req, res, next) {
  var id = req.query.id
  var folder = req.query.folder
  console.log('test' + folder)
  var dir= path.join('/tmp/', id, 'upload',folder)
  console.log(dir)
  fs.existsSync(dir) || fs.mkdirSync(dir)
  res.json('good')
})

router.get('/train', function(req, res, next) {
    var id = req.query.id
    var trainDir = path.join('/tmp/', id, 'train')
    var dataDir = path.join('/tmp/', id, 'data')
    var data = {
        'train_dir': trainDir,
        'data_dir': dataDir
    }
    axios.get(pythonServer + 'train', {
        params: data
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


router.post('/transfer', compareupload.single('file'), function(req, res, next) {
    var file = req.file;
    var form = new FormData()
    form.append('id', req.body.id)
    form.append('images', fs.createReadStream(file.path))
    form.submit('http://localhost:9999', function(err, response) {
        console.log('submit')
        // 파이썬 서버가 켜있을 때
        if (response) {
            wreck.read(response, {
                json: true
            }, function(error, data) {
                if (data) {
                    var value = data.results[0].precision
                    var precisions = []
                    async.eachOf(value, function iteratee(item, key, cb) {
                        var jsontemp = {}
                        jsontemp.label = key
                        jsontemp.value = item * 100
                        precisions.push(jsontemp)
                        cb()
                    }, function() {
                        res.send(upload_view({
                            precisions: precisions
                        }))
                    })
                }
            })

        }
    })
})

module.exports = router
