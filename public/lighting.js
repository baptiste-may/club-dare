
const gobos = ["dots", "gridball", "MG-05", "MG-06", "MG-07", "MG-13", "spiral"];

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
        spot.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${randomColor()})`;
        spot.style.transform = `rotate(${randomInt(1080)}deg)`;
        spot.style.top = randomInt(2000) + "px";
        spot.style.left = randomInt(2000) + "px";
        spot.src = randomGobo();
    }
}

animeSpots();
setTimeout(() => {
    animeSpots();
}, 1);
setInterval(animeSpots, 3000);