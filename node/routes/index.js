var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
/* GET home page. */

var tempuser = { id : 'test'}
router.get('/', function(req, res, next) {
//  res.render('index', {user: tempuser});
  res.render('login')
});

router.post('/login',function(req,res,next){
  console.log('id : '+req.body.id)
  console.log('pw : '+req.body.pw)
  //authorization
  tempuser={id : req.body.id}
  // login
  res.render('index',{user : tempuser})
})

router.post('/signup',function(req,res,next){
  var id= req.body.id
  var name= req.body.name
  var pw = req.body.pw
  console.log('id : ' + id)
  console.log('name : '+ name)
  console.log('pw : '+ pw)
  // make user
  var Path=path.join('/tmp/',id)
  console.log(Path)
  fs.existsSync(Path) || fs.mkdirSync(Path);

  Path=path.join(Path,'upload')
  fs.existsSync(Path) || fs.mkdirSync(Path);
  
  res.redirect('/')
})


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
