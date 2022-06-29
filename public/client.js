
const socket = io();

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

if (Cookies.get("username") == undefined || Cookies.get("color") == undefined) {
    Cookies.set("username", "User");
    Cookies.set("color", rgbToHex(randomInt(256), randomInt(256), randomInt(256)));
}

const player = $("#player");
const playerEyes = $("#player-eyes");

player.css("left", (window.innerWidth/2) + "px");
player.css("top", (window.innerHeight/2) + "px");

const playerColor = Cookies.get("color");
$("#player").css("background-color", playerColor);

const playerName = Cookies.get("username");
$("#player-name").text(playerName);


socket.on("player-join", (id, infos) => {
    const newPlayerHTML =   `<div id="${id}" class="player">
                            <img id="${id}-eyes" class="player-eyes" src="imgs/eyes.png">
                            <span id="${id}-name" class="player-name">${infos[0]}</span>
                            <img id="${id}-message-bubble-image" class="message-bubble-image" src="imgs/message-bubble.png">
                            <div id="${id}-message-bubble" class="message-bubble">
                                <span id="${id}-message"></span>
                            </div>
                            <img onclick="closeTchat('${id}')" id="close-${id}-message-bubble" class="close-message-bubble" src="imgs/close.png">
                        </div>`;
    $("#game").append(newPlayerHTML);
    const newPlayer = $(`#${id}`);
    newPlayer.css("background-color", infos[1]);
    newPlayer.css("top", infos[2]);
    newPlayer.css("left", infos[3]);
    newPlayer.css("opacity", 1);
});

socket.emit("get-players");
socket.on("get-players", (players) => {
    const keys = Object.keys(players);
    for (i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key != socket.id) {
            const infos = players[key];
            const newPlayerHTML = `<div id="${key}" class="player">
                                        <img id="${key}-eyes" class="player-eyes" src="imgs/eyes.png">
                                        <span id="${key}-name" class="player-name">${infos[0]}</span>
                                        <img id="${key}-message-bubble-image" class="message-bubble-image" src="imgs/message-bubble.png">
                                        <div id="${key}-message-bubble" class="message-bubble">
                                            <span id="${key}-message"></span>
                                        </div>
                                        <img onclick="closeTchat('${key}')" id="close-${key}-message-bubble" class="close-message-bubble" src="imgs/close.png">
                                    </div>`;
            $("#game").append(newPlayerHTML);
            const newPlayer = $(`#${key}`);
            newPlayer.css("background-color", infos[1]);
            newPlayer.css("top", infos[2]);
            newPlayer.css("left", infos[3]);
            newPlayer.css("opacity", 1);
        }
    }
});

socket.on("update-player", (id, infos) => {
    const updatePlayer = $(`#${id}`);
    $(`#${id}-name`).text(infos[0]);
    updatePlayer.css("background-color", infos[1]);
    updatePlayer.css("top", infos[2]);
    updatePlayer.css("left", infos[3]);
    $(`#${id}-eyes`).css("transform", infos[4])
});

function emitUpdate() {
    socket.emit("update-player", $("#player-name").text(), $("#player").css("background-color"), player.css("top"), player.css("left"), playerEyes.css("transform"));
}

$("#options").on('submit', function (e) {
    e.preventDefault();

    Cookies.set("username", $("#pseudo").val());
    const color = $("#player-color").val();
    color.replace("rgb(", "");
    color.replace(")", "");
    color.replace(",", "-");
    Cookies.set("color", color);

    emitUpdate();

    $("#player-name").text($("#pseudo").val());
    player.css("background-color", $("#player-color").val())
});

const speed = 20;

function getCoo(coo) {
    return parseInt(coo.replace("px", ""));
}

function canMove(top, left) {
    if (top <= 50) return false;
    if (left <= 50) return false;
    if (top >= 2000) return false;
    if (left >= 2000) return false;
    return true;
}

$("#tchat").on('submit', function (e) {
    e.preventDefault();

    const message = $("#message").val();

    socket.emit("player-send-message", message)

    $("#player-message-bubble-image").css("opacity", 1);
    $("#player-message-bubble-image").css("transform", "translateY(-125px)");
    $("#player-message-bubble").css("opacity", 1);
    $("#player-message-bubble").css("transform", "translateY(-133px)");
    $("#close-player-message-bubble").css("transform", "translateY(-175px) translateX(75px) scale(1)")
    $("#player-message").text(message);
    $("#message").val("");
});

socket.on("player-send-message", (id, message) => {
    $(`#${id}-message-bubble-image`).css("opacity", 1);
    $(`#${id}-message-bubble-image`).css("transform", "translateY(-125px)");
    $(`#${id}-message-bubble`).css("opacity", 1);
    $(`#${id}-message-bubble`).css("transform", "translateY(-133px)");
    $(`#close-${id}-message-bubble`).css("transform", "translateY(-175px) translateX(75px) scale(1)")
    $(`#${id}-message`).text(message);
});

function closeTchat(id) {
    $(`#close-${id}-message-bubble`).css("transform", "translateY(-175px) translateX(75px) scale(0)")
    $(`#${id}-message-bubble-image`).css("opacity", 0);
    $(`#${id}-message-bubble-image`).css("transform", "translateY(-100px)");
    $(`#${id}-message-bubble`).css("opacity", 0);
    $(`#${id}-message-bubble`).css("transform", "translateY(-100px)");
}

socket.on("player-disconnect", (id) => {
    $(`#${id}`).remove();
});

$("#enter-button").on("click", (e) => {
    $("#welcome-screen").css("opacity", 0);
    setTimeout(() => {
        $("#welcome-screen").remove();
    }, 2000);

    $("#player").css("opacity", 1);
    $("#player").show();
    socket.emit("player-join", playerName, playerColor, player.css("top"), player.css("left"), playerEyes.css("transform"));

    document.addEventListener('keydown', (e) => {
        move(e.key.replace("Arrow", "").toLowerCase());
    });
});