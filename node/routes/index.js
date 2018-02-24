var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
/* GET home page. */

var tempuser = {
  id: 'user'
}
router.get('/', (req,res,next)=> {
  var id = 'test'
  res.render('index', {
    user: tempuser
  })
})


router.get('/upload', (req,res,next)=> {
  res.render('upload', {
    user: tempuser
  })
})

router.get('/mosaic', (req,res,next)=> {
  res.render('mosaic', {
    user: tempuser
  })
})

router.get('/feedback', (req,res,next)=> {
  res.render('feedback', {
    user: tempuser
  })
})

router.get('/setting', (req,res,next)=> {
  res.render('setting', {
    user: tempuser
  })
})

router.get('/market', (req,res,next)=> {
  res.render('market', {
    user: tempuser
  })
})

module.exports = router;
