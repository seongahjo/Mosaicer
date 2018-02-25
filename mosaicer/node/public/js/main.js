var currentfolder = '';
var defaultDir = ''
var trainFolder = []
var modelFile = ''
var videoFile = ''
var uploadFile=[]
var cp_src=[]
var videoName='' // after upload
var folderName='' // choose folder
var labels=[]
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
}).done(function(response){
  notice.remove()
  getFeedback_face()
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

  if(!(uploadFile &&uploadFile.length)){
	FeedbackFiles()
	return
}
else{
  $.ajax({
    url: 'file/folder',
    method: 'GET',
  }).done(function(data) {
    $("#ModalContent").html(data)
  })
}
}

function label(labelName){
    $("#label-"+labelName).toggleClass("selected")
  if(labels.includes(labelName)){
    removeList(labels,labelName)
  }else{
    labels.push(labelName)
  }
}


function folder(name){
folderName=name
$(".bs-example-modal-lg").modal('hide')
//if(uploadFile && uploadFile.length){
  FeedbackFiles()
//}
//else
//error("empty")

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



function share_download(label){
  var data = {
    'label': label
  }
  $.ajax({
    url: 'socket/share-download',
    method: 'GET',
    data: data,
  }).done(function(response){
    console.log('good')
  })
}

function mosaic() {
  var data = {
    'filename': videoName,
    'labels':labels,
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
