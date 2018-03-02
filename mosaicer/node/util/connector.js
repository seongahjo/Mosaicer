var io = require('socket.io-client');
var path= require('path');
var url = 'http://localhost:1234';
var fu = require('../util/file');
var ss = require('socket.io-stream');
var fs=require('fs');
exports.connect=()=>{
  'use strict';
return new Promise((resolve,reject)=>{
  var socket = io.connect(url);
  socket.on('connect', ()=>{
    console.log('connected');
    resolve(socket);
  });
  socket.on('connect_error', () => {
    socket.close();
    console.log('connect failed');
    reject(new Error('connection error'));
  });
});
};

exports.receive=(socket)=>{
  'use strict';
  return new Promise((resolve,reject)=>{
    socket.emit('request-view');
    socket.on('receive-view', (datas) => {
      socket.close();
      resolve(datas);
    });
    socket.on('connect_error', () => {
      socket.close();
      console.log('connect failed');
      reject(new Error('connection error'));
    });
  });
};

exports.download=(socket,label)=>{
  'use strict';
  return new Promise((resolve,reject)=>{
    var labelPath=path.join('../image',label);
    fu.make(labelPath);
    socket.emit('download-images', label);
    ss(socket).on('send-images',(stream,data)=>{
      var filename = path.basename(data.filename);
      stream.pipe(fs.createWriteStream(path.join(labelPath,filename)));
    });
    resolve();
    socket.on('connect_error', () => {
      socket.close();
      console.log('connect failed');
      reject(new Error('connection error'));
    });
  });
};

exports.share=(socket,label,filename)=>{
  'use strict';
  return new Promise((resolve,reject)=>{
    var labelPath = path.join('../image', label);
    var filePath = path.join(labelPath, filename);
    var stream = ss.createStream();
    ss(socket).emit('send-images', stream, {
      'name': filename,
      'label': label
    });
    fs.createReadStream(filePath).pipe(stream);
    resolve();
    socket.on('connect_error', () => {
      socket.close();
      console.log('connect failed');
      reject(new Error('connection error'));
    });
  });
};
