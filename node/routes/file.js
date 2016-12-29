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
            files: files
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
    var Path = path.join('/tmp/', id,'upload')
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
    '      i.fa.fa-file-archive-o',
    '      |#{file.name}',
    '    td',
    '      |#{file.size}',
    '    td',
    '      |#{file.label}',
    '    td.last',
    '      button.btn.btn-warning.btn-xs(type="button") Wait',
].join('\n'))




router.get('/train', function(req, res, next) {
    var id = req.query.id
    var Path = path.join('/tmp/', id, 'data')
    var result = []
    fs.existsSync(Path) || fs.mkdirSync(Path);
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
                    filedetail.label = 1
                    result.push(filedetail)
                }
                callback(null)
            }
        }, function() {
            res.send(train_view({
                files: result
            }))
        });

    })
})

module.exports = router
