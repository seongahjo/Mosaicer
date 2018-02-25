var express = require('express')
var router = express.Router()
var io = require('socket.io-client')
var ss = require('socket.io-stream')
var path= require('path')
var fs=require('fs')
var async = require('async')
var connector=require('../util/connector')
var fu = require('../util/file')
router.get('/share-download',(req,res,next)=>{
  var label= req.query.label
  async.waterfall([
    connector.connect,
    (socket,cb)=>{
      var label_path=path.join('../image',label)
      fu.make(label_path)
      socket.emit('download-images', label)
      ss(socket).on('send-images',(stream,data)=>{
        var filename = path.basename(data.filename);
        stream.pipe(fs.createWriteStream(path.join(label_path,filename)))
      })
      cb()
    }
  ],(err)=>{
    err && res.sendStatus(400)
    res.sendStatus(200)
  })
})

router.get('/share', (req, res, next) => {
  var label = req.query.label
  label=label[0]
  var label_path = path.join('../image', label)
  console.log(label_path)
  async.waterfall([
    connector.connect,
    (socket,cb) => {
      fs.readdir(label_path, (err,files)=>{
        cb(null,socket,files)
      })
    },
    (socket,files, cb) => {
      async.eachLimit(files, 10, (filename, done) => {
        var filePath = path.join(label_path, filename)
        var stream = ss.createStream()
        ss(socket).emit('send-images', stream, {
          'name': filename,
          'label': label
        })
        fs.createReadStream(filePath).pipe(stream)
        done()
      }, cb)
    }
  ], (err) => {
    if(err){
      console.trace(err)
      res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})
module.exports = router
