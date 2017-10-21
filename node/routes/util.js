var express = require('express');
var fs= require('fs')
var router = express.Router();
var path=require('path')
/* GET  listing. */
router.get('/img/:video/:name', function(req, res, next) {
  var video_name =req.params.video
  var file_name=req.params.name;
  console.log(file_name)
  var p=path.join('../','image',video_name,'etc')
  console.log(p)
  var filename=path.join(p,file_name)
  console.log(filename)
  fs.readFile(filename,function(err,data){
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end(data)
  })
});

module.exports = router;
