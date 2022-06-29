function move(direction) {
    switch (direction) {
        case "up":
            if (canMove(getCoo(player.css("top")) - speed, getCoo(player.css("left")))) player.css("top", (getCoo(player.css("top")) - speed ) + "px");
            break;
        case "down":
            if (canMove(getCoo(player.css("top")) + speed, getCoo(player.css("left")))) player.css("top", (getCoo(player.css("top")) + speed ) + "px");
            break;
        case "left":
            if (canMove(getCoo(player.css("top")), getCoo(player.css("left")) - speed)) {
                player.css("left", (getCoo(player.css("left")) - speed ) + "px");
                playerEyes.css("transform", "scaleX(-1)");
            }
            break;
        case "right":
            if (canMove(getCoo(player.css("top")), getCoo(player.css("left")) + speed)) {
                player.css("left", (getCoo(player.css("left")) + speed ) + "px");
                playerEyes.css("transform", "scaleX(1)");
            }
            break;
        default:
            return;
    }
    emitUpdate();
}