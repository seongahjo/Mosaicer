var express = require('express');
var fs = require('fs');
var path = require('path')
var router = express.Router();
var jade = require('jade');
var mime = require('../util/mime');
var async = require('async')

var file_view = jade.compile([
  '- each file in files',
  '  -  if(file.type==="image")',
  '       figure.imgcheckbox',
  '        .figure-content',
  '          img.face(src="util/img?folder=#{folder}&file=#{file.name}",data-src="holder.js/64x64")',
  '        figcaption',
  '          i.fa.fa-check.fa-5x',
  '        label',
  '          input(type="checkbox",id="upload" name="#{folder}/#{file.name}")',
  '          |  Label',
  '   -  else',
  '       div.file(type="#{file.type}", dir="#{file.dir}")',
  '         div.icon',
  '          img.box(src="img/#{file.type}.png")',
  '         div.name #{file.name}',
  '-  if(folder==="")',
  '     div.file(type="makeDir", dir="#{folder}")',
  '       div.icon',
  '         a(href="#",data-toggle="modal", data-target=".bs-example-modal-sm")',
  '           i.max.fa.fa-plus-square-o'
].join('\n'))

/*'  div.file(type="#{file.type}", dir="#{file.dir}")',
'    div.icon',
'      img.box(src="img/#{file.type}.png")',
'    div.name #{file.name}',*/

router.get('/', function(req, res, next) {
  var folder = req.query.folder
  var realPath=path.join('../','image',folder)
  //var realPath = path.join('/tmp/', id, folder)
  fs.readdir(realPath, function(error, files) {
    if (error) {
      console.log(error)
      return;
    }

    for (var i = 0; i < files.length; i++) {
      files[i] = mime.stat(folder, files[i])
    }

    res.send(file_view({
      files: files,
      folder: folder
    }))
  })

})





var train_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td',
  '      input.flat(type="checkbox",value="#{file.name}")',
  '    td',
  '      i.fa.fa-folder',
  '      |#{file.name}',
  '    td',
  '      |#{file.amount}',
  '    td.last',
  '      |#{file.size} KB',
  ].join('\n'))



var model_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td.last(onClick="model(\'#{file.name}\')")',
  '      i.fa.fa-folder',
  '      |#{file.name}',
  ].join('\n'))



router.get('/model', function(req, res, next) {
  var Path=path.join('../','model')
  var result = []

  if(!fs.existsSync(Path))
  res.send(404)
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (stat.isDirectory()) {
        filedetail.name = file
        result.push(filedetail)
        callback(null)
        } else {
        callback(null)
      }
    }, function() {
      res.send(model_view({
        files: result
      }))
    });
  })
})


var video_upload_view = jade.compile([
  '.x_content',
  '  #video-upload.uploader',
  '    | Drag and Drop Videos Here',
  '    br',
  '    |   or click to add videos using the input',
  '    br',
  '    .browser',
  '      label',
  '        span',
  '        | Click to open the file Browser',
  '        input(type="file", name="files[]", multiple="multiple", title="Click to add Files")'
  ].join('\n'))


  router.get('/video_upload', function(req, res, next) {
        res.send(video_upload_view())
  })

var video_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td.last(onClick="video(\'#{file.name}\')")',
  '      i.fa.fa-file-video-o',
  '      |#{file.name}',
  ].join('\n'))



router.get('/video', function(req, res, next) {
  var Path=path.join('../','video')
  var result = []

  if(!fs.existsSync(Path))
  res.send(404)
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory() && file!=".temp") {
        filedetail.name = file
        result.push(filedetail)
        callback(null)
        } else {
        callback(null)
      }
    }, function() {
      res.send(video_view({
        files: result
      }))
    });
  })
})


router.get('/train', function(req, res, next) {
  var Path=path.join('../','image')
  //var Path = path.join('/tmp/', id, 'upload')
  var statePath = path.join(Path, 'state.json')
  var state = {}
  var result = []
  var size = 0;
  fs.existsSync(Path) || fs.mkdirSync(Path);
  fs.existsSync(statePath) || fs.writeFileSync(statePath, '{}')
  stateData = fs.readFileSync(statePath, 'utf8')
  if (stateData != undefined && stateData != '')
    state = JSON.parse(stateData)
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      size=0
      if (stat.isDirectory()) {
        filedetail.name = file
        fs.readdir(path.join(Path, file), function(error, filess) {
          filedetail.amount = filess.length;
          for (i = 0; i < filess.length; i++) {
            var filestat = fs.statSync(path.join(Path, file, filess[i]))
            size += Math.floor(parseInt(filestat["size"]) / 1024, 0)
          }
          filedetail.size = size
          filedetail.state = 'Wait'
          async.eachSeries(state.names, function iteratee(key, inside) {
            if (filedetail.state != 'Trained') {
              if (key.name == file) {
                filedetail.state = 'Trained'
              }
            }
            inside(null)
          })
          result.push(filedetail)
          callback(null)
        })
      } else {
        callback(null)
      }
    }, function() {
      res.send(train_view({
        files: result
      }))
    });


  })
})


