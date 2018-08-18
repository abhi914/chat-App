const socket = io(); 

function scrollToBottom() {
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child')
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();



    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log("Should scroll");
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href="/";
        }
        else {
            console.log("No Error");
        }

    });

});

socket.on('disconnect', function() {
    console.log("Disconnected to server");    
});

socket.on('updateUserList', function(users) {
    const ol = jQuery('<ol></ol');

    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});


socket.on('newMessage', function(newMessage) {
    const formattedTime = moment(newMessage.createdAt).format('h:mm a');    
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: newMessage.text,
        from: newMessage.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    // // console.log("new message arrived", newMessage);
    // const li = jQuery('<li></li>');
    // li.text(`${newMessage.from} ${formattedTime}:  ${newMessage.text}`);
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(newMessage) {
    // const li = jQuery('<li></li>');
    // const a = jQuery('<a target="_blank">My Current Location</a>');
    // li.text(`${newMessage.from}, ${newMessage.text}`);
    // jQuery('#messages').append(li);
    const formattedTime = moment(newMessage.createdAt).format('h:mm a');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        from: newMessage.from,
        url: newMessage.url,
        createdAt: formattedTime 
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    // li.text(`${message.from} ${formattedTime}:`);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    // console.log(jQuery('[name=message]').val());
    const messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {        
        text: jQuery('[name=message]').val()
    }, function() {
        messageTextBox.val('');
    });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your Browser');
    }

    locationButton.attr('disabled', 'disabled');
    locationButton.text('Sending');
    
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled');
        locationButton.text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

    }, function() {
        alert('Unable to fetch Location');
        locationButton.removeAttr('disabled');
        locationButton.text('Send Location');
    });
});