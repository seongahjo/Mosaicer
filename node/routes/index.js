var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var fu=require('../util/file')
/* GET home page. */

var tempuser = {
  id: 'user'
}
var Path = '../image'
fu.make(Path)
router.get('/', (req,res,next)=> {
  var id = 'test'
  res.render('index', {
    user: tempuser
  })
})

router.post('/signup', (req,res,next)=> {
  var id = req.body.id
  var name = req.body.name
  var pw = req.body.pw
  console.log('id : ' + id)
  console.log('name : ' + name)
  console.log('pw : ' + pw)
  // make user

  // make Folder
  var Path = path.join('/tmp/', id)
  console.log(Path)
  fu.make(Path)

  uploadPath = path.join(Path, 'upload')
  fu.make(uploadPath)

  videoPath = path.join(Path, 'video')
  fu.make(videoPath)
  res.redirect('/')
})


router.get('/upload', (req,res,next)=> {
  res.render('upload', {
    user: tempuser
  })
})

router.get('/convert', (req,res,next)=> {
  res.render('convert', {
    user: tempuser
  })
})

router.get('/train', (req,res,next)=> {
  res.render('train', {
    user: tempuser
  })
})

router.get('/compare', (req,res,next)=> {
  res.render('compare', {
    user: tempuser
  })
})

router.get('/feedback', (req,res,next)=> {
  res.render('feedback', {
    user: tempuser
  })
})

router.get('/mosaic', (req,res,next)=> {
  res.render('mosaic', {
    user: tempuser
  })
})

router.get('/feedback-face', (req,res,next)=> {
  var video_name = req.query.video
  res.render('feedback-face', {
    user: tempuser,
    video: video_name
  })
})

router.get('/setting', (req,res,next)=> {
  res.render('setting', {
    user: tempuser
  })
})

module.exports = router;
