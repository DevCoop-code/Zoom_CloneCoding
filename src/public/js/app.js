const socket = io();    // Automatically Make & Connect the socket

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // 1st parameter: Event Name
    // 2nd parameter: Object which is sending Server
    // 3rd parameter: Callback Func which is sending Server
    socket.emit("enter_room", {payload: input.value}, () => {
        console.log("server is done");
    });
    input.value="";
}
form.addEventListener("submit", handleRoomSubmit);