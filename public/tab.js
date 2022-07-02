
tabOpened = true;

$("#hide-show-tab").on("click", (e) => {
    e.preventDefault();

    const mobileControl = $("#mobile-control");
    const button = $("#hide-show-tab");
    const tab = $("#tab");

    tabOpened = !tabOpened;
    if (tabOpened) {
        button.css("transform", "rotate(0deg)")
        tab.css("height", "20%");
        mobileControl.css("bottom", "30%");
    } else {
        button.css("transform", "rotate(180deg)")
        tab.css("height", "5%");
        mobileControl.css("bottom", "15%");
    }
});

tabShow = true;

document.addEventListener('keydown', (e) => {
    if (e.key == " " && e.target.nodeName !== "INPUT") {
        tabShow = !tabShow;
        if (tabShow) $("#tab").show();
        else $("#tab").hide();
    }
});

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