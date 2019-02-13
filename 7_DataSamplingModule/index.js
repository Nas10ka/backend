const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8010;

const server = net.createServer();

server.on('connection', socket => {
  console.log('New client connected!');

  socket.on('data', msg => {
      const rs = fs.createReadStream(
          path.join('../7_DataSamplingModule', 'users.json')
      );
      rs.setEncoding('utf8');
      rs.on('data', chunk => {
        const users = JSON.parse(JSON.stringify(chunk));
        console.log(typeof JSON.parse(users));
      })
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

