
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


socket.emit("player-join", playerName, playerColor, player.css("top"), player.css("left"), playerEyes.css("transform"));
socket.on("player-join", (id, infos) => {
    const newPlayerHTML =   `<div id="${id}" class="player">
                            <img id="${id}-eyes" class="player-eyes" src="imgs/eyes.png">
                            <span id="${id}-name" class="player-name">${infos[0]}</span>
                        </div>`;
    $("#game").append(newPlayerHTML);
    const newPlayer = $(`#${id}`);
    newPlayer.css("background-color", infos[1]);
    newPlayer.css("top", infos[2]);
    newPlayer.css("left", infos[3]);
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
                                    </div>`;
            $("#game").append(newPlayerHTML);
            const newPlayer = $(`#${key}`);
            newPlayer.css("background-color", infos[1]);
            newPlayer.css("top", infos[2]);
            newPlayer.css("left", infos[3]);
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

document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case "ArrowUp":
            player.css("top", (getCoo(player.css("top")) - speed ) + "px");
            break;
        case "ArrowDown":
            player.css("top", (getCoo(player.css("top")) + speed ) + "px");
            break;
        case "ArrowLeft":
            player.css("left", (getCoo(player.css("left")) - speed ) + "px");
            playerEyes.css("transform", "scaleX(-1)");
            break;
        case "ArrowRight":
            player.css("left", (getCoo(player.css("left")) + speed ) + "px");
            playerEyes.css("transform", "scaleX(1)");
            break;
        default:
            return;
    }
    emitUpdate();
});

socket.on("player-disconnect", (id) => {
    $(`#${id}`).remove();
});