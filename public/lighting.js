
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
function setSpots(number, timer) {

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

socket.emit("get-lighting");
socket.on("get-lighting", (data) => {
    data = JSON.parse(data);
    const spotsData = data.spots;
    setSpots(parseInt(spotsData.number), parseInt(spotsData.timer));
});

function spotsUpdate() {
    setSpots($("#gobo-range").val(), $("#gobo-timer").val());

    const data = {spots: {number: $("#gobo-range").val(), timer: $("#gobo-timer").val()}};
    socket.emit("edit-lighting", Cookies.get("secret-token"), data);
}

$("#gobo-range").on("input", spotsUpdate);
$("#gobo-timer").on("input", spotsUpdate);


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


socket.on("edit-lighting", (data) => {
    data = JSON.parse(data);
    const spotsData = data.spots;
    setSpots(parseInt(spotsData.number), parseInt(spotsData.timer));
});