var express = require('express');
var fs = require('fs');
var path = require('path')
var router = express.Router();
var jade = require('jade');
var mime = require('../util/mime');
var async = require('async')

var file_view = jade.compile([
    '- each file in files',
    '  div.file(type="#{file.type}", dir="#{file.dir}")',
    '    div.icon',
    '      img(src="img/#{file.type}.png")',
    '    div.name #{file.name}',
    '-  if(folder==="upload")',
    '     div.file(type="makeDir", dir="#{folder}")',
    '       div.icon',
    '         a(href="#",data-toggle="modal", data-target=".bs-example-modal-sm")',
    '           i.max.fa.fa-plus-square-o'
].join('\n'))

router.get('/', function(req, res, next) {
    var id = req.query.id
    var folder = req.query.folder
    var realPath = path.join('/tmp/', id, folder)
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
            folder:folder
        }))
    })

})


var convert_view = jade.compile([
    '- each file in files',
    '  tr',
    '    td',
    '      i.fa.fa-folder',
    '      |#{file.name}',
    '    td',
    '      |#{file.amount}',
    '    td',
    '      input(id="btn_#{file.name}",type="number", min="0", max="9",maxlength = "1",oninput="maxLengthCheck(this)")',
    '    td.last',
    '      a.btn.btn-primary.btn-xs(href="#" onClick="convert(defaultId,\'#{file.name}\')") Convert',
].join('\n'))


router.get('/convert', function(req, res, next) {
    var id = req.query.id
    var Path = path.join('/tmp/', id, 'upload')
    var result = []
    fs.readdir(Path, function(error, files) {
        async.eachSeries(files, function iteratee(file, callback) {
            var filedetail = {} // file detail info
            var stat = fs.statSync(path.join(Path, file))
            if (stat.isDirectory()) {
                filedetail.name = file
                fs.readdir(path.join(Path, file), function(error, filess) {
                    filedetail.amount = filess.length;
                    result.push(filedetail)
                    callback(null)
                })
            } else {
                callback(null)
            }

        }, function() {
            res.send(convert_view({
                files: result
            }))
        });

    })
})


var train_view = jade.compile([
    '- each file in files',
    '  tr',
    '    td',
    '      i.fa.fa-folder',
    '      |#{file.name}',
    '    td',
    '      |#{file.amount}',
    '    td',
    '      |#{file.size} MB',
    '    td.last',
    '      -  if (file.state === "Trained")',
    '        button.btn.btn-success.btn-xs(type="button") #{file.state}',
    '      -  else',
    '        button.btn.btn-warning.btn-xs(type="button") #{file.state}'
].join('\n'))




router.get('/train', function(req, res, next) {
    var id = req.query.id
    var Path = path.join('/tmp/', id, 'upload')
    var statePath = path.join(Path, 'state.json')
    var state = {}
    var result = []
    var size=0;
    fs.existsSync(Path) || fs.mkdirSync(Path);
    fs.existsSync(statePath) || fs.writeFileSync(statePath, '{}')
    stateData = fs.readFileSync(statePath, 'utf8')
    if (stateData != undefined && stateData != '')
        state = JSON.parse(stateData)
    fs.readdir(Path, function(error, files) {
        async.eachSeries(files, function iteratee(file, callback) {
            var filedetail = {} // file detail info
            var stat = fs.statSync(path.join(Path, file))
            if (stat.isDirectory()) {
                filedetail.name = file
                fs.readdir(path.join(Path, file), function(error, filess) {
                    filedetail.amount = filess.length;
                    for(i=0; i<filess.length;i++){
                      var filestat = fs.statSync(path.join(Path,file, filess[i]))
                      size+=Math.floor(parseInt(filestat["size"])/1024,0)
                    }
                    filedetail.size=size
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
    /*
    fs.readdir(Path, function(error, files) {
        async.eachSeries(files, function iteratee(file, callback) {
            var filedetail = {} // file detail info
            var stat = fs.statSync(path.join(Path, file))
            if (!stat.isDirectory()) {
                var ext = path.extname(file || '').split('.');
                ext = ext[ext.length - 1]
                if (ext == 'bin') {
                    filedetail.name = file
                    filedetail.size = stat["size"]
                    filedetail.label = file.split('train')[1].charAt(0)
                        //if (Object.keys(state).length != 0) {
                        //Optimization 필요
                    filedetail.state = 'Wait'
                    async.eachSeries(state.names, function iteratee(key, inside) {
                            if (filedetail.state != 'Trained') {
                                if (key.name == file) {
                                    filedetail.state = 'Trained'
                                }
                            }
                            inside(null)
                        })
                        //  }
                }
                if (Object.keys(filedetail).length != 0) {
                    result.push(filedetail)
                }
                callback(null)
            }*/



var mosaic_view = jade.compile([
    '- each file in files',
    '  tr',
    '    td',
    '      i.fa.fa-file-video-o',
    '      |#{file.name}',
    '    td',
    '      |#{file.size}',
    '    td',
    '      input(id="btn_#{file.name}",type="number", min="0", max="9",maxlength = "1",oninput="maxLengthCheck(this)")',
    '    td.last',
    '      -  if (file.state === "Mosaic")',
    '        button.btn.btn-success.btn-xs(type="button" onClick="mosaic(defaultId,\'#{file.name}\')") Mosaic',
    '      -  else',
    '        button.btn.btn-warning.btn-xs(type="button"  onClick="download(defaultId,\'#{file.name}\')") Download',
].join('\n'))

router.get('/mosaic', function(req, res, next) {
    var id = req.query.id
    var Path = path.join('/tmp/', id, 'video')
    var statePath = path.join(Path, 'result')
    var result = []

    fs.readdir(Path, function(error, files) {
        async.eachSeries(files, function iteratee(file, callback) {
            var filedetail = {} // file detail info
            var stat = fs.statSync(path.join(Path, file))
            if (!stat.isDirectory()) {
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



module.exports = router
