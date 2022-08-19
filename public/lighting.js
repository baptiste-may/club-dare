
const gobos = ["dots", "gridball", "MG-05", "MG-06", "MG-07", "MG-13", "none", "none", "spiral"];

const spots = document.getElementsByClassName("spot");

function randomColor() {
    return rgbToHex(randomInt(256), randomInt(256), randomInt(256));
}

function randomGobo() {
    return "imgs/gobo/" + gobos[randomInt(gobos.length)] + ".png";
}

function animeSpots() {
    for (i = 0; i < spots.length; i++) {
        const spot = spots[i];
        spot.style.filter = `opacity(0.4) drop-shadow(0 0 0 ${randomColor()})`;
        spot.style.transform = `rotate(${randomInt(1080)}deg)`;
        spot.style.top = randomInt(1800) + "px";
        spot.style.left = randomInt(1800) + "px";
        spot.src = randomGobo();
    }
}

let interval = null;
function setGobos(number, timer) {

    clearInterval(interval);
    $("#spots").empty();

    if (number == 0) return;

    for (i = 0; i <= number; i++) {
        const spot = document.createElement("img");
        spot.style.transition = `all ${timer}ms linear, transform ${timer}ms ease-in`;
        spot.className = "spot";
        spot.src = "imgs/gobo/spiral.png";
        document.getElementById("spots").appendChild(spot);
    }

    animeSpots();
    setTimeout(animeSpots, 10);
    interval = setInterval(animeSpots, timer);
}

function gobosUpdate() {
    setGobos($("#gobo-range").val(), $("#gobo-timer").val());

    const data = {number: $("#gobo-range").val(), timer: $("#gobo-timer").val()};
    socket.emit("edit-lighting-gobos", Cookies.get("secret-token"), data);
}

$("#gobo-range").on("input", gobosUpdate);
$("#gobo-timer").on("input", gobosUpdate);


maxDeg = 45;
movement = true;
function moveSpot() {
    if (movement) {
        $("#spot1").css("transform", `rotate(${maxDeg}deg)`);
        $("#spot2").css("transform", `rotate(-${maxDeg}deg)`);
    } else {
        $("#spot1").css("transform", `rotate(-${maxDeg}deg)`);
        $("#spot2").css("transform", `rotate(${maxDeg}deg)`);
    }
    movement = ! movement;
    /*
    $("#spot1").css("filter", `opacity(0.4) drop-shadow(0 0 0 ${randomColor()})`);
    $("#spot2").css("filter", `opacity(0.4) drop-shadow(0 0 0 ${randomColor()})`);
    */
}

setInterval(moveSpot, 2000);

light = true;
flash = false;
setInterval(() => {
    if (flash) {
        if (light) {
            $("#spot1").attr("src", "imgs/light-beam-off.png");
            $("#spot2").attr("src", "imgs/light-beam-off.png");
        } else {
            $("#spot1").attr("src", "imgs/light-beam-on.png");
            $("#spot2").attr("src", "imgs/light-beam-on.png");
        }
        light = !light;
    } else {
        $("#spot1").attr("src", "imgs/light-beam-off.png");
        $("#spot2").attr("src", "imgs/light-beam-off.png");
    }
}, 50);

function washUpdate() {
    socket.emit("edit-lighting-wash", Cookies.get("secret-token"), flash);
}

const washButton = $("#wash-button");
washButton.on("click", () => {
    flash = !flash;
    if (flash) {
        washButton.val("Déactiver");
        $("#wash-title").text("Wash ⚪️");
    } else {
        washButton.val("Activer");
        $("#wash-title").text("Wash ⚫️");
    }
    washUpdate();
});


socket.emit("get-lighting");
socket.on("get-lighting", (data) => {
    data = JSON.parse(data);
    const gobosData = data.gobos;
    setGobos(parseInt(gobosData.number), parseInt(gobosData.timer));
    const washData = data.wash;
    flash = washData;
});

socket.on("edit-lighting-gobos", (data) => {
    data = JSON.parse(data);
    setGobos(parseInt(data.number), parseInt(data.timer));
});
socket.on("edit-lighting-wash", (data) => {
    flash = JSON.parse(data);
});