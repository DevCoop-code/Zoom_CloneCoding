import http from "http";
import express from "express";

// import WebSocket from "ws";

import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://:3000');

// app.listen(3000); 
const server = http.createServer(app);

const io = SocketIO(server);
io.on("connection", socket => {
    socket["nickname"] = "Anonymouse"
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        // console.log(roomName);
        socket.join(roomName);

        done();

        console.log(`Send Welcome Event ${roomName}`);

        socket.to(roomName).emit("welcome", socket.nickname);
        // console.log(socket.rooms);
        // setTimeout(() => {
        //     done()
        // }, 10000);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname);
        });
    });

    socket.on("new_message", (msg, room, done) => {
        console.log(`new message \(msg) \(room)`);
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("nickname", nickname => socket["nickname"] = nickname);
});
/*
*** WebSocket Code ***
*/
// Running HTTP & WebSocket Server Both
// const wss = new WebSocket.Server({server});

// const sockets = [];

// wss.on("connection", (socket) => {
//     socket["nickname"] = "Anonymous";
//     sockets.push(socket);
//     console.log("Connected to Browser");
//     socket.on("close", () => {
//         console.log("Disconnect from Browser");
//     });
//     socket.on("message", (message) => {
//         const parsed = JSON.parse(message);
//         if (parsed.type === "new_message") {
//             sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${parsed.payload}`));
//         } else if (parsed.type === "nickname") {
//             socket["nickname"] = parsed.payload;
//         }
//         console.log(message.toString("utf8"));
//     });
// });

server.listen(3000, handleListen);