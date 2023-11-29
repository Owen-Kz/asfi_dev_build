// FOR FOLLOWING THE PERSON'S PROFILE 
// var followButton = document.getElementById("Follow");
var followButton = document.getElementsByClassName("FollowButton");
var submitFollow = document.getElementById("submitFollow")
var submitUNFollow = document.getElementById("submitUNFollow")
var FL_count = document.getElementById("FL_COUNT")

$("#Follow").on("click", () =>{
    $("#Follow").innerText = "Following";
    submitFollow.click()
    FL_count.innerText = new Number(FL_count.innerText) + 1
 
})

$("#Following").on("click", () =>{
    var FARGO = new Number(FL_count.innerText)
    var  followersCT =  $("#FCT").val()
    var marLA =  followersCT - 1;

    if(FARGO > marLA){
    $("#Following").innerText = "Follow"
    $("#UnfollowForm").submit()
    FL_count.innerText = new Number(FL_count.innerText) - 1
    }else{

    }
    // }
})

// Follow user 
$("#follow").on("submit", () =>{


    const newFollowing = {
        followed: followed_account.value,
        follower: follower.value
    }
fetch("/api/createFollower", {
    method: "POST",
    body: JSON.stringify(newFollowing),
    headers: { 
        "Content-type" : "application/JSON"
    }
}).then(res => res.json())
.then(data => {
    if(data.status == "error") {
        console.log(data.error);
    }else{
        window.location.reload()
    }
  })
})


// unfollow user 
$("#UnfollowForm").on("submit", () =>{
    const newUNFollow = {
        UNfollowed: UNfollowed_account.value,
        UNfollower: UNfollower.value
    }

fetch("/api/delFollower", {
    method: "POST",
    body: JSON.stringify(newUNFollow),
    headers: { 
        "Content-type" : "application/JSON"
    }
}).then(res => res.json())
.then(data => {
    if(data.status == "error") {
        console.log(data.error);
    } else{
        window.location.reload()
    }
  })
})