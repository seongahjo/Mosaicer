var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload',function(req,res,next){
  res.render('upload')
})

router.get('/convert',function(req,res,next){
  res.render('convert')
})

router.get('/train',function(req,res,next){
  res.render('train')
})

module.exports = router;
