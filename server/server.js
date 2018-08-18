const socketIO = require('socket.io');
const http = require('http');
const Path = require('path');
const express = require('express');

const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');

const publicPath = Path.join(__dirname,"..","public");
const port = process.env.PORT || 3000

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server);
const users = new Users();

io.on('connection', (socket) => {
    console.log("New user Connected");

    



    

    socket.on('join', (params, callback) => {
        users.removeUser(socket.id);
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and room name are required");
        }
        
        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room); 


        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', {
            from: 'Admin',
            text: 'Welcome to the chat application'
        });
        socket.broadcast.to(params.room).emit('newMessage', {
            from: 'Admin',
            text: `${params.name} has joined`
        });


        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));    
        }
        
        callback();
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        
    });


    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
            
        }
    });


});


server.listen(port, (err) => {
    if(err)
        console.log(err);
    console.log("Server Started at port 3000");
});