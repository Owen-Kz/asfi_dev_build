const  InstructorListContainer = document.getElementById("InstructorListContainer")
const tableInstructorList = document.getElementById("tableInstructorList")
const footerContainer = document.getElementById("footer_container") 

async function UpdateInstructorsList(InstructorsArray, data){
   
        const List = InstructorsArray
             InstructorListContainer.innerHTML = `<tr><td><span>Loading.....</span></td></tr>`
            if(List.length > 0){
                InstructorListContainer.innerHTML = ``
                tableInstructorList.innerHTML = ``
                const CurrentPage = data.currentPageInstructors
                const TotalPages = data.totalPagesInstructors
                const TotalInstructors = data.totalInstructors
                const PrevPage = Math.floor(parseInt(CurrentPage) - 1)
                const NexxtPage = Math.floor(parseInt(CurrentPage) + 1)
                List.forEach(async Instructor => {
    
                    const Instructor_name = `${Instructor.first_name} ${Instructor.last_name}`
                    const InstructorUsername = Instructor.username
                    const InstructorLocation = Instructor.home_address
                    const InstructorProfilePicture = Instructor.profile_picture
                    const Email = Instructor.email
                    const Bio = Instructor.bio
                    const messageLink = `https://asfischolar.org/${InstructorUsername}/chat`
                    // const date_uploaded = formatTimestamp(Instructor.date_updated)
                    
                    let ProfileSource
                    if(InstructorProfilePicture == "avatar.jpg"){
                        ProfileSource = `https://eu.ui-avatars.com/api/?background=random&amp;name=${Instructor_name}&amp;font-size=0.6`
                    }else{
                        ProfileSource = await fetchProfileImage(InstructorProfilePicture)
                        
                    }                   
                   
                    await fetch(`/admin/totalCourse/instructor/${InstructorUsername}`, ()=>{
                        method:"GET"
                    }).then(res => res.json())
                    .then(data =>{
                        const TotalCourses = data.TotalCourses

             
                        fetch(`/totalBooks/${InstructorUsername}`, ()=>{
                            method : "GET"
                        }).then(res => res.json())
                        .then(data =>{
                            const TotalBooks = data.TotalBooks

                            fetch(`/totalPodcasts/${InstructorUsername}`, ()=>{
                                method: "GET"
                            }).then(res => res.json())
                            .then(data =>{
                                const TotalPodcasts = data.TotalPodcasts

                                fetch(`/totalLinks/${InstructorUsername}`, ()=>{
                                    method :"GET"
                                }).then(res => res.json())
                                .then(data =>{
                            const TotalLinks = data.TotalLinks

                            const TotalResources = Math.floor(TotalLinks + TotalBooks + TotalPodcasts)

                            fetch(`/admin/instructors/totalStudents/${InstructorUsername}`, ()=>{
                                method : "GET"
                            }).then(res => res.json())
                            .then(data =>{
                                const TotalStudents = data.TotalStudents

                    InstructorListContainer.innerHTML += `<div class="col-md-6 col-xxl-4">
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
                                    <h5 class="mb-0"><a href="#">${Instructor_name}</a></h5>
                                    <span class="text-body small"><i class="fas fa-fw fa-map-marker-alt me-1 mt-1"></i>${InstructorLocation}</span>
                                </div>
                            </div>

                            <!-- Edit dropdown -->
                            <div class="dropdown text-end">
                                <a href="#" class="btn btn-sm btn-light btn-round small mb-0" role="button" id="dropdownShare2" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots fa-fw"></i>
                                </a>
                                <!-- dropdown button -->
                                <ul class="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare2">
                                    <li><a class="dropdown-item" href="/admin/Instructors/details/${InstructorUsername}"><i class="bi bi-pencil-square fa-fw me-2"></i>View Detail</a></li>
                                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#blockScholar" onClick='UpdateBlockModal("${Instructor_name}", "${Email}", "${InstructorUsername} ")'><i class="bi bi-trash fa-fw me-2" ></i>Remove</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="card-body">
                        <!-- Total students -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center">
                                <div class="icon-md bg-orange bg-opacity-10 text-orange rounded-circle flex-shrink-0"><i class="fas fa-user-graduate fa-fw"></i></div>
                                <h6 class="mb-0 ms-2 fw-light">Total Students</h6>
                            </div>
                            <span class="mb-0 fw-bold">${TotalStudents}</span>
                        </div>

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
                                    <h6 class="mb-0 ms-2 fw-light">Total Courses </h6>
                                </div>
                                <span class="mb-0 fw-bold">${TotalCourses}</span>
                            </div>
                        </div>

                        <!-- Card footer -->
                        <div class="card-footer bg-transparent border-top">
                            <div class="d-sm-flex justify-content-between align-items-center">
                                <!-- Rating star -->
                                <h6 class="mb-2 mb-sm-0">
                                    
                                </h6>
                                <!-- Buttons -->
                                <div class="text-end text-primary-hover">
                                    <a href="${messageLink}" class="btn btn-link text-body p-0 mb-0 me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Message" aria-label="Message">
                                        <i class="bi bi-envelope-fill"></i>
                                    </a>
                               
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`

                // FOR TABLE LAYOUT
                tableInstructorList.innerHTML += `<!-- Table row -->
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
                                <h6 class="mb-0"><a href="#" class="stretched-link">${Instructor_name}</a></h6>
                                <span class="text-body small"><i class="fas fa-fw fa-map-marker-alt me-1 mt-1"></i>${InstructorLocation}</span>
                            </div>
                        </div>
                    </td>
                    <td>${Bio} </td>

                    <!-- Table data -->
                    <td>${TotalCourses}</td>

                    <!-- Table data -->
                    <td>${TotalStudents}</td>

                   

                    <!-- Table data -->
                    <td>${TotalResources}</td>

                    <!-- Table data -->
                    <td>
                    <a href=""${messageLink}" class="btn btn-info-soft btn-round me-1 mb-1 mb-md-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Message">
                        <i class="bi bi-envelope"></i>
                    </a>
                    <a href="/admin/instructors/details/${InstructorUsername}" class="btn btn-success-soft btn-round me-1 mb-1 mb-md-0" data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                        <i class="bi bi-eye"></i>
                    </a>
                    <button class="btn btn-danger-soft btn-round mb-0" data-bs-toggle="modal" data-bs-target="#blockScholar" onClick='UpdateBlockModal("${Instructor_name}", "${Email}", "${InstructorUsername} ")'>
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                </tr>`
                                })
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
                InstructorListContainer.innerHTML =  `<tr><td>Nothing to show</td></tr>`
              footerContainer.innerHTML = ""
            }
    }



    // UpdateBlockModal("Human Nature", "humanemail@gmail.com", "userID")