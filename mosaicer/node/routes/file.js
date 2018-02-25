var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var view = require('../util/view');
var mime = require('../util/mime');
var fu = require('../util/file');
var async = require('async');



router.get('/', (req, res) => {
  'use strict';
  var folder = req.query.folder;
  var realPath = path.join('../', 'image', folder);
  fs.readdir(realPath, (error, files) => {
    if (error) {
      console.log(error);
      return;
    }

    for (var i = 0; i < files.length; i++) {
      files[i] = mime.stat(folder, files[i]);
    }

    res.send(view.fileView({
      files: files,
      folder: folder
    }));
  });

});

router.get('/video_upload', (req, res) => {
  'use strict';
  res.send(view.videoUploadView());
});



router.get('/video', (req, res) => {
  'use strict';
  var Path = path.join('../', 'video');
  var result = [];
  fu.make(Path);

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {}; // file detail info
      var stat = fs.statSync(path.join(Path, file));
      if (!stat.isDirectory() && file !== '.temp') {
        filedetail.name = file;
        result.push(filedetail);
      }
      callback(null);
    }, function() {
      res.send(view.videoView({
        files: result
      }));
    });
  });
});



router.get('/mosaic', (req, res) => {
  'use strict';
  //var Path = path.join('/tmp/', id, 'video')
  var Path = path.join('../', 'video');
  var statePath = path.join(Path, 'result');
  var result = [];

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {}; // file detail info
      var stat = fs.statSync(path.join(Path, file));
      if (!stat.isDirectory() && path.extname(file) === '.avi') {
        filedetail.name = file;
        filedetail.size = stat.size;
        filedetail.state = 'Mosaic';
        fs.readdir(statePath, (err, resultFiles) => {
          async.eachSeries(resultFiles, (resultFile, inside) => {
            if (resultFile === file) {
              filedetail.state = 'Download';
            }
            inside();
          });
          result.push(filedetail);
          callback();
        });
      } else
        callback();
    }, function() {
      res.send(view.mosaicView({
        files: result
      }));
    });
  });
});



router.get('/feedback_face', (req, res) => {
  'use strict';
  var Path = path.join('../feedback');
  var result = [];
  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {}; // file detail info
      var stat = fs.statSync(path.join(Path, file));
      console.log(mime.ext(file));
      if (!stat.isDirectory() && mime.ext(file) === 'image') {
        filedetail.name = path.basename(file, path.extname(file));
        result.push(filedetail);
      }
      callback();
    }, function() {
      res.send(view.feedbackView({
        files: result
      }));
    });
  });
});





router.get('/folder', (req, res) => {
  'use strict';
  var Path = path.join('../', 'image');
  var result = [];
  fu.make(Path);
  // Path => function(err,files)
  // (files,function )

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {}; // file detail info
      var stat = fs.statSync(path.join(Path, file));
      if (stat.isDirectory()) {
        filedetail.name = file;
        result.push(filedetail);
      }
      callback(null);
    }, function() {
      res.send(view.folderView({
        files: result
      }));
    });
  });
});




router.get('/model', (req, res) => {
  'use strict';
  var Path = path.join('../', 'image');
  var result = [];
  fu.make(Path);

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {}; // file detail info
      var stat = fs.statSync(path.join(Path, file));
      if (stat.isDirectory()) {
        filedetail.name = file;
        result.push(filedetail);
      }
      callback(null);
    }, function() {
      res.send(view.modelView({
        files: result
      }));
    });
  });
});


router.get('/mosaic_button', (req, res) => {
  'use strict';
  res.send(view.mosaicButtonView());
});


module.exports = router;
