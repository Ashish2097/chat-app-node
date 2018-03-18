const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//globals//////////////////////////////////////////////////
const publicPath = path.join(__dirname+"/../public");
const port = process.env.PORT || 3000 ;   //port = PORT is specified otherwise, 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);                //web socket server
//routes///////////////////////////////////////////////////////////////////////////

app.use(express.static(publicPath));

io.on('connection', function(socket) {
  console.log("New user connected");

  socket.emit("newMessage", {
    from: "mohan",
    text: "namaste",
    createdAt: 12345
  });

  socket.on('createMessage', function(message) {
    console.log("createMessage", message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date()
    });
  });

  socket.on('disconnect', function() {
    console.log('User is disconnected.');
  });
});


server.listen('3000',(res, err)=>{
  if(!err)
   console.log(`Listening at ${port}`);
  else
   console.log("error" + err);
});
