var express = require('express');
var router = express.Router();
var path = require('path');
var axios = require('axios');
var multer = require('multer');
var pythonServer = 'http://localhost:9999/';
var async = require('async');
var mime = require('../util/mime');
var fu = require('../util/file');


var uploadstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    'use strict';
    var folder = '';
    var result = mime.stat(req.body.folder, file.originalname);
    console.log(result);
    if (result.type === 'image')
      folder = path.join('../', 'image', req.body.folder);
    else if (result.type === 'movie')
      folder = path.join('../', 'video');
    console.log('upload to ' + folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    'use strict';
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: uploadstorage
});


router.get('/makeFolder', (req, res) => {
  'use strict';
  console.log('makeFolder start');
  var folder = req.query.folder;
  var dir = path.join('../', 'image', folder);
  console.log('makeFolder ing...');
  fu.make(dir);

  console.log('makeFolder : ' + dir);
  res.sendStatus(200);
  //res.send(dir)
});


router.get('/delete', (req, res) => {
  'use strict';
  var files = req.query.files;
  console.log(files + ' to delete');
  async.eachSeries(files, (file, fcallback) => {
    var Path = path.join('../', 'image', file);
    fu.remove(Path);
    fcallback();
  });
  res.sendStatus(200);
});


router.get('/feedback', (req, res) => {
  'use strict';
  var files = req.query.files;
  var dest = req.query.to;
  dest = path.join('../', 'image', dest, '/');
  console.log(files + ' to ' + dest);
  try {
    async.eachSeries(files, (file, fcallback) => {
      var Path = path.join('../', file);
      fu.move(Path, path.join(dest, path.basename(file)), {
        overwrite: true
      });
      fcallback();
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

router.get('/paste', (req, res) => {
  'use strict';
  var srcs = req.query.src;
  var dest = req.query.to;
  dest = path.join('../', 'image', dest, '/');
  console.log(srcs + ' to ' + dest);
  try {
    async.eachSeries(srcs, (src, fcallback) => {
      var Path = path.join('../', 'image', src);
      fu.copy(Path, path.join(dest, path.basename(src)));
      fcallback();
    });
  } catch (err) {
    console.log(err);
  }
  res.sendStatus(200);
});

router.post('/upload', upload.single('file'), (req, res) => {
  'use strict';
  var data = {
    'path': req.file.path
  };
  axios.get(pythonServer + 'tracker', {
    params: data
  }).then((response) => {
    console.log(response.data);
    res.json(response.data);
  });
});

router.post('/videoUpload', upload.single('file'), (req, res) => {
  'use strict';
  res.json(req.file.originalname);
});

router.get('/mosaic', (req, res) => {
  'use strict';
  var filename = req.query.filename;
  var label = req.query.labels;
  console.log(label);
  var trainDir = 'model';
  var videoPath = path.join('video', filename);
  var data = {
    'train_dir': trainDir,
    'video_path': videoPath,
    'label': label
  };
  var trainData = {
    'data_dir': 'image',
    'train_dir': trainDir
  };
  console.log(filename + ' ' + label);
  axios.get(pythonServer + 'train', {
    params: trainData,
  }).then(() => {
    axios.get(pythonServer + 'mosaic', {
      params: data
    }).then((response) => {
      console.log(response.data);
      res.json(response.data);
    });
  });
});


router.get('/download', (req, res) => {
  'use strict';
  var filename = req.query.filename;
  var Path = path.join('../', 'video', 'result', filename);
  console.log(Path);
  res.download(Path);
});


module.exports = router;
