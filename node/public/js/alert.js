function wait(type){
  new PNotify({
    title: 'ing...',
    text: 'Your '+type+' is working...',
    type: 'info',
    desktop: {
        desktop: true
    },
    delay:10000,

    after_init: function(notice) {
      alertlist.push(notice)
      setInterval(function(){notice.attention('pulse')},
      1000)
      /*  notice.elem.on('click', 'button', function() {
      });*/
    },
    after_close:function(notice){
      removeList(alertlist,notice)
    }
  })
}

function done(type){
  new PNotify({
    title: 'Done',
    text: 'Your '+type+' is done!!',
    type: 'success',
    desktop: {
        desktop: true
    },
    after_init: function(notice) {
      alertlist.push(notice)
      notice.attention('bounce');
      /*  notice.elem.on('click', 'button', function() {
      });*/
    },
    after_close:function(notice){
      removeList(alertlist,notice)
    }
  })
}
function error(type){
  switch(type){
  case 'empty':
  new PNotify({
    title: 'Empty',
    text: 'You should input correctly',
    type: 'error',
    desktop: {
        desktop: true
    },
    after_init: function(notice) {
      alertlist.push(notice)
      notice.attention('shake');
      console.log(alertlist)
      /*  notice.elem.on('click', 'button', function() {
      });*/
    },
    after_close:function(notice){
      removeList(alertlist,notice)
    }
});
  break;
  }
}
