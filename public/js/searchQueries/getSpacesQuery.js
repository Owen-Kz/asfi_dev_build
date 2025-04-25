async function getParticipantsCount(space) {
    try {
        const response = await fetch(`/spaces/total/perticipants/${space}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const participantsCount = data.ParticipantsCount;
        return participantsCount;
    } catch (error) {
        console.error('There was a problem fetching number of participants:', error);
        return null;
    }
}

// // Usage
// const members_count = await getParticipantsCount(space_id);
// console.log(members_count); // Use the received participants count


fetch("/directorySpaces", async ()=>{
    method:"GET"
})
.then(res => res.json())
.then(data =>{
    // console.log(data.spacesArray)
    const spaces_container = document.getElementById("spaces_container")


    if(data.spacesArray.length > 0){
        data.spacesArray.forEach(async (space) => {
            const space_cover = space.space_cover
            const space_description = space.space_description
            const space_focus = space.space_focus

        

            const space_id = space.space_id
            const members_count =   await getParticipantsCount(space_id)



            // .then(count => {
            //     // Output the received image URL
            //             if (count) {
            //                 members_count  = count
            //             }
            //         });
            let spacePreview

            if(space_cover == "image.jpg" || space_cover == "images.jpg" || space_cover == "avatar.jpg" || space_cover == "cover.jpg"){
                spacePreview = `https://eu.ui-avatars.com/api/?rounded=false&amp;background=7f417d&amp;color=fff&amp;name=${space_focus}&amp;font-size=0.4`
                }else{
                spacePreview = `${space_cover}`
            }

            spaces_container.innerHTML += 
            `<div onclick="window.location.href='/spaces/${space_id}'" class="space">
              <a href="/spaces/${space_id}">
               <div class="image_container bg-purple-gradient">
               <img src="${spacePreview}">
                </div>
               </a>
            <div class="space-info">
              <span class="title"> ${space_focus}</span>
              <span class="participants">${members_count} Participants </span>
            </div>
              <a href="/spaces/${space_id}" class="join">Join Space</a>
            </div>`;

        });
    }
})