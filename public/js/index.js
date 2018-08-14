const socket = io(); 
socket.on('connect', function() {
    console.log("Connected to server");
});

socket.on('disconnect', function() {
    console.log("Disconnected to server");
});

socket.on('connected', function(message) {
    console.log(message.text);
});

socket.on('newMessage', function(newMessage) {
    console.log("new message arrived", newMessage);
});
