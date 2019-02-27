const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');

const router = express.Router();
const view = require('../util/view');
const mime = require('../util/mime');
const fu = require('../util/file');
const async = require('async');

const readdir = util.promisify(fs.readdir);

router.get('/', async (req, res) => {
  const { folder } = req.query;
  const realPath = path.join('../', 'image', folder);
  const newFile = [];
  const files = await readdir(realPath);
  for (let i = 0; i < files.length; i += 1) {
    newFile.push(mime.stat(folder, files[i]));
  }
  console.log(newFile);
  res.send(view.fileView({
    newFile,
    folder,
  }));
});

router.get('/video_upload', (req, res) => {
  res.send(view.videoUploadView());
});

router.get('/mosaic', (req, res) => {
  // var Path = path.join('/tmp/', id, 'video')
  const Path = path.join('../', 'video');
  const statePath = path.join(Path, 'result');
  const result = [];

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      const filedetail = {}; // file detail info
      const stat = fs.statSync(path.join(Path, file));
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
      } else { callback(); }
    }, () => {
      res.send(view.mosaicView({
        files: result,
      }));
    });
  });
});


router.get('/feedback_face', (req, res) => {
  const Path = path.join('../feedback');
  const result = [];
  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      const filedetail = {}; // file detail info
      const stat = fs.statSync(path.join(Path, file));
      console.log(mime.ext(file));
      if (!stat.isDirectory() && mime.ext(file) === 'image') {
        filedetail.name = path.basename(file, path.extname(file));
        result.push(filedetail);
      }
      callback();
    }, () => {
      res.send(view.feedbackView({
        files: result,
      }));
    });
  });
});


router.get('/folder', (req, res) => {
  const Path = path.join('../', 'image');
  const result = [];
  fu.make(Path);
  // Path => function(err,files)
  // (files,function )

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      const filedetail = {}; // file detail info
      const stat = fs.statSync(path.join(Path, file));
      if (stat.isDirectory()) {
        filedetail.name = file;
        result.push(filedetail);
      }
      callback(null);
    }, () => {
      res.send(view.folderView({
        files: result,
      }));
    });
  });
});


router.get('/model', (req, res) => {
  const Path = path.join('../', 'image');
  const result = [];
  fu.make(Path);

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      const filedetail = {}; // file detail info
      const stat = fs.statSync(path.join(Path, file));
      if (stat.isDirectory()) {
        filedetail.name = file;
        result.push(filedetail);
      }
      callback(null);
    }, () => {
      res.send(view.modelView({
        files: result,
      }));
    });
  });
});


router.get('/mosaic_button', (req, res) => {
  res.send(view.mosaicButtonView());
});


module.exports = router;
