var currentfolder = 'upload';
var defaultDir = 'upload'


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

function getMosaic(id) {
    var data = {
        'id': id
    }
    $.ajax({
        url: 'file/mosaic',
        method: 'GET',
        data: data,
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
        timeout: 200000,
    }).done(function(response) {
        getTrain(id)
    })

}

function mosaic(id,filename){
  var data = {
    'id' : id,
    'filename' : filename
  }
  $.ajax({
    url: 'api/mosaic',
    method:'GET',
    data : data,
  })
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
$(document).ajaxStart(function() {
    console.log('ajaxstart')
})
$(document).ajaxStop(function() {
    console.log('ajaxstop')
})
