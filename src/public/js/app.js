const socket = io();    // Automatically Make & Connect the socket

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

const room = document.getElementById("room");
room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;

    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName}`;
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // 1st parameter: Event Name
    // 2nd parameter: Object which is sending Server
    // 3rd parameter: Callback Func which is  sending Server
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value="";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    console.log("Welcome Event");
    addMessage("Someone Joined!!");
});