var currentfolder = '';
var defaultDir = ''
var trainFolder = []
var modelFile = ''
var videoFile = ''
var feedbackFile = []
var uploadFile=[]
$(document).ready(function() {
  Holder.run()

  $('input').on('ifChecked', function(event) {

    trainFolder.push(event.currentTarget.value)
    console.log(trainFolder)
  });

  $('input').on('ifUnchecked', function(event) {
    var i = trainFolder.indexOf(event.currentTarget.value);
    if (i != -1) {
      trainFolder.splice(i, 1);
    }
    console.log(trainFolder)
  });

  $('figure').on('click', function(event) {
    var figure = $(this)
    var input = $('input[type="checkbox"]', figure)
    if (input.prop('checked')) {
      if (input.prop('id') === 'feedback')
        feedbackFile.push(input.prop('name'))
      else if(input.prop('id') === 'upload')
        uploadFile.push(input.prop('name'))
      console.log('added ' + uploadFile)
    } else {
      if (input.prop('id') === 'feedback') {
        var i = feedbackFile.indexOf(input.prop('name'));
        if (i != -1) {
          feedbackFile.splice(i, 1);
          console.log('deleted ' + feedbackFile)
        }
      }
      else if (input.prop('id') === 'upload') {
        var i = uploadFIle.indexOf(input.prop('name'));
        if (i != -1) {
          uploadFile.splice(i, 1);
          console.log('deleted ' + uploadFile)
        }
      }
    }
  })
})

function readFile(dir) {
  var data = {
    'folder': dir
  }
  $.ajax({
    url: 'file',
    method: 'GET',
    data: data
  }).done(function(data) {
    $("#files").html(data)
    $('#files').on('click', function() {
      $(this).children('.focus').removeClass('focus')
    })
    $('[type=folder]').on({
      'click': function(e) {
        $(this).addClass('focus')
        e.stopPropagation();
      },
      'dblclick': function(e) {
        currentfolder = $(this).attr("dir")
        readFile(currentfolder)
        $('#uploader').data('dmUploader').settings.extraData = {
          id: defaultId,
          folder: currentfolder
        };
      },
    })
  })

}

function goLeft() {
  if (currentfolder != 'upload') {
    count = currentfolder.split('/').length
    currentfolder = currentfolder.split('/', count - 1).join('/')
    readFile(currentfolder)
  }
}

function getConvert() {
  $.ajax({
    url: 'file/convert',
    method: 'GET',
  }).done(function(data) {
    $("#file-list").html(data)
  })
}

function getTrain() {
  $.ajax({
    url: 'file/train',
    method: 'GET',
  }).done(function(data) {
    $("#lists").html(data)
  })
}

function getMosaic() {
  $.ajax({
    url: 'file/mosaic',
    method: 'GET',
  }).done(function(data) {
    $("#lists").html(data)
  })


  $.ajax({
    url: 'file/model',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
  })
}


function model(name) {
  modelFile = name
  $.ajax({
    url: 'file/video',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
  })
}

function video(name) {
  videoFile = name
  var data = {
    'model': modelFile,
    'filename': videoFile,
  }
  console.log(data)
}


function train() {
  var data = {
    'folder': trainFolder
  }
  $.ajax({
    url: 'api/train',
    method: 'GET',
    data: data,
    timeout: 200000,
  }).done(function(response) {
    getTrain(id)
  })

}



function mosaic(filename) {
  var data = {
    'filename': filename,
  }
  $.ajax({
    url: 'api/mosaic',
    method: 'GET',
    data: data,
  })
}






function download(filename) {
  var data = {
    'filename': filename
  }
  location.href = 'api/download?' + $.param(data)
}

function makeFolder() {
  var data = {
    'id': defaultId,
    'folder': $("#folder-id").val()
  }
  $.ajax({
    url: 'api/makeFolder',
    method: 'GET',
    data: data,
  }).done(function(response) {
    $("#folder-id").val('')
    readFile(defaultId, defaultDir)
  })
}

function getFeedback() {
  $.ajax({
    url: 'file/feedback',
    method: 'GET',
  }).done(function(data) {
    $("#lists").html(data)
  })
}

function getFeedback_face(filename) {
  var data = {
    'filename': filename
  }
  $.ajax({
    url: 'file/feedback_face',
    method: 'GET',
    data: data,
  }).done(function(data) {
    $("#feedback").html(data)
    $('.imgcheckbox').imgCheckbox({
      round: true,
      animation: true,
    })

  })
}


$(document).ajaxStart(function() {
  console.log('ajaxstart')
})
$(document).ajaxStop(function() {
  console.log('ajaxstop')
})
