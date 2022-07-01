
const gobos = ["dots", "gridball", "MG-05", "MG-06", "MG-07", "MG-13", "none", "spiral"];

for (i = 0; i <= 20; i++) {
    const spot = document.createElement("img");
    spot.className = "spot";
    spot.src = "imgs/gobo/spiral.png";
    document.getElementById("spots").appendChild(spot);
}

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

animeSpots();
setTimeout(() => {
    animeSpots();
}, 1);
setInterval(animeSpots, 3000);


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
