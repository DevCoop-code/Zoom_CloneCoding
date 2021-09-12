import http from "http";
import express from "express";

import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://:3000');

// app.listen(3000); 
const server = http.createServer(app);

// Running HTTP & WebSocket Server Both
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    sockets.push(socket);
    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("Disconnect from Browser");
    });
    socket.on("message", (message) => {
        const parsed = JSON.parse(message);
        if (parsed.type === "new_message") {
            sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${parsed.payload}`));
        } else if (parsed.type === "nickname") {
            socket["nickname"] = parsed.payload;
        }
        console.log(message.toString("utf8"));
    });
});

server.listen(3000, handleListen);