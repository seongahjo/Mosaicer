var express = require('express');
var router = express.Router();
var async = require('async');
var connector=require('../util/connector');
/* GET home page. */
var tempuser = {
  id: 'user'
};
router.get('/', (req, res) => {
  'use strict';
  res.render('index', {
    user: tempuser
  });
});


router.get('/upload', (req, res) => {
  'use strict';
  res.render('upload', {
    user: tempuser
  });
});

router.get('/mosaic', (req, res) => {
  'use strict';
  res.render('mosaic', {
    user: tempuser
  });
});

router.get('/feedback', (req, res) => {
  'use strict';
  res.render('feedback', {
    user: tempuser
  });
});

router.get('/setting', (req, res) => {
  'use strict';
  res.render('setting', {
    user: tempuser
  });
});

router.get('/market', (req, res) => {
  'use strict';
  async.waterfall([
      connector.connect,
      (socket, cb) => {
        socket.emit('request-view');
        socket.on('receive-view', (datas) => {
          socket.close();
          cb(null, datas);
        });
      }
    ],
    (err, datas) => {
      if(err){
      console.trace(err);
      res.render('market', {
        user: tempuser,
        datas: []
      });
      }
      if (!err) {
        console.log(datas);
        res.render('market', {
          user: tempuser,
          datas: datas
        });
      }
    });

});

module.exports = router;
