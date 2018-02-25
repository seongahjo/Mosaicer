var express = require('express');
var router = express.Router();
var ss = require('socket.io-stream');
var path= require('path');
var fs=require('fs');
var async = require('async');
var connector=require('../util/connector');
var fu = require('../util/file');
router.get('/share-download',(req,res)=>{
  'use strict';
  var label= req.query.label;
  async.waterfall([
    connector.connect,
    (socket,cb)=>{
      var labelPath=path.join('../image',label);
      fu.make(labelPath);
      socket.emit('download-images', label);
      ss(socket).on('send-images',(stream,data)=>{
        var filename = path.basename(data.filename);
        stream.pipe(fs.createWriteStream(path.join(labelPath,filename)));
      });
      cb();
    }
  ],(err)=>{
    if(err)
    res.sendStatus(400);
    else
    res.sendStatus(200);
  });
});

router.get('/share', (req, res) => {
  'use strict';
  var label = req.query.label;
  label=label[0];
  var labelPath = path.join('../image', label);
  console.log(labelPath);
  async.waterfall([
    connector.connect,
    (socket,cb) => {
      fs.readdir(labelPath, (err,files)=>{
        cb(null,socket,files);
      });
    },
    (socket,files, cb) => {
      async.eachLimit(files, 10, (filename, done) => {
        var filePath = path.join(labelPath, filename);
        var stream = ss.createStream();
        ss(socket).emit('send-images', stream, {
          'name': filename,
          'label': label
        });
        fs.createReadStream(filePath).pipe(stream);
        done();
      }, cb);
    }
  ], (err) => {
    if(err){
      console.trace(err);
      res.sendStatus(400);
    }
    res.sendStatus(200);
  });
});
module.exports = router;
