var express = require('express');
var fs= require('fs')
var router = express.Router();
var path=require('path')
/* GET  listing. */
router.get('/img/:folder/:name', function(req, res, next) {
  var folder_name =req.params.folder
  var file_name=req.params.name;
  var p=path.join('../','image',folder_name)
  console.log(p)
  var filename=path.join(p,file_name+'.jpg')
  console.log(filename)
  fs.readFile(filename,function(err,data){
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end(data)
  })
});



module.exports = router;
