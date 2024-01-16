const  ScholarListContainer = document.getElementById("ScholarListContainer")
const tableScholarList = document.getElementById("tableScholarList")
const footerContainer = document.getElementById("footer_container") 

function UpdateScholarsList(scholarsArray, data){
   
        const List = scholarsArray
             ScholarListContainer.innerHTML = `<tr><td><span>Loading.....</span></td></tr>`
            if(List.length > 0){
                ScholarListContainer.innerHTML = ``
                tableScholarList.innerHTML = ``
                const CurrentPage = data.currentPageScholars
                const TotalPages = data.totalPagesScholars
                const TotalScholars = data.totalScholars
                const AdminBuffer = data.adminBuffer
                const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
                const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)
                List.forEach(async Scholar => {
                   
                    const Scholar_name = `${Scholar.first_name} ${Scholar.last_name}`
                    const ScholarUsername = Scholar.username
                    const ScholarLocation = Scholar.home_address
                    const ScholarProfilePicture = Scholar.profile_picture
                    const Email  = Scholar.email
            
                    const messageLink = `/@${ScholarUsername}/chat?admin=${AdminBuffer}`
                    const date_joined = formatTimestamp(Scholar.joined_date)
                    
                    let ProfileSource
                    if(ScholarProfilePicture == "avatar.jpg"){
                        ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Scholar_name}&amp;font-size=0.6`
                    }else{
                        ProfileSource = await fetchProfileImage(ScholarProfilePicture)
                    }                   

                    fetch(`/totalCourseTaken/pages/scholar/${ScholarUsername}`, ()=>{
                        method:"GET"
                    }).then(res => res.json())
                    .then(data =>{
                        const TotalCourses = data.TotalCoursesTaken
          
                        fetch(`/totalBooks/${ScholarUsername}`, ()=>{
                            method : "GET"
                        }).then(res => res.json())
                        .then(data =>{
                            const TotalBooks = data.TotalBooks

                            fetch(`/totalPodcasts/${ScholarUsername}`, ()=>{
                                method: "GET"
                            }).then(res => res.json())
                            .then(data =>{
                                const TotalPodcasts = data.TotalPodcasts

                                fetch(`/totalLinks/${ScholarUsername}`, ()=>{
                                    method :"GET"
                                }).then(res => res.json())
                                .then(data =>{
                            const TotalLinks = data.TotalLinks

                            const TotalResources = Math.floor(TotalLinks + TotalBooks + TotalPodcasts)


                    ScholarListContainer.innerHTML += `<div class="col-md-6 col-xxl-4">
                    <div class="card bg-transparent border h-100"> 
                        <!-- Card header -->
                        <div class="card-header bg-transparent border-bottom d-flex justify-content-between">
                            <div class="d-sm-flex align-items-center">
                                <!-- Avatar -->
                                <div class="avatar avatar-md flex-shrink-0">
                                    <img class="avatar-img rounded-circle" src="${ProfileSource}" alt="avatar">
                                </div>
                                <!-- Info -->
                                <div class="ms-0 ms-sm-2 mt-2 mt-sm-0">
                                    <h5 class="mb-0"><a href="#">${Scholar_name}</a></h5>
                                    <span class="text-body small"><i class="fas fa-fw fa-map-marker-alt me-1 mt-1"></i>${ScholarLocation}</span>
                                </div>
                            </div>

                            <!-- Edit dropdown -->
                            <div class="dropdown text-end">
                                <a href="#" class="btn btn-sm btn-light btn-round small mb-0" role="button" id="dropdownShare2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots fa-fw"></i>
                                </a>
                                <!-- dropdown button -->
                                <ul class="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare2">
                                    <li><a class="dropdown-item" href="/admin/scholars/details/${ScholarUsername}"><i class="bi bi-pencil-square fa-fw me-2"></i>View Detail</a></li>
                                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#blockScholar" onClick='UpdateBlockModal("${Scholar_name}", "${Email}", "${ScholarUsername} ")'><i class="bi bi-trash fa-fw me-2"></i>Remove</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="card-body">
                            <!-- Resources -->
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="icon-md bg-success bg-opacity-10 text-success rounded-circle flex-shrink-0"><i class="bi bi-book-half fa-fw"></i></div>
                                    <h6 class="mb-0 ms-2 fw-light">Total Resources</h6>
                                </div>
                                <span class="mb-0 fw-bold">${TotalResources}</span>
                            </div>

                            <!-- Total courses -->
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="icon-md bg-purple bg-opacity-10 text-purple rounded-circle flex-shrink-0"><i class="fas fa-book fa-fw"></i></div>
                                    <h6 class="mb-0 ms-2 fw-light">Total Course Taken</h6>
                                </div>
                                <span class="mb-0 fw-bold">${TotalCourses}</span>
                            </div>
                        </div>

                        <!-- Card footer -->
                        <div class="card-footer bg-transparent border-top">
                            <div class="d-sm-flex justify-content-between align-items-center">
                                <!-- Rating star -->
                                <h6 class="mb-2 mb-sm-0">
                                    <i class="bi bi-calendar fa-fw text-orange me-2"></i><span class="text-body">Join on:</span> ${date_joined}
                                </h6>
                                <!-- Buttons -->
                                <div class="text-end text-primary-hover">
                                    <a href="${messageLink}" class="btn btn-link text-body p-0 mb-0 me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Message" aria-label="Message">
                                        <i class="bi bi-envelope-fill"></i>
                                    </a>
                                    <a href="#" class="btn btn-link text-body p-0 mb-0" data-bs-placement="top" title="" data-bs-original-title="Block" aria-label="Block" data-bs-toggle="modal" data-bs-target="#blockScholar" onClick='UpdateBlockModal("${Scholar_name}", "${Email}", "${ScholarUsername} ")'>
                                        <i class="fas fa-ban"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`

                // FOR TABLE LAYOUT
                tableScholarList.innerHTML += `<!-- Table row -->
                <tr>
                    <!-- Table data -->
                    <td>
                        <div class="d-flex align-items-center position-relative">
                            <!-- Image -->
                            <div class="avatar avatar-md">
                            <img class="avatar-img rounded-circle" src="${ProfileSource}" alt="avatar">
                            </div>
                            <div class="mb-0 ms-3">
                                <!-- Title -->
                                <h6 class="mb-0"><a href="#" class="stretched-link">${Scholar_name}</a></h6>
                                <span class="text-body small"><i class="fas fa-fw fa-map-marker-alt me-1 mt-1"></i>${ScholarLocation}</span>
                            </div>
                        </div>
                    </td>

                    <!-- Table data -->
                    <td>${TotalCourses}</td>

                    <!-- Table data -->
                    <td>${TotalResources}</td>

                    <!-- Table data -->
                    <td>
                        <a href="/admin/scholars/details/${ScholarUsername}" class="btn btn-light btn-round me-1 mb-1 mb-md-0" data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                            <i class="bi bi-eye"></i>
                        </a>
                        <a href="${messageLink}" class="btn btn-light btn-round me-1 mb-1 mb-md-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Message">
                            <i class="bi bi-envelope"></i>
                        </a>
                        
                        <button class="btn btn-light btn-round mb-0" data-bs-toggle="modal" data-bs-target="#blockScholar" onClick='UpdateBlockModal("${Scholar_name}", "${Email}", "${ScholarUsername} ")'>
                            <i class="fas fa-ban"></i>
                        </button>
                    </td>
                </tr>`
                                })
                            })
                        })


                    })
    
   
    
                });
                if(TotalPages > 0){
                    // Update the pagination UI
                   
                    if(footerContainer){
                   const paginationHTML = paginationFotTutorials(CurrentPage, TotalPages, PrevPage, NexxtPage);
                   footerContainer.innerHTML = paginationHTML;
                    }
                }
    
            }else{
                ScholarListContainer.innerHTML =  `<tr><td>Nothing to show</td></tr>`
              footerContainer.innerHTML = ""
            }
    }



    // UpdateBlockModal("Human Nature", "humanemail@gmail.com", "userID")