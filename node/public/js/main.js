var currentfolder = '';
var defaultDir = ''
var trainFolder = []
var modelFile = ''
var videoFile = ''
var feedbackFile = []
var uploadFile=[]
var cp_src=[]
function removeList(list,file){
  var i = list.indexOf(file);
  if (i != -1) {
    list.splice(i, 1);
    console.log('deleted ' + list)
  }
}


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


})

function load(){
  $('figure').on('click', function(event) {
    var figure = $(this)
    var input = $('input[type="checkbox"]', figure)
    if (input.prop('checked')) {
        uploadFile.push(input.prop('name')+".jpg")
    } else {
        removeList(uploadFile,input.prop('name')+".jpg")
    } // ese
  })
}

function cpFiles(){
  cp_src=[]
  for(var i=0; i<uploadFile.length; i++){
  cp_src.push(uploadFile[i])
  }
  console.log('copy finished '+cp_src)

}

function pasteFiles(){
  var data={
    'src':cp_src,
    'to':currentfolder
  }
  console.log(cp_src+" to "+currentfolder)
  $.ajax({
    url:'api/paste',
    method:'GET',
    data:data
  }).done(function(response){
    console.log('good')
    readFile(currentfolder)
  })
  // image/namsu_jo

}


function FeedbackFiles(){
  console.log('feedback')

}
function removeFiles(){

  var data={
    'files':uploadFile
  }
  $.ajax({
    url:'api/delete',
    method:'GET',
    data:data
  }).done(function(response){
    readFile(currentfolder)

  })
}

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
    $('.imgcheckbox').imgCheckbox({
      animation: true,
      round: true
    })
    //initialize
    uploadFile=[]
    load()
    $('#files').on('click', function() {
      $(this).children('.focus').removeClass('focus')

    })

    $('[type=folder]').on({
      'click': function(e) {
        if($(this).hasClass("focus")){
          $(this).removeClass('focus')
          removeList(uploadFile,$(this).attr("dir"))
        }
        else{
          $(this).addClass('focus')
          uploadFile.push($(this).attr("dir"))
          console.log(uploadFile)
        }
        e.stopPropagation();
      },
      'dblclick': function(e) {
        currentfolder = $(this).attr("dir")
        readFile(currentfolder)
        $('#uploader').data('dmUploader').settings.extraData = {
          folder: currentfolder
        };
        uploadFile=[]
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
    url: 'file/video_upload',
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
    getTrain()
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
    'folder': $("#folder-id").val()
  }
  $.ajax({
    url: 'api/makeFolder',
    method: 'GET',
    data: data,
  }).done(function(response) {
    $("#folder-id").val('')
    readFile(defaultDir)
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
    load()

  })
}


$(document).ajaxStart(function() {
  console.log('ajaxstart')
})
$(document).ajaxStop(function() {
  console.log('ajaxstop')
})
