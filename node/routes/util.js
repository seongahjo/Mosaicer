var express = require('express');
var fs = require('fs')
var router = express.Router();
var path = require('path')
/* GET  listing. */
router.get('/img', function(req, res, next) {
  var folder_name = req.query.folder
  var file_name = req.query.file;

  var p = path.join('../', 'image', folder_name)
  console.log(p)
  var filename = path.join(p, file_name+".jpg")
  console.log(filename)
  console.log('folder '+folder_name + 'file :' +file_name)
  if(!fs.existsSync(filename)){
  res.sendStatus(404)
  return
  }
  try {
    fs.readFile(filename, function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    })
  } catch (err) {
    console.log(err)
  }
});


module.exports = router;
