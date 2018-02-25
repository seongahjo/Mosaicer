var io = require('socket.io-client')
  var url = 'http://localhost:1234'
exports.connect=(cb)=>{
var socket = io.connect(url)
socket.on('connect', ()=>{
  console.log('connected')
  cb(null,socket)
})
socket.on('connect_error', () => {
  socket.close()

    console.log('connect failed')
  cb(new Error('connect_error'))
})
}
