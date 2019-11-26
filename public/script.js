const socket = io("http://localhost:4000");
const chatHeader = document.getElementById('chat-header');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messageContainer = document.getElementById('message-container');

const name = prompt('Whats your name?');

socket.emit("user-joined", name);

socket.on("join-alert", data => {
    chatHeader.innerText = data;
});

socket.on("chat-message", data =>{
    const { name, message } = data;
    let newDiv = document.createElement('div');
    let nameSpan = document.createElement('span');
    let messageSpan = document.createElement('span');
    nameSpan.innerText = `${name}: `;
    nameSpan.className = "name";
    messageSpan.innerText = message;
    newDiv.appendChild(nameSpan);
    newDiv.appendChild(messageSpan);
    newDiv.className = "incoming-message";

    name && message?
    messageContainer.appendChild(newDiv):
    null;
});

socket.on("user-disconnected", data => {
    let newDiv = document.createElement('div');
    let message =`${data} left!`;
    newDiv.innerText = message;
    newDiv.className = "left-message";

    data?
    messageContainer.appendChild(newDiv):
    null;
});

socket.on("user-connected", data => {
    let newDiv = document.createElement('div');
    let message = `${data} joined!`;
    newDiv.innerText = message;
    newDiv.className = "join-message";

    data?
    messageContainer.appendChild(newDiv):
    null;
});
    
chatForm.addEventListener("submit", event=>{
    event.preventDefault();
    const message = chatInput.value;
    socket.emit('send-chat-message', message);
    chatInput.value = '';
    let newDiv = document.createElement('div');
    let nameSpan = document.createElement('span');
    nameSpan.innerText = " :You";
    nameSpan.className="name";
    newDiv.className = "outgoing-message";
    newDiv.innerHTML = message;
    newDiv.appendChild(nameSpan);
    messageContainer.appendChild(newDiv);
});
