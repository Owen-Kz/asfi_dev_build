$(".release_spaces").on("click", function(){
    if($(".spaces_container").hasClass("closed_spaces_container")){
        $(".spaces_container").removeClass("closed_spaces_container")
        $(".accounts_container").addClass("closed_accounts_container")
        // THIS PART OF THE SATEMENT CHANGES THE TEXT ON THE BOTTOM NAVIGATION BUTTON I.e from SPACES to scholars 
        $(".release_spaces").text("Scholars")

        // THIS PART OF THE STATEMENT CHANGES THE VALUE OF SEARHC QUERY CATERGORIES 
        $("#search_category").val("spaces")
    }
    else{
        $(".spaces_container").addClass("closed_spaces_container")
        $(".accounts_container").removeClass("closed_accounts_container")
        $(".release_spaces").text("Spaces")
        // THIS PART OF THE STATEMENT CHANGES THE VALUE OF SEARHC QUERY CATERGORIES 
        $("#search_category").val("scholars")
    }
})


$("#FollowingSlide").on("click",function(){
    if($("#DiscoverSlide").hasClass("active")){
        $("#DiscoverSlide").removeClass("active")
        $("#FollowingSlide").addClass("active");

        $(".followingContainer").css("display", "none");
        $(".discoverContainer").css("display", "flex")
    }
})

$("#DiscoverSlide").on("click",function(){
    if($("#FollowingSlide").hasClass("active")){
        $("#FollowingSlide").removeClass("active")
        $("#DiscoverSlide").addClass("active");
        
        $(".discoverContainer").css("display", "none");
        $(".followingContainer").css("display", "flex")
    }
})