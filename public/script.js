// const socket = io("https://ka-chat-server-dev.herokuapp.com");
const request = new XMLHttpRequest();
const connectionStatus = document.getElementById('connection-status');
const joinButton = document.getElementById('join');
const leaveButton = document.getElementById('leave');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const inputContainer = document.getElementById('input-container');
const messageContainer = document.getElementById('message-container');
const chatServerUrl = 'http://localhost:4000/';
var socket; 

joinButton.innerHTML = 'Click here to join chat';
connectionStatus.innerHTML = 'You are connected';

const username = "Kim";
const firebaseId = 'TX89TR6PO024RE';
var name = null;
var connected;

const registerName = async (url, data) => {

    var result = await fetch(url, data);
    return result.json();

}

registerName('http://localhost:4001/api/v1/user', 
{ 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ firebaseId, username })
} ).
then(res=>{
    // name = res;
    console.log(res)
});

const setEventListeners = () => {
    socket.emit("user-joined", name);
    socket.on("join-alert", data => {
        connectionStatus.innerText = data;
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
}

joinButton.addEventListener('click', e => {
    e.preventDefault();
    socket = io(chatServerUrl, { autoConnect: false });
    setEventListeners();
    socket.on('connect', () => {
        inputContainer.className = 'input-container';
        connectionStatus.className = '';
        connected = true;
        leaveButton.innerHTML = 'Leave chat';
        leaveButton.className = '';
        joinButton.className = 'hidden';
        console.log('Connected');
    });
    socket.on('disconnect', () => {
        inputContainer.className = "input-conatiner hidden";
        connectionStatus.className = 'hidden';
        connected = false;
        leaveButton.className = 'hidden';
        joinButton.className = '';
    });
    socket.open();
});

leaveButton.addEventListener('click', e => {
    e.preventDefault();
    socket.disconnect();
})
    
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
