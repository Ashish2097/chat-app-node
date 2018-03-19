let socket = io();    //initiating request from client to server to open web socket and is kept open

socket.on('connect', function() {    //event handler
  console.log("Connected to server");   //will appear in client console
});

socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('newMessage', function(message) {
  console.log(message);

  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);

});

console.log('hey');

socket.emit('createMessage',{
  from: "Lucifer",
  text: "I'm coming for you."
}, function (data){
  console.log("Got it.", data);
});

jQuery('#message-form').on('submit', function (e){
  e.preventDefault();           //preventing default behaviour of reloading the page

  socket.emit('createMessage', {
    from: "User",
    text: jQuery('[name=message]').val()
  }, function(){

  });
});
