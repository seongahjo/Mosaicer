var currentfolder = '';
var defaultDir = ''
var trainFolder=[]
$(document).ready(function(){
	Holder.run()

	$('input').on('ifChecked', function(event){

	trainFolder.push(event.currentTarget.value)

	console.log(trainFolder)
});

$('input').on('ifUnchecked', function(event){
	var i = trainFolder.indexOf(event.currentTarget.value);
	if(i != -1) {
		trainFolder.splice(i, 1);
	}
	console.log(trainFolder)
});
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
  var label=$("#btn_" + folder).val()
  if(label===undefined)
    return
    var data = {
        'id': id,
        'folder': folder,
        'label': label
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
				'folder':trainFolder
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
  var label=$("#btn_"+filename).val()
  if(label===undefined)
    return
  var data = {
    'id' : id,
    'filename' : filename,
    'label' : label
  }
  $.ajax({
    url: 'api/mosaic',
    method:'GET',
    data : data,
  })
}




function download(id,filename){
  var data = {
    'id' : id,
    'filename' : filename
  }
  location.href='api/download?'+$.param(data)
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

function getFeedback(id) {
    var data = {
        'id': id
    }
    $.ajax({
        url: 'file/feedback',
        method: 'GET',
        data: data,
    }).done(function(data) {
        $("#lists").html(data)
    })
}

function getFeedback_face(id,filename){
	var data = {
			'id': id,
			'filename':filename
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
