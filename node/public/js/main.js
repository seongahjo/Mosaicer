var currentfolder = '';
var defaultDir = ''
var trainFolder = []
var modelFile = ''
var videoFile = ''
var uploadFile=[]
var cp_src=[]
var videoName='' // after upload
function removeList(list,file){
  var i = list.indexOf(file);
  if (i != -1) {
    list.splice(i, 1);
    console.log('deleted ' + list)
  }
}


$(document).ready(function() {
  Holder.run()

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



function FeedbackFiles(){
  console.log(uploadFile)
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


function goLeft() {
  if (currentfolder != 'upload') {
    count = currentfolder.split('/').length
    currentfolder = currentfolder.split('/', count - 1).join('/')
    readFile(currentfolder)
  }
}



function model(name) {
  modelFile = name
  $.ajax({
    url: 'file/video_upload',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
    video_load()
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

  var folder=$("#folder-id").val()

  var data = {
    'folder': trainFolder,
    'name' : folder
  }
  $.ajax({
    url: 'api/train',
    method: 'GET',
    data: data,
    timeout:7200000,
  }).done(function(response) {
    getTrain()
  })

}



function mosaic() {
  var data = {
    'model':modelFile,
    'filename': videoName,
  }
  $.ajax({
    url: 'api/mosaic',
    method: 'GET',
    data: data,
    timeout:7200000,
  }).done(function(response){

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



$(document).ajaxStart(function() {
  console.log('ajaxstart')
})
$(document).ajaxStop(function() {
  console.log('ajaxstop')
})
