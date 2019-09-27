const io = require('socket.io-client');
const path = require('path');

const url = 'http://localhost:1234';
const fu = require('../util/file');
const ss = require('socket.io-stream');
const fs = require('fs');

exports.connect = () => new Promise((resolve, reject) => {
  const socket = io.connect(url);
  socket.on('connect', () => {
    console.log('connected');
    resolve(socket);
  });
  socket.on('connect_error', () => {
    socket.close();
    console.log('connect failed');
    reject(new Error('connection error'));
  });
});

exports.receive = socket => new Promise((resolve, reject) => {
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

exports.download = (socket, label) => new Promise((resolve, reject) => {
  const labelPath = path.join('../image', label);
  fu.make(labelPath);
  socket.emit('download-images', label);
  ss(socket).on('send-images', (stream, data) => {
    const filename = path.basename(data.filename);
    stream.pipe(fs.createWriteStream(path.join(labelPath, filename)));
  });
  resolve();
  socket.on('connect_error', () => {
    socket.close();
    console.log('connect failed');
    reject(new Error('connection error'));
  });
});

exports.share = (socket, label, filename) => new Promise((resolve, reject) => {
  const labelPath = path.join('../image', label);
  const filePath = path.join(labelPath, filename);
  const stream = ss.createStream();
  ss(socket).emit('send-images', stream, {
    name: filename,
    label,
  });
  fs.createReadStream(filePath).pipe(stream);
  resolve();
  socket.on('connect_error', () => {
    socket.close();
    console.log('connect failed');
    reject(new Error('connection error'));
  });
});
