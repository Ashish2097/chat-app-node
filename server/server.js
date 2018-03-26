const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isValidString} = require('./utils/validation')
const {Users} = require('./utils/users');

//globals//////////////////////////////////////////////////
const publicPath = path.join(__dirname+"/../public");
const port = process.env.PORT || 3000 ;   //port = PORT is specified otherwise, 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);                //web socket server
let users = new Users();

//routes///////////////////////////////////////////////////////////////////////////
app.use(express.static(publicPath));

io.on('connection', function(socket) {
  console.log("New user connected");



  socket.on('join', (params,callback)=>{
    if(!isValidString(params.name) || !isValidString(params.room)){
      callback('Name and Room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);    //removing them from other rooms before entering into new room otherwise messages from others room will be appeared on new rooms chat
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit("newMessage", generateMessage('Admin', 'Welcome to the chat app.'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', function(message, callback) {
    console.log("createMessage", message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', function (coords) {
      io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', function() {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    
  });
});


server.listen('3000',(res, err)=>{
  if(!err)
   console.log(`Listening at ${port}`);
  else
   console.log("error" + err);
});
