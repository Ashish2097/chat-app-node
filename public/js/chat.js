// const moment = require('moment');

let socket = io();    //initiating request from client to server to open web socket and is kept open

function scrollToBottom() {
  //selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children("li:last-child");
  // console.log(newMessage);
  //height
  let clientHeight = messages.prop('clientHeight');
  // console.log(clientHeight);
  let scrollTop = messages.prop('scrollTop');
  // console.log(scrollTop);
  let scrollHeight = messages.prop('scrollHeight');
  // console.log(scrollHeight);
  let newMessageHeight = newMessage.innerHeight();
  // console.log(newMessageHeight);
  let lastMessageHeight = newMessage.prev().innerHeight();
  // console.log(lastMessageHeight);

  if(clientHeight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};


socket.on('connect', function() {    //event handler
  console.log("Connected to server");   //will appear in client console
  let params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }

  });
});

socket.on('disconnect', function() {
  console.log("Disconnected from server");
});

socket.on('updateUserList', function (users) {
  console.log("Users list :::::\n",users);
  let ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery("#users").html(ol);
});

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = jQuery('#message-template').html();
  let html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);

  scrollToBottom();


  //
  // let li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);

});

socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');

  let template = jQuery("#location-message-template").html();
  let html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  console.log(html);
  jQuery('#messages').append(html);

  scrollToBottom();

  // let li = jQuery('<li></li>');
  // let a = jQuery('<a target="_blank">My Current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  //
  // jQuery('#message').append(li);
});

jQuery('#message-form').on('submit', function (e){
  e.preventDefault();           //preventing default behaviour of reloading the page

  let messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
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
