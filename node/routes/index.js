var express = require('express');
var router = express.Router();

/* GET home page. */

var tempuser = { id : 'test'}
router.get('/', function(req, res, next) {
  res.render('index', {user: tempuser});
});

router.get('/upload',function(req,res,next){
  res.render('upload',{user: tempuser})
})

router.get('/convert',function(req,res,next){
  res.render('convert',{user: tempuser})
})

router.get('/train',function(req,res,next){
  res.render('train',{user: tempuser})
})

router.get('/compare',function(req,res,next){
  res.render('compare',{user: tempuser})
})

router.get('/mosaic',function(req,res,next){
  res.render('mosaic',{user:tempuser})
})

module.exports = router;
