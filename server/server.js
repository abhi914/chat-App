const socketIO = require('socket.io');
const http = require('http');
const Path = require('path');
const express = require('express');

const publicPath = Path.join(__dirname,"..","public");

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("New user Connected");

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
});






server.listen(3000, (err) => {
    if(err)
        console.log(err);
    console.log("Server Started at port 3000");
});