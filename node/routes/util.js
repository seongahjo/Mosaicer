var express = require('express');
var fs = require('fs')
var router = express.Router();
var path = require('path')
/* GET  listing. */
<<<<<<< HEAD
router.get('/img', (req,res,next)=>{
=======
router.get('/img', function(req, res, next) {
>>>>>>> ce28ec475ea36cb26525a8a77bc71141da268019
  var folder_name = req.query.folder
  var file_name = req.query.file;

  var p = path.join('../', 'image', folder_name)
<<<<<<< HEAD
  var filename = path.join(p, file_name+".jpg")
  
=======
  console.log(p)
  var filename = path.join(p, file_name+".jpg")
  console.log(filename)
>>>>>>> ce28ec475ea36cb26525a8a77bc71141da268019
  console.log('folder '+folder_name + 'file :' +file_name)
  if(!fs.existsSync(filename)){
  res.sendStatus(404)
  return
  }
  try {
<<<<<<< HEAD
    fs.readFile(filename, (err,data)=> {
=======
    fs.readFile(filename, function(err, data) {
>>>>>>> ce28ec475ea36cb26525a8a77bc71141da268019
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    })
  } catch (err) {
    console.log(err)
  }
});


<<<<<<< HEAD

=======
>>>>>>> ce28ec475ea36cb26525a8a77bc71141da268019
module.exports = router;
