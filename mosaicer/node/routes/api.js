const express = require('express');

const router = express.Router();
const path = require('path');
const axios = require('axios');
const multer = require('multer');

const pythonServer = 'http://localhost:9999/';
const async = require('async');
const mime = require('../util/mime');
const fu = require('../util/file');

const uploadstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    const result = mime.stat(req.body.folder, file.originalname);
    console.log(result);
    if (result.type === 'image') { folder = path.join('../', 'image', req.body.folder); } else if (result.type === 'movie') { folder = path.join('../', 'video'); }
    console.log(`upload to ${folder}`);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: uploadstorage,
});


router.get('/makeFolder', (req, res) => {
  console.log('makeFolder start');
  const dir = path.join('../', 'image', req.query.folder);
  console.log('makeFolder ing...');
  fu.make(dir);

  console.log(`makeFolder : ${dir}`);
  res.sendStatus(200);
  // res.send(dir)
});


router.get('/delete', (req, res) => {
  const { files } = req.query;
  console.log(`${files} to delete`);
  async.eachSeries(files, (file, fcallback) => {
    const Path = path.join('../', 'image', file);
    fu.remove(Path);
    fcallback();
  });
  res.sendStatus(200);
});


router.get('/feedback', (req, res) => {
  const { files } = req.query;
  let dest = req.query.to;
  dest = path.join('../', 'image', dest, '/');
  console.log(`${files} to ${dest}`);
  try {
    async.eachSeries(files, (file, fcallback) => {
      const Path = path.join('../', file);
      fu.move(Path, path.join(dest, path.basename(file)), {
        overwrite: true,
      });
      fcallback();
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
});

router.get('/paste', (req, res) => {
  const srcs = req.query.src;
  let dest = req.query.to;
  dest = path.join('../', 'image', dest, '/');
  console.log(`${srcs} to ${dest}`);
  try {
    async.eachSeries(srcs, (src, fcallback) => {
      const Path = path.join('../', 'image', src);
      fu.copy(Path, path.join(dest, path.basename(src)));
      fcallback();
    });
  } catch (err) {
    console.log(err);
  }
  res.sendStatus(200);
});

router.post('/upload', upload.single('file'), (req, res) => {
  const data = {
    path: req.file.path,
  };
  axios.get(`${pythonServer}tracker`, {
    params: data,
  }).then((response) => {
    console.log(response.data);
    res.json(response.data);
  });
});

router.post('/videoUpload', upload.single('file'), (req, res) => {
  res.json(req.file.originalname);
});

router.get('/mosaic', (req, res) => {
  const { filename } = req.query;
  const label = req.query.labels;
  console.log(label);
  const trainDir = 'model';
  const videoPath = path.join('video', filename);
  const data = {
    train_dir: trainDir,
    video_path: videoPath,
    label,
  };
  const trainData = {
    data_dir: 'image',
    train_dir: trainDir,
  };
  console.log(`${filename} ${label}`);
  axios.get(`${pythonServer}train`, {
    params: trainData,
  }).then(() => {
    axios.get(`${pythonServer}mosaic`, {
      params: data,
    }).then((response) => {
      console.log(response.data);
      res.json(response.data);
    });
  });
});


router.get('/download', (req, res) => {
  const { filename } = req.query;
  const Path = path.join('../', 'video', 'result', filename);
  console.log(Path);
  res.download(Path);
});


module.exports = router;
