var currentfolder = 'upload';
var defaultId = 'test'
var defaultDir = 'upload'
$(function() {
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
                console.log(currentfolder)
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

function convert(id,folder){
  var data={
    'id' :id,
    'folder' : folder,
    'label' : $("#btn_"+folder).val()
  }
  $.ajax({
    url:'api/convert',
    method:'GET',
    data:data
  }).done(function(response){
    getConvert(id)
  })
}

function train(id){
  var data={
    'id' :id,
  }
  $.ajax({
    url:'api/train',
    method:'GET',
    data:data,
    timeout: 60000,
  }).done(function(response){
    console.log('finish')
    getTrain(id)
  })

}
$(document).ajaxStart(function() {
    console.log('ajaxstart')
})
$(document).ajaxStop(function() {
    console.log('ajaxstop')
})

function maxLengthCheck(object)
  {
    if (object.value.length > object.maxLength)
      object.value = object.value.slice(0, object.maxLength)
  }
