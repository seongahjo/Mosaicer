var currentfolder = '';
var defaultDir = ''
var trainFolder = []
var modelFile = ''
var videoFile = ''
var uploadFile=[]
var cp_src=[]
var videoName='' // after upload
var folderName='' // choose folder
var alertlist=[]
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
console.log(uploadFile+" to "+folderName)
var data={
  'files' : uploadFile,
  'to' : folderName
}
var notice=wait('feedback')

$.ajax({
  url:'api/feedback',
  method:'GET',
  data:data
}).done(function(resposne){
  notice.remove()
  getFeedback_face("#{video}")
})

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
    done("delete folder")
  })
}


function goLeft() {
  if (currentfolder != 'upload') {
    count = currentfolder.split('/').length
    currentfolder = currentfolder.split('/', count - 1).join('/')
    readFile(currentfolder)
  }
}



function image_load(){
  $.ajax({
    url: 'file/folder',
    method: 'GET',
  }).done(function(data) {
    $("#ModalContent").html(data)
  })
}

function model(name) {
  if(name==undefined || name==""){
    error("empty")
    return
  }
  modelFile = name
  $.ajax({
    url: 'file/video_upload',
    method: 'GET',
  }).done(function(data) {
    $("#main").addClass("animated fadeOutRight")
    $('#main').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function(){
      $("#main").removeClass("animated fadeOutRight")
      $("#main").addClass("animated fadeInRight")
      $("#main").html(data)
      video_load()
    }
  );
  })
}

function folder(name){
folderName=name
$(".bs-example-modal-lg").modal('hide')
if(uploadFile && uploadFile.length){
  FeedbackFiles()
}
else
error("empty")

}

function video(name) {
  if(name==undefined || name==""){
    error("empty")
    return
  }
  videoFile = name
  var data = {
    'model': modelFile,
    'filename': videoFile,
  }
  console.log(data)
}


function train() {

  var folder=$("#folder-id").val()
  if(folder==""){
    error("empty")
  return
  }
  if(!(trainFolder &&trainFolder.length)){
    error("empty")
  return
  }
  var data = {
    'folder': trainFolder,
    'name' : folder
  }
  var notice=wait("train")
  $.ajax({
    url: 'api/train',
    method: 'GET',
    data: data,
    timeout:7200000,
  }).done(function(response) {
    notice.remove()
    getTrain()
  })

}


function mosaic() {
  var data = {
    'model':modelFile,
    'filename': videoName,
  }
  var notice=wait('mosaic')
  $.ajax({
    url: 'api/mosaic',
    method: 'GET',
    data: data,
    timeout:7200000,
  }).done(function(response){
    notice.remove()
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
    done("make folder")
  })
}



$(document).ajaxStart(function() {
  console.log('ajaxstart')
})
$(document).ajaxStop(function() {
  console.log('ajaxstop')
})
