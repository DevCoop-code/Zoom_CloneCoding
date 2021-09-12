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

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value
    socket.emit("nickname", value);
    // input.value="";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;

    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomName}`;

    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);

    const nameForm = room.querySelector("#name");
    nameForm.addEventListener("submit", handleNicknameSubmit);
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

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} Joined!!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} Left...`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {           // "(msg) => console.log(msg)"" same just "console.log"
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});