'use strict'

const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8010;

const server = net.createServer();
let users = {};
let buffer = '';

let count = 0;
server.on('connection', socket => {
  console.log('New client connected!');

  socket.on('data', msg => {
      const rs = fs.createReadStream(
          path.join('../7_DataSamplingModule', 'users.json')
      );
      // rs.setEncoding('utf8'); // кодировка в utf8 - 
      rs.on('data', chunk => {
        buffer = buffer + chunk.toString();
        pump();
      })
      // pump();
      // const rs = fs.readFile('./users.json', 'utf8', (err, data) => {
      //   if(err) throw err;
      //   console.log(JSON.parse(data));
      // })
  });

  socket.on('end', () => {
      console.log('Client is disconnected!');
  });
});

server.on('listening', () => {
  const { port } = server.address();
  console.log(`TCP Server started on port ${port}!`);
});

server.listen(PORT);

const pump = () => {
  console.log(buffer.slice(-1));
  if(buffer.slice(-1) === ']') {
    buffer = JSON.parse(buffer);
    
  
  }

}

Object.compare = function (obj1, obj2) {
  for (let p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
  
    switch (typeof (obj1[p])) {
      case 'object':
        if (!Object.compare(obj1[p], obj2[p])) return false;
        break;
      case 'function':
        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
        break;
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }
  
  for (let p in obj2) {
    if (typeof (obj1[p]) == 'undefined') return false;
  }
  return true;
};


