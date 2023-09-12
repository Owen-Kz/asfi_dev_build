
fetch("/directorySpaces", ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    // console.log(data.spacesArray)
    const spaces_container = document.getElementById("spaces_container")


    if(data.spacesArray.length > 0){
        data.spacesArray.forEach(space => {
            const space_cover = space.space_cover
            const space_description = space.space_description
            const space_focus = space.space_focus
            const members_count = space.members_count
            const space_id = space.space_id
            let spacePreview

            if(space_cover == "image.jpg" || space_cover == "images.jpg" || space_cover == "avatar.jpg" || space_cover == "cover.jpg"){
                spacePreview = ""
                }else{
                spacePreview = `/userUploads/spaceCovers/${space_cover}`
            }

            spaces_container.innerHTML += 
            `<div class="space">
            <a href="/spaces/${space_id}">
            <div class="image_container bg-purple-gradient">
            <img src="${spacePreview}"></div>
            </a><div class="title"> ${space_focus}</div>
            <div class="participants">${members_count} Participants  <span class="img bg-purple-gradient"><img src="https://eu.ui-avatars.com/api/?rounded=true&amp;background=random&amp;name=${space_focus}&amp;font-size=0.6;"></span></div></div>`;

        });
    }
})