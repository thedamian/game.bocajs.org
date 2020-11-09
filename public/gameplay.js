const indexDiv = document.getElementById("index");
const gameplayDiv = document.getElementById("gameplay");
const nameshownDiv = document.getElementById("nameshown");
const nameInput = document.getElementById("name");
nameInput.focus();
const socket = io();
let PlayerName = "";
const joingame = () => {
    console.log("joining the game")
    const playerName = nameInput.value;
    if (playerName) {
        socket.emit('newPlayer', playerName);
    } else {
        //alert("We need a name to know who buzzed first");
        nameInput.focus();
        document.getElementById("nameerror").style.display = 'block';
    }
}

const buzz = () => {
    // Press the buzz button
    socket.emit('buzz', PlayerName);
}

socket.on("welcome",(YourName)=> {
    console.log("Yep: ",YourName)
    indexDiv.style.display = 'none';
    gameplayDiv.style.display = 'block';
    nameshownDiv.innerHTML = YourName;
    PlayerName = YourName;
});