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
        console.log(currentfolder)
        readFile(currentfolder)
        $('#uploader').data('dmUploader').settings.extraData = {
          folder: currentfolder
        };
        uploadFile=[]
      },
    })
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
    data:data,
  }).done(function(response){
    console.log('good')
    readFile(currentfolder)
  })
  // image/namsu_jo

}
