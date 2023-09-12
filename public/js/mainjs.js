$(".stack-bars").on("click", function(){

    if($(".left-navigation-bar").hasClass("left-navigation-bar-open")){
        $(".left-navigation-bar").removeClass("left-navigation-bar-open");
        $(".stack-bars").removeClass("marginLeft-70")
    }
    else{
        $(".left-navigation-bar").addClass("left-navigation-bar-open");
        $(".stack-bars").addClass("marginLeft-70")
    }
})

$(".search").on("click", function(){
    if($(".search").hasClass("show_search_Icon")){
        $(".search").removeClass("show_search_Icon")
        $(".search").addClass("close_search_Icon")
        $(".Search").removeClass("find_page")
        $(".Search").addClass("Search_input")

    }
    else{
        $(".search").removeClass("close_search_Icon")
        $(".search").addClass("show_search_Icon")
        $(".Search").addClass("find_page")
        $(".Search").removeClass("Search_input")


    }
})