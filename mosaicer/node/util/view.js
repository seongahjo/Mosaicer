const jade = require('jade');

exports.fileView = jade.compile([
  '- each file in newFile',
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
  '           i.max.fa.fa-plus-square-o',
].join('\n'));


exports.videoUploadView = jade.compile([
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
  '        input(type="file", name="files[]", multiple="multiple", title="Click to add Files")',
].join('\n'));

exports.videoView = jade.compile([
  '- each file in files',
  '  tr',
  '    td.last(onClick="video(\'#{file.name}\')")',
  '      i.fa.fa-file-video-o',
  '      |#{file.name}',
].join('\n'));

exports.mosaicView = jade.compile([
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
].join('\n'));

exports.feedbackView = jade.compile([
  '- each file in files',
  '  figure.imgcheckbox',
  '    .figure-content',
  '      img.face(src="util/img?folder=feedback&file=#{file.name}",data-src="holder.js/64x64")',
  '    figcaption',
  '      i.fa.fa-check.fa-5x',
  '    label',
  '      input(type="checkbox",id="feedback" name="feedback/#{file.name}")',
  '      |  Label',
].join('\n'));


exports.folderView = jade.compile([
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
].join('\n'));


exports.modelView = jade.compile([
  '- each file in files',
  '  tr(id="label-"+file.name)',
  '    td(onClick="label(\'#{file.name}\')")',
  '      i.fa.fa-folder',
  '      |  #{file.name}',
  'tr',
  '  td.last',
  '    button#compose.btn.btn-lg.btn-success.btn-block(type="button", onClick="mosaic()") MOSAIC',
].join('\n'));


exports.mosaicButtonView = jade.compile([
  'button#compose.btn.btn-lg.btn-success.btn-block(type="button", onClick="mosaic()") MOSAIC',
].join('\n'));
