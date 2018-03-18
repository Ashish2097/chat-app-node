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

io.on('connection', (socket)=>{
  console.log("New user connected");

  socket.on('disconnect', ()=>{
    console.log('User is disconnected.');
  });
});


server.listen('3000',(res, err)=>{
  if(!err)
   console.log(`Listening at ${port}`);
  else
   console.log("error" + err);
});
