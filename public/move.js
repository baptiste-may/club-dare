function move(direction) {
    switch (direction) {
        case "up":
            canMove(getCoo(player.css("top")) - speed, getCoo(player.css("left"))).then((res) => { if (res) player.css("top", (getCoo(player.css("top")) - speed ) + "px") });
            break;
        case "down":
            canMove(getCoo(player.css("top")) + speed, getCoo(player.css("left"))).then((res) => { if (res) player.css("top", (getCoo(player.css("top")) + speed ) + "px") });
            break;
        case "left":
            canMove(getCoo(player.css("top")), getCoo(player.css("left")) - speed).then((res) => { if (res)
                player.css("left", (getCoo(player.css("left")) - speed ) + "px");
                playerEyes.css("transform", "scaleX(-1)");
            });
            break;
        case "right":
            canMove(getCoo(player.css("top")), getCoo(player.css("left")) + speed).then((res) => { if (res)
                player.css("left", (getCoo(player.css("left")) + speed ) + "px");
                playerEyes.css("transform", "scaleX(1)");
            });
            break;
        default:
            return;
    }
    emitUpdate();
}