var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
/* GET home page. */

var tempuser = { id : 'user'}
/*router.get('/', function(req, res, next) {
//  res.render('index', {user: tempuser});
  res.render('login')
});*/
var Path='../image'
fs.existsSync(Path) || fs.mkdirSync(Path);
router.get('/',function(req,res,next){

/*  console.log('id : '+req.body.id)
  console.log('pw : '+req.body.pw)*/
  var id='test'
  // login Failed
  /*console.log(Path)
  if(!fs.existsSync(Path))
  res.sendStatus(404)*/
  //authorization
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

  // make Folder
  var Path=path.join('/tmp/',id)
  console.log(Path)

  fs.existsSync(Path) || fs.mkdirSync(Path)

  uploadPath=path.join(Path,'upload')
  fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath)

  videoPath=path.join(Path,'video')
  fs.existsSync(videoPath) || fs.mkdirSync(videoPath)

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

router.get('/feedback',function(req,res,next){
  res.render('feedback',{user:tempuser})
})

router.get('/mosaic',function(req,res,next){
  res.render('mosaic',{user:tempuser})
})

router.get('/feedback-face',function(req,res,next){
  var video_name=req.query.video
  res.render('feedback-face',{user:tempuser,video:video_name})
})

router.get('/setting',function(req,res,next){
  res.render('setting',{user:tempuser})
})

module.exports = router;
