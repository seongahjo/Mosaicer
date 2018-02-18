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
    $('.chk').iCheck({checkboxClass : 'icheckbox_flat-green'})
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
}

function getModel(){
  $.ajax({
    url: 'file/model',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
  })
}

function getVideo(){
  $.ajax({
    url: 'file/video_upload',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
      video_load()
  })
}

function getMosaic() {
  $.ajax({
    url: 'file/mosaic',
    method: 'GET',
  }).done(function(data) {
    $("#lists").html(data)
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

function getMosaicButton(){
  $.ajax({
    url: 'file/mosaic_button',
    method: 'GET',
  }).done(function(data) {
    $("#main").html(data)
  })
}

function getLabels(){
  $.ajax({
    url:'file/mosaic_label',
    method:'GET',
    data:{
      model : modelFile
    }
  }).done(function(data){
    $("#main").html(data)
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
