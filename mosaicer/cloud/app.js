var io = require('socket.io').listen(1234)
var ss = require('socket.io-stream')
var path = require('path')
var fs = require('fs')
var async = require('async')
var mkdirp = require('mkdirp')
io.on('connection', (socket) => {
  /**
   * @method connect
   * @param
   */
  console.log('connected')

  ss(socket).on('send-images', (stream, data) => {
    var dirname = path.join('image', data.label)
    if (!fs.existsSync(dirname))
      mkdirp.sync(dirname, (err) => {})
    var filename = path.basename(data.name)
    stream.pipe(fs.createWriteStream(path.join(dirname, filename)))
  })

  socket.on('download-images', (label) => {
    console.log('donwload-image start')
    data_dir = path.join('image', label)
    async.waterfall([
      (cb) => {
        fs.readdir(data_dir, cb)
      },
      (files, cb) => {
        async.eachLimit(files, 10, (filename, done) => {
          console.log(filename)
          var filePath = path.join(data_dir, filename)
          var stream = ss.createStream()
          ss(socket).emit('send-images', stream, {
            'label': label,
						'filename':filename
          })
          fs.createReadStream(filePath).pipe(stream)
          done()
        }, cb)
      }
    ], (err) => {
      err && console.trace(err)
			console.log('download done')
    })
  })
  socket.on('request-view', (data) => {
    var dirname = path.join('image')
    var result = []
    async.waterfall([
      (cb) => {
        fs.readdir(dirname, cb)
      },
      (labels, cb) => {
        if (!labels) cb()
        async.each(labels, (label, done) => {
          var label_path=path.join(dirname,label)
          fs.readdir(label_path, (err, files) => {
            if (files) {
              console.log(files)
              result.push({
                'path': label,
                'name': path.basename(files[0],path.extname(files[0]))
              })
            } else {
              result.push({
                'path': label,
                'name': 'empty',
              })
            }
            done()
          })
        }, (err) => {
          err && console.trace(err)
          console.log('good?')
          cb()
        })
      }
    ], (err) => {
      err && console.trace(err)
      //console.log(result)
      socket.emit('receive-view', result)
    })
  })
})
