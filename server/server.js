const socketIO = require('socket.io');
const http = require('http');
const Path = require('path');
const express = require('express');

const publicPath = Path.join(__dirname,"..","public");
const port = process.env.PORT || 3000

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("New user Connected");

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

    socket.emit('connected', {
        from: 'Admin',
        text: 'Welcome to the chat application'
    });
    socket.broadcast.emit('connected', {
        from: 'Admin',
        text: 'New  User Joined'
    });

    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
});


server.listen(port, (err) => {
    if(err)
        console.log(err);
    console.log("Server Started at port 3000");
});