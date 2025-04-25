const meetingContainer = document.getElementById("meetingContainer")
const footerContainer = document.getElementById("footer_container")
const searchQuery = document.getElementById("searchField")
const SearchForm = document.getElementById("searchForm")

if(SearchForm){
SearchForm.addEventListener("submit", function(e){
    e.preventDefault()
    if(searchQuery.value != ""){
        SearchForMeeting(searchQuery.value, 1)
    }else{
        NewMeetingPage(1)
    }
}) 

searchQuery.addEventListener("change", function(){
    if(searchQuery.value == ""){
        NewMeetingPage(1)
    }
})

}
 


function NewMeetingPage(page){
    meetingContainer.innerHTML  = "Loading...."

    fetch(`https://asfischolar.com/admin/meetings/list?page=${page}`, {
        method: "GET"
    }).then(res => res.json())
    .then(data => { 
        if(data){           
          
            updateUi(data)
        }
    })
}

NewMeetingPage(1)


// Search for meetings 
function SearchForMeeting(value, page){
    fetch(`https://asfischolar.com/admin/meetings/list?page=${page}&q=${value}`, {
        method:"GET"
    }).then(res => res.json())
    .then(data =>{
        if(data){
            updateUi(data)
        }
    })
}





function updateUi(data){
    meetingContainer.innerHTML = ""
         const MeetingsList = JSON.parse(data.meetingsList)
            const currentPage = data.currentPage
            const totalPages = data.totalPages
            const PrevPage = parseInt(currentPage, 10) - 1;
            const NexxtPage = parseInt(currentPage, 10) + 1;
        
            if(MeetingsList.length > 0){
                MeetingsList.forEach(meeting => {
                    const MeetingTitle = meeting.title 
                    const HostUrl = meeting.host_passphrase
                    const AttendeeUrl = meeting.viewer_passphrase
                    const date = formatTimestamp(meeting.created_at) 
                    const ChannelSecret = meeting.channel_secret


                    meetingContainer.innerHTML += `		   <tr>
                    <!-- Course item -->
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="mb-0 ms-2">
                                <!-- Title -->
                                <h6><a href="#">${MeetingTitle}</a></h6>
                                ${date}
                            </div>
                        </div>
                    </td>
                    <td>
                        <!-- Info -->
                        <div class="bg-opacity-10">
                        <a href="https://asfischolar.net/${HostUrl}">https://asfischolar.net/${HostUrl}</a>
                        </div>
                </td>


                    <!-- Assset Type -->
                    <td>
                        <a href="https://asfischolar.net/${AttendeeUrl}">https://asfischolar.net/${AttendeeUrl}</a>
                    </td>
            
                    <!-- Action item -->
                    <td class="action-table">
                  
                        <button type="button" class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0" onclick=DeleteChannel('${ChannelSecret}')>Delete</button>
              
                    </td>

                </tr>`
                });

                const paginationHTML = generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage);
                footerContainer.innerHTML = paginationHTML;        
            }else{
                meetingContainer.innerHTML = "Nothing to display yet"
}}


// PAGINATION SCRIPT 
function generatePaginationHTML(currentPage, totalPages, PrevPage, NexxtPage) {
    let paginationHTML = `
        <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
            <p class="mb-0 text-center text-sm-start">Page ${currentPage} of ${totalPages}</p>
            <nav class="d-flex justify-content-center mb-0" aria-label="navigation">
                <ul class="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0" id="footer_list">`;

    if (currentPage > 1) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewMeetingPage(${PrevPage})" tabindex="-1"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item mb-0 active"><a class="page-link" href="#"> ${i} </a></li>`;
        } else {
            paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewMeetingPage(${i})">  ${i}  </a></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item mb-0"><a class="page-link" onClick="NewMeetingPage(${NexxtPage})"><i class="fas fa-angle-right"></i></a></li>`;
    } else if(currentPage > totalPages) {
        paginationHTML += `<li class="page-item mb-0 disabled"><span class="page-link"><i class="fas fa-angle-right"></i></span></li>`;
    }

    paginationHTML += `</ul>
    </nav>
    </div>`;

    return paginationHTML;
}
 
