const express = require('express');

const router = express.Router();
const path = require('path');
const fs = require('fs');
const util = require('util');
const connector = require('../util/connector');

router.get('/share-download', async (req, res) => {
  const { label } = req.query;
  try {
    const socket = await connector.connect();
    await connector.download(socket, label);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get('/share', async (req, res) => {
  const { label } = req.query;
  const labelZero = label[0];
  const labelPath = path.join('../image', labelZero);
  try {
    const socket = await connector.connect();
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(labelPath);
    files.forEach(async (file) => {
      await connector.share(socket, labelZero, file);
    });
    res.sendStatus(200);
  } catch (err) {
    console.trace(err);
    res.sendStatus(400);
  }
});
module.exports = router;
