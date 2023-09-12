$(".close_panel").on("click", function(){
    $(".VC_sidebar").addClass("closed_sidebar")
})

$(".open_chats").on("click", function(){
    if($(".VC_sidebar").hasClass("closed_sidebar")){
        $(".VC_sidebar").removeClass("closed_sidebar");
    }
    else{
        // alert("Acccieon De repete")
    }
})


$(".raise_hand").on("click", function(){
    if($(".pop-up-message").hasClass("closed_pop_up")){
        $(".pop-up-message").removeClass("closed_pop_up")
        $(".raised_hand").removeClass("hide")
    }
    else{
        $(".pop-up-message").addClass("closed_pop_up")
        $(".raised_hand").addClass("hide")
    }
}) 