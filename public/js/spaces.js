// const jquery341Min = include("./jquery-3.4.1.min");

// require (jquery341Min);


$("#close_cover_photo").on("click", function(){

    if($(".space_cover").hasClass("small_picture")){
    $(".space_cover").removeClass("small_picture");
    $("#close_cover_photo").html("Hide Image" + "<span> > </span>");
    $("#close_cover_photo").addClass("white_text");
    $("#close_cover_photo").removeClass("black_text");
    }
    else{
    $("#close_cover_photo").html("Show Image" + "<span> > </span>");
        $(".space_cover").addClass("small_picture");
    $("#close_cover_photo").removeClass("white_text");
    $("#close_cover_photo").addClass("black_text");
    }
})