
const socket = io();

var hasSecretToken = false;
socket.emit("check-secret-token", Cookies.get("secret-token"));
socket.on("check-secret-token", (res) => {
    hasSecretToken = res;
    if (!res) {
        $("#lighting-button").remove();
        $("#lighting-tab").remove();
    }
});

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

player.css("left", "1000px");
player.css("top", "1000px");

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

const speed = 20;

function getCoo(coo) {
    return parseInt(coo.replace("px", ""));
}

privateZone = []
privateZone.push({firstPoint: {top: 50, left: 550}, secondPoint: {top: 400, left: 1450}});

async function canMove(top, left) {
    if (top <= 50) return false;
    if (left <= 50) return false;
    if (top >= 2000) return false;
    if (left >= 2000) return false;

    if (hasSecretToken) return true;

    for (i = 0; i < privateZone.length; i++) {
        const zone = privateZone[i];
        const firstPoint = zone.firstPoint;
        const secondPoint = zone.secondPoint;
        if ((firstPoint.top <= top && top <= secondPoint.top) &&
            (firstPoint.left <= left && left <= secondPoint.left))
            return false;
    }
    return true;
}

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
    document.body.onwheel = onScrollWheel;
    document.getElementById('can-move').addEventListener('mousedown', mouseDownHandler);
});

$("#secret-code-input").focusout(() => {
    Cookies.set("secret-token", $("#secret-code-input").val());
});