let socket = io();    //initiating request from client to server to open web socket and is kept open

socket.on('connect', function() {    //event handler
  console.log("Connected to server");   //will appear in client console\

  socket.emit('createMessage', {
    from: "Ashu",
    text: "hello"
  });
});

socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('newMessage', function(message) {
  console.log("newMessage", message);
});
