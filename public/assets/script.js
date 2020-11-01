var data;
var charlimit = 77;
var binId = "yKVddcjCYnHCLbMB";

function getData() {
    $.ajax({
        url: '/bin/' + binId,
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            data = response.data;
            DrawPostits(data);
        }
    });
}

function Setup() {
    getData()
        //DrawPostits([{text:"hello there",position:{x:200,y:200}},{text:"hello there 123",position:{x:400,y:200}}]);
}

var newPostit;

function DrawPostits(postits) {
    var counter = 0;
    postits.forEach(i => {

        createPostitHtml(i.text, i.position, counter);
        counter++;
    });
    setTimeout(() => {
        $(".mainPosts .postit").addClass("placed");
    }, 2000);
}

$(".new:not(.moving)").on("click", function() {
    if (newPostit) {
        return;
    }
    var text = prompt("What do you want your postit to say? (max " + charlimit + " chars)");

    if (text == null || text.length > charlimit) {
        return;
    }

    console.log("text recieved");
    $(this).text("Drag to place postit");
    //$(this).prependTo(".mainPosts")
    newPostit = {};
    newPostit.text = text;
    $(this).addClass("moving");
    var draggie = $('.moving').draggabilly({
        containment: ".mainPosts .postits"
    }).on("dragEnd", place);
});

function place(e) {
    var conf = confirm("Do you want to place you postit here?");

    if (!conf) {
        return;
    }

    var offset = $(".moving").offset();
    newPostit.position = {
        x: offset.left,
        y: offset.top
    };

    $(".moving").removeClass("moving");
    $("button").remove();

    createPostitHtml(newPostit.text, newPostit.position);
    makeNewPostit(newPostit.text, newPostit.position);
}

function makeNewPostit(text, position) {
    console.log("making");
    var postitToAdd = {
        text: escapeHtml(text),
        position: position
    };
    $.ajax({
        url: '/bin/' + binId,
        type: 'POST',
        data: JSON.stringify(postitToAdd),
        contentType: 'application/json',
        success: function(response) {
            console.log(JSON.stringify(response));
        }
    });
}

function createPostitHtml(text, position = {
    x: 1000,
    y: 1000
}, counter) {
    var htmlString =
        '<div class="postit prepost" ' +
        'style="top:' + position.y + 'px;left:' + position.x + 'px;transition-delay:' +
        (2 * counter / data.length) + 's">' +
        escapeHtml(text) +
        '</div>';
    $(".mainPosts .postits").append(htmlString);
    setTimeout(function() {
        $(".mainPosts .prepost").removeClass("prepost");
    }, 10);

}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

$(() => {
    Setup();
});





$("#why-button").on("click", () => {
    $(".mainPosts .postit").removeClass("placed");
    $(".mainPosts .postit").addClass("prepost");
    $(".new").fadeOut();
    setTimeout(() => {
        $(".mainPosts").fadeOut();
        $(".whyPosts").show();
        showWhyPostits();
    }, 2000);
});

function showWhyPostits() {
    $(".whyPosts").show();
    $(".whyPosts .postit").each((i, e) => {
        $(e).css("transition-delay", 0.1 + (1 * i / $(".whyPosts .postit").length) + "s");
    });
    $(".whyPosts .prepost").removeClass("prepost");
}