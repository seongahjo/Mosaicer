var express = require('express')
var router = express.Router()
var path = require('path')
var axios = require('axios')
var multer = require('multer')
var pythonServer = 'http://localhost:9999/'
var FormData = require('form-data')
var async = require('async')
var jade = require('jade')
var wreck = require('wreck')
var mime = require('../util/mime')
var fu=require('../util/file')

var storage = multer.diskStorage({
  filename: (req,file,cb)=> {
    cb(null, Date.now() + '.jpg')
  }
})

var uploadstorage = multer.diskStorage({
  destination: (req,file,cb)=> {
    var folder = ''
    var result = mime.stat(req.body.folder, file.originalname)
    console.log(result)
    if (result.type == "image")
      folder = path.join('../', 'image', req.body.folder)
    else if (result.type == "movie")
      folder = path.join('../', 'video')
    console.log("upload to " + folder)
    cb(null, folder)
  },
  filename: (req,file,cb)=> {
    cb(null, file.originalname)
  }
})


var compareupload = multer({
  storage: storage
})
var upload = multer({
  storage: uploadstorage
})


router.get('/makeFolder', (req,res,next)=> {
  console.log('makeFolder start')
  var folder = req.query.folder
  var dir = path.join('../', 'image', folder)
  console.log('makeFolder ing...')
  fu.make(dir)


  console.log('makeFolder : ' + dir)
  res.sendStatus(200)
  //res.send(dir)
})


router.get('/delete', (req,res,next)=> {
  var files = req.query.files
  console.log(files + " to delete")
  async.eachSeries(files, (file,fcallback)=> {
    var Path = path.join('../', 'image', file)
    fu.remove(Path)
    fcallback()
  })
  res.sendStatus(200)
})


router.get('/feedback', (req,res,next)=> {
  var video = req.query.video
  var files = req.query.files
  var etc_path = path.join('image', video, 'etc')
  var dest = req.query.to
  var dataDir = 'data'
  dest = path.join('../', 'image', dest, '/')
  console.log(files + ' to ' + dest)
  try {
    async.eachSeries(files, (file,fcallback)=> {
      var Path = path.join('../', 'image', file)
      fu.move(Path,path.join(dest, path.basename(file)),{overwrite:true})
      fcallback()
    })

    var convertData = {
      'image_dir': etc_path,
      'data_dir': dataDir,
      'label': 9
    }
    axios.get(pythonServer + 'convert', {
      params: convertData
    }).then((response)=> {
      fu.empty('../' + etc_path)
      console.log('convert finished')
    })

    res.send(video)
  } catch (err) {
    console.log(err)
  }
})

router.get('/paste', (req,res,next)=> {
  var srcs = req.query.src
  var dest = req.query.to
  dest = path.join('../', 'image', dest, '/')
  console.log(srcs + ' to ' + dest)
  try {
    async.eachSeries(srcs, (src,fcallback)=> {
      var Path = path.join('../', 'image', src)
      fu.copy(Path,path.join(dest,path.basename(src)))
      fcallback()
    })
  } catch (err) {
    console.log(err)
  }
  res.sendStatus(200)
})


router.get('/train', (req,res,next)=> {
  var name = req.query.name
  var folders = req.query.folder
  console.log(folders)
  var trainDir = path.join('../', 'model')
  fu.make(trainDir)
  if (!name) {
    // no default name
    res.sendStatus(400)
  }
  trainDir = path.join('model', name)
  console.log('train ing..')
  var index = 0;
  var trainData = {
    'train_dir': trainDir,
    'data_dir': folders
  }
  console.log('send ' +trainData)
      axios.get(pythonServer + 'train', {
        params: trainData
      }).then((response)=> {
        console.log(response.data)
        res.json(response.data)
      })
    })


router.post('/upload', upload.single('file'), (req,res,next)=> {
  var data={
  'path':req.file.path
  }
  axios.get(pythonServer + 'tracker', {
    params: data
  }).then((response)=> {
    console.log(response.data)
    res.json(response.data)
  })
})

router.post('/videoUpload', upload.single('file'), (req,res,next)=> {
  res.json(req.file.originalname)
})

router.get('/mosaic', (req,res,next)=> {
  var filename = req.query.filename
  var model = req.query.model
  var label = 9
  var trainDir = path.join('model', model)
  var videoPath = path.join('video', filename)
  var data = {
    'train_dir': trainDir,
    'video_path': videoPath,
    'label': label
  }
  axios.get(pythonServer + 'mosaic', {
    params: data
  }).then((response)=> {
    console.log(response.data)
    res.json(response.data)
  })
})

router.get('/download', (req,res,next)=> {
  var filename = req.query.filename
  var Path = path.join('../', 'video', 'result', filename)
  console.log(Path)
  res.download(Path);
})


module.exports = router
