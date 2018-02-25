var express = require('express');
var fs = require('fs');
var path = require('path')
var router = express.Router();
var jade = require('jade');
var mime = require('../util/mime');
var fu=require('../util/file')
var async = require('async')
var readline=require('readline')


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


router.get('/', (req, res, next) => {
  var folder = req.query.folder
  var realPath = path.join('../', 'image', folder)
  fs.readdir(realPath, (error, files) => {
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


router.get('/video_upload', (req, res, next) => {
  res.send(video_upload_view())
})

var video_view = jade.compile([
  '- each file in files',
  '  tr',
  '    td.last(onClick="video(\'#{file.name}\')")',
  '      i.fa.fa-file-video-o',
  '      |#{file.name}',
].join('\n'))



router.get('/video', (req, res, next) => {
  var Path = path.join('../', 'video')
  var result = []

  fu.make(Path)

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory() && file != ".temp") {
        filedetail.name = file
        result.push(filedetail)
      }
      callback(null)

    }, function() {
      res.send(video_view({
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

router.get('/mosaic', (req, res, next) => {
  //var Path = path.join('/tmp/', id, 'video')
  var Path = path.join('../', 'video')
  var statePath = path.join(Path, 'result')
  var result = []

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (!stat.isDirectory() && path.extname(file) == '.avi') {
        filedetail.name = file
        filedetail.size = stat.size
        filedetail.state = 'Mosaic'
        fs.readdir(statePath, (err, resultFiles)=> {
          async.eachSeries(resultFiles, (resultFile, inside) =>{
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





var feedback_face_view = jade.compile([
  '- each file in files',
  '  figure.imgcheckbox',
  '    .figure-content',
  '      img.face(src="util/img?folder=feedback&file=#{file.name}",data-src="holder.js/64x64")',
  '    figcaption',
  '      i.fa.fa-check.fa-5x',
  '    label',
  '      input(type="checkbox",id="feedback" name="feedback/#{file.name}")',
  '      |  Label',
].join('\n'))

router.get('/feedback_face', (req, res, next) => {
  var Path = path.join('../feedback')
  var result = []
  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      console.log(mime.ext(file))
      if (!stat.isDirectory() && mime.ext(file)=='image') {
        filedetail.name = path.basename(file, path.extname(file))
        result.push(filedetail)
      }

      callback()
    }, function() {
      res.send(feedback_face_view({
        files: result
      }))
    })
  })


})





var folder_view = jade.compile([
  '- each file in files',
  '  a(href="#" onClick="folder(\'#{file.name}\')")',
  '    .mail_list',
  '      .left',
  '        i.fa.fa-folder',
  '      .right',
  '        h3',
  '          | #{file.name}',
  '        p',
  '          |content',
].join('\n'))

router.get('/folder', (req, res, next) => {
  var Path = path.join('../', 'image')
  var result = []
  fu.make(Path)
  // Path => function(err,files)
  // (files,function )

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (stat.isDirectory()) {
        filedetail.name = file
        result.push(filedetail)
      }
        callback(null)
    }, function() {
      res.send(folder_view({
        files: result
      }))
    });
  })
})


var model_view = jade.compile([
  '- each file in files',
  '  tr(id="label-"+file.name)',
  '    td(onClick="label(\'#{file.name}\')")',
  '      i.fa.fa-folder',
  '      |  #{file.name}',
  'tr',
  '  td.last',
  '    button#compose.btn.btn-lg.btn-success.btn-block(type="button", onClick="mosaic()") MOSAIC',
].join('\n'))



router.get('/model', (req, res, next) => {
  var Path = path.join('../', 'image')
  var result = []
  fu.make(Path)

  fs.readdir(Path, (error, files) => {
    async.eachSeries(files, (file, callback) => {
      var filedetail = {} // file detail info
      var stat = fs.statSync(path.join(Path, file))
      if (stat.isDirectory()) {
        filedetail.name = file
        result.push(filedetail)
      }
        callback(null)
    }, function() {
      res.send(model_view({
        files: result
      }))
    });
  })
})


var mosaic_button_view = jade.compile([
  'button#compose.btn.btn-lg.btn-success.btn-block(type="button", onClick="mosaic()") MOSAIC'
].join('\n'))

router.get('/mosaic_button', (req, res, next) => {
  res.send(mosaic_button_view())
})


module.exports = router
