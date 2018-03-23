// const moment = require('moment');

let socket = io();    //initiating request from client to server to open web socket and is kept open

socket.on('connect', function() {    //event handler
  console.log("Connected to server");   //will appear in client console
});

socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);

});

socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery('#message').append(li);
});

jQuery('#message-form').on('submit', function (e){
  e.preventDefault();           //preventing default behaviour of reloading the page

  let messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: "User",
    text: messageTextbox.val()
  }, function(){
    messageTextbox.val('');   //to make message text box empty
  });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled',"disabled").text('Sending location....');

  navigator.geolocation.getCurrentPosition(function (position){
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function(){
    locationButton.removeAttr('disabled').text('Send location');

    alert('Unable to fetch location.')
  });
})
