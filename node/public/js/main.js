var currentfolder = 'upload';
//var defaultId = 'test'
var defaultDir = 'upload'
$(function() {

    $("#drop-area-div").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $("#drop-area-div").addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $("#drop-area-div").removeClass('is-dragover');
        })
        .on('drop', function(e) {
            //  droppedFiles = e.originalEvent.dataTransfer.files;
        });

    $(document).on('dragenter', function() {
        $("#upload-label").removeClass('hidden')
    })

    $("#uploader").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $("#upload-label").removeClass('hidden')
            $("#uploader").addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $("#uploader").removeClass('is-dragover');

        })
        .on('drop', function(e) {
            $("#upload-label").addClass('hidden')
                //  droppedFiles = e.originalEvent.dataTransfer.files;
        });

    var upload = $("#uploader").dmUploader({
        url: 'api/upload',
        method: 'POST',
        extraData: {
            id: defaultId,
            folder: currentfolder
        },
        allowedTypes: 'image/*',
        onInit: function() {
            console.log('good')
        },
        onUploadSuccess: function(id, data) {
            readFile(defaultId, currentfolder)
        }
    });


    var uploader = $("#drop-area-div").dmUploader({
        url: 'api/transfer',
        method: 'POST',
        extraData: {
            id: defaultId
        },
        allowedTypes: 'image/*',
        onInit: function() {
            console.log('good')
        },
        onNewFile: function(id, file) {
            /* Fields available are:
               - file.name
               - file.type
               - file.size (in bytes)
            */
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(file);
            console.log(file)
        },
        onUploadProgress: function(id, percent) {
            console.log('Upload of #' + id + ' is at %' + percent);
            // do something cool here!
        },
        onUploadSuccess: function(id, data) {
            $('#progress-lists').html(data)
        }

    });


    /*  $.contextMenu({
          selector: "[type=folder]",
          callback: function(key, options) {
              var m = "clicked: " + key;
              window.console && console.log(m) || alert(m);
          },
          items: {
              foo: {
                  name: "Foo",
                  callback: function(key, opt) {
                      console.log(opt)
                      console.log(opt.$trigger.context.id)
                  }
              },
              bar: {
                  name: "Bar"
              }
          }
      })*/
})



function readFile(id, dir) {
    var data = {
        'id': id,
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
                readFile(defaultId, currentfolder)
                $('#uploader').data('dmUploader').settings.extraData = {
                    id : defaultId,
                    folder : currentfolder
                };
            },
        })
    })

}

function goLeft() {
    if (currentfolder != 'upload') {
        count = currentfolder.split('/').length
        currentfolder = currentfolder.split('/', count - 1).join('/')
        readFile(defaultId, currentfolder)
    }
}

function getConvert(id) {
    var data = {
        'id': id
    }
    $.ajax({
        url: 'file/convert',
        method: 'GET',
        data: data
    }).done(function(data) {
        $("#file-list").html(data)
    })
}

function getTrain(id) {
    var data = {
        'id': id
    }
    $.ajax({
        url: 'file/train',
        method: 'GET',
        data: data
    }).done(function(data) {
        $("#lists").html(data)
    })
}

function convert(id, folder) {
    var data = {
        'id': id,
        'folder': folder,
        'label': $("#btn_" + folder).val()
    }
    $.ajax({
        url: 'api/convert',
        method: 'GET',
        data: data
    }).done(function(response) {
        getConvert(id)
    })
}

function train(id) {
    var data = {
        'id': id,
    }
    $.ajax({
        url: 'api/train',
        method: 'GET',
        data: data,
        timeout: 60000,
    }).done(function(response) {
        getTrain(id)
    })

}

function makeFolder(){
  var data = {
    'id' : defaultId,
    'folder' : $("#folder-id").val()
  }
  $.ajax({
      url: 'api/makeFolder',
      method: 'GET',
      data: data,
  }).done(function(response) {
      $("#folder-id").val('')
      readFile(defaultId,defaultDir)

  })
}
$(document).ajaxStart(function() {
    console.log('ajaxstart')
})
$(document).ajaxStop(function() {
    console.log('ajaxstop')
})

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}