var mosaic_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td',
  '      i.fa.fa-file-video-o',
  '      |#{file.name}',
  '    td',
  '      |#{file.size}',
  '    td.last',
  '      -  if (file.state === "Mosaic")',
  '        span.label.label-success Not Mosaic',
  '      -  else',
  '        button.btn.btn-warning.btn-xs(type="button"  onClick="download(\'#{file.name}\')") Download',
].join('\n'))

router.get('/mosaic', function(req, res, next) {
  //var Path = path.join('/tmp/', id, 'video')
  var Path=path.join('../','video')
  var statePath = path.join(Path, 'result')
  var result = []

  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory() && path.extname(file)=='.avi') {
        filedetail.name = file
        filedetail.size = stat["size"]
        filedetail.state = 'Mosaic'
        fs.readdir(statePath, function(err, resultFiles) {
          async.eachSeries(resultFiles, function iteratee(resultFile, inside) {
            if (resultFile === file) {
              filedetail.state = 'Download'
            }
            inside()
          })
          result.push(filedetail)
          callback()
        })
      } else
        callback()
    }, function() {
      res.send(mosaic_view({
        files: result
      }))
    });

  })
})

var feedback_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td',
  '      i.fa.fa-file-video-o',
  '      |#{file.name}',
  '    td.last',
  '      a(href="feedback-face?video=#{file.path}")',
  '        button.btn.btn-warning.btn-xs(type="button") View',
].join('\n'))


router.get('/feedback', function(req, res, next) {
  var Path = path.join('../','video')
  var result = []
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory() &&  path.extname(file)=='.avi') {
        filedetail.name = file
        filedetail.path=path.basename(file,path.extname(file))
      }
      if(JSON.stringify(filedetail) != '{}') // json null check
      result.push(filedetail)
      callback()
    },function(){
      res.send(feedback_view({
        files: result
      }))

    })
  })
})





var feedback_face_view = jade.compile([
  '- each file in files',
  '  figure.imgcheckbox',
  '    .figure-content',
  '      img.face(src="util/img?folder=#{file.video}/etc&file=#{file.name}",data-src="holder.js/64x64")',
  '    figcaption',
  '      i.fa.fa-check.fa-5x',
  '    label',
  '      input(type="checkbox",id="feedback" name="#{file.video}/etc/#{file.name}")',
  '      |  Label',
].join('\n'))

router.get('/feedback_face', function(req, res, next) {
  var file_name=req.query.filename
  var Path = path.join('../image',file_name, 'etc')
  var result = []
  console.log(Path)
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory()) {
        filedetail.name = path.basename(file,path.extname(file))
        filedetail.video=file_name
      }
      result.push(filedetail)
      callback()
    },function(){
      res.send(feedback_face_view({
        files: result
      }))
    })
  })


})





var folder_view = jade.compile([
  '- each file in files',
  '  a(href="#" onClick="folder(\'#{video}\',\'#{file.name}\')")',
  '    .mail_list',
  '      .left',
  '        i.fa.fa-folder',
  '      .right',
  '        h3',
  '          | #{file.name}',
  '        p',
  '          |content',
].join('\n'))

router.get('/folder', function(req, res, next) {
  var Path=path.join('../','image')
  var result = []
 var video=req.query.video
  if(!fs.existsSync(Path))
  res.send(404)
  fs.readdir(Path, function(error, files) {
    async.eachSeries(files, function iteratee(file, callback) {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (stat.isDirectory()) {
        filedetail.name = file
        result.push(filedetail)
        callback(null)
        } else {
        callback(null)
      }
    }, function() {
      res.send(folder_view({
        files: result,
        video : video
      }))
    });
  })
})



var mosaic_button_view = jade.compile([
  'button#compose.btn.btn-lg.btn-success.btn-block(type="button", onClick="mosaic()") MOSAIC'
].join('\n'))

router.get('/mosaic_button', function(req, res, next) {
res.send(mosaic_button_view())
})


module.exports = router
