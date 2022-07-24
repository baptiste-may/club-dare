const { Socket } = require('socket.io');

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 3000;

/**
 * @type {Socket}
 */
const io = require('socket.io')(http);

require("dotenv").config();

app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

http.listen(port, () => {
    console.log(`App server is running on port ${port}`);
});

players = {};

io.on("connection", (socket) => {
    console.log(`[+] ${socket.id}`);
    
    socket.on("player-join", (username, color, top, left, eyesTransform) => {
        const id = "" + socket.id + "";
        const infos = [username, color, top, left, eyesTransform];
        players[id] = infos;
        socket.broadcast.emit("player-join", id, infos);
    });

    socket.on("get-players", () => {
        socket.emit("get-players", players);
    });

    socket.on("update-player", (username, color, top, left, eyesTransform) => {
        const id = "" + socket.id + "";
        const infos = [username, color, top, left, eyesTransform];
        players[id] = infos;
        socket.broadcast.emit("update-player", id, infos);
    });

    socket.on("player-send-message", (message) => {
        socket.broadcast.emit("player-send-message", socket.id, message);
    });

    socket.on("check-secret-token", (token) => {
        if (process.env.SECRET_TOKEN == token) socket.emit("check-secret-token", true);
        else socket.emit("check-secret-token", false);
    });

    socket.on("disconnect", () => {
        console.log(`[-] ${socket.id}`);
        socket.broadcast.emit("player-disconnect", socket.id);
        delete players[socket.id];
    });
});