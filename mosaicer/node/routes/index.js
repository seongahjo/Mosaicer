const express = require('express');

const router = express.Router();
const connector = require('../util/connector');
/* GET home page. */
const tempuser = {
  id: 'user',
};
router.get('/', (req, res) => {
  console.log('bug?');
  res.render('index', {
    user: tempuser,
  });
});


router.get('/upload', (req, res) => {
  res.render('upload', {
    user: tempuser,
  });
});

router.get('/mosaic', (req, res) => {
  res.render('mosaic', {
    user: tempuser,
  });
});

router.get('/feedback', (req, res) => {
  res.render('feedback', {
    user: tempuser,
  });
});

router.get('/setting', (req, res) => {
  res.render('setting', {
    user: tempuser,
  });
});

router.get('/market', async (req, res) => {
  try {
    const socket = await connector.connect();
    const datas = await connector.receive(socket);
    res.render('market', {
      user: tempuser,
      datas,
    });
  } catch (err) {
    console.trace(err);
    res.render('market', {
      user: tempuser,
      datas: [],
    });
  }
});

module.exports = router;
