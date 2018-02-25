var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var io = require('socket.io-client')
var async = require('async')
var connector=require('../util/connector')
/* GET home page. */
var tempuser = {
  id: 'user'
}
router.get('/', (req, res, next) => {
  var id = 'test'
  res.render('index', {
    user: tempuser
  })
})


router.get('/upload', (req, res, next) => {
  res.render('upload', {
    user: tempuser
  })
})

router.get('/mosaic', (req, res, next) => {
  res.render('mosaic', {
    user: tempuser
  })
})

router.get('/feedback', (req, res, next) => {
  res.render('feedback', {
    user: tempuser
  })
})

router.get('/setting', (req, res, next) => {
  res.render('setting', {
    user: tempuser
  })
})

router.get('/market', (req, res, next) => {
  var socket;
  async.waterfall([
      connector.connect,
      (socket, cb) => {
        socket.emit('request-view')
        socket.on('receive-view', (datas) => {
          socket.close()
          cb(null, datas)
        })
      }
    ],
    (err, datas) => {
      if(err){
      console.trace(err)
      res.render('market', {
        user: tempuser,
        datas: []
      })
      }
      if (!err) {
        console.log(datas)
        res.render('market', {
          user: tempuser,
          datas: datas
        })
      }
    })

})

module.exports = router;
