var SpaceModal = document.getElementById("CreateSpaceModal");

var Spacebtn = document.getElementById("CreateSpaceBtn");

var SpaceSpan = document.getElementsByClassName("tutclose")[0];

const beforeSpace = document.querySelector('.before_space_create');

Spacebtn.onclick = function() {
    SpaceModal.style.display = "flex";
    beforeSpace.innerHTML = `<h5 class="header_p"><i class="fa fa-users"></i> Create Space/Forum</h5> <br><br>
             <!-- Step 2 content START -->
							<div class="upload_container">
                                <form enctype="multipart/form-data" class="book_upload"  id="space" style="width: 100%;">

									<input type="text" readonly value="" name="bufferSpace" id="bufferSpace" hidden>
    								
									<!-- Upload image START -->
									<div class="left_uploadBook">
									    <div class="text-center justify-content-center align-items-center border border-2 border-dashed rounded-3">
											
											<img src="/files/images/gallery.svg" class="h-50px" alt="">
											<div>
												<h6 class="my-2">Upload Space/Forum Thumbnail here</h6>
												
													<span> 
													<input class="form-control " type="file" name="thumbnail" accept="image/*" id="thumbnail" />
													</span>
													<p class="small mb-0 mt-2"><b>Note:</b> Only JPG, JPEG and PNG. Larger image will be cropped to 4:3 to fit our thumbnails/previews.</p>
											</div>	
										</div>
									</div>
									<!-- <br><br> -->
									<!-- Upload image END -->
                                 

									<!-- Upload publication START -->
									<div class="col-12 left_uploadPublication">
										<!-- Input -->
										<div class="col-12">
                                            <h6 class="text-info">Create Space/Forum</h6>
											<label class="form-label">Space Title</label>
                                            <div class="input-group mb-3">
                                               <input type="text" class="form-control" name="spaceTitle" id="spaceTitle" value="" placeholder="Title goes here..." required>
                                            </div>
                                            <label class="form-label">Space/Forum Description</label>
                                            <div class="input-group mb-3">
											   <textarea class="form-control" name="shortDescription" id="shortDescription" palcecols="30" rows="10" required placeholder="Write a schort description about this space"></textarea>
										
                                            </div>
											<label class="form-label">Make this space private?</label>
                                            <div class="input-group mb-3">
                                               <input type="radio" class="" name="privateSpace" id="privateSpaceYes" value="yes" required> Yes
											   <input type="radio" class="" name="privateSpace" id="privateSpaceNo" value="no" style="margin-left: 10px;" required> No
                                            </div>


                                            
                                           <button type="submit" id="create_SPACE" hidden>Create</button>
										</div>

                                    </div>
                                </form>
										
							</div>
									<!-- Book Upload END -->
							<!-- Step 2 content END -->
                    <span class="submitBook" id="createNew_space">Create</span>`
          InitializeSubmission()
}
SpaceSpan.onclick = function() {
  SpaceModal.style.display = "none";
}

window.addEventListener = function(event) {
    if (event.target == SpaceModal) {
      SpaceModal.style.display = "none";
    }
  }


  function InitializeSubmission(){
    genSpaceBuffer()

    // GENERATE RANDOM ID
    function genSpaceBuffer() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var passwordLength = 24;
        var bufferID = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            bufferID += chars.substring(randomNumber, randomNumber + 1);
        }
        document.getElementById("bufferSpace").value = bufferID
    }

    // Handle Form Submission
    const thumbnail = document.getElementById("thumbnail");
    const createNew_Space = document.getElementById("createNew_space");
    const shortDescription = document.getElementById("shortDescription");
    const spaceTitle = document.getElementById("spaceTitle");

    createNew_Space.addEventListener("click", function(){
        if (thumbnail.files[0]) {
            const FILE_SIZE = thumbnail.files[0].size;
            const FILE_TYPE = thumbnail.files[0].type;

            if (FILE_SIZE > 1000000000) {
                alert("File is too Large");
                return;
            }

            if (FILE_TYPE !== "image/png" && FILE_TYPE !== "image/jpeg" && FILE_TYPE !== "image/jpg") {
                alert("File is Not an image");
                return;
            }

            // Trigger form submission
            document.getElementById("create_SPACE").click();
        }
    });

    const space = document.getElementById("space");

    space.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get the selected radio button value
        const isPrivate = document.querySelector('input[name="privateSpace"]:checked').value;

        // Create FormData object
        const formData = new FormData(space); // Automatically collects all form data

        // Append additional necessary fields
        formData.append("thumbnail", thumbnail.files[0]);
        formData.append("bufferSpace", document.getElementById("bufferSpace").value);
        formData.append("spaceTitle", spaceTitle.value);
        formData.append("shortDescription", shortDescription.value);
        formData.append("isPrivate", isPrivate);
        console.log(formData)

        // Send the FormData via fetch
        fetch("/createSpaces", {
            method: "POST",
            body: formData // Send FormData as the request body
        })
        .then(res => res.json())
        .then(data => {
            const beforeSpace = document.querySelector('.before_space_create');
            if (isPrivate === "yes") {
                beforeSpace.innerHTML = `
                    <div class="create_space_notification">
                        <h2 class="header_p">${data.message}!</h2>
                        <p>Your space Key is:</p> 
                        <h3 style="font-weight:bold; color:black;">${data.space_key}</h3>
                        <div class="create_buttons">
                            <a href="/s/m/p/${document.getElementById('bufferSpace').value}/settings">
                                <span class="submitBook" id="invite_users">Invite Users</span>
                            </a> 
                            <a href="/spaces/${document.getElementById('bufferSpace').value}">
                                <span class="submitBook" id="Proceed">Proceed to Space</span>
                            </a>
                        </div>
                    </div>`;
            } else {
                beforeSpace.innerHTML = `
                    <div class="create_space_notification">
                        <h2 class="header_p">${data.message}!</h2>
                        <div class="create_buttons">
                            <a href="/s/m/p/${document.getElementById('bufferSpace').value}/settings">
                                <span class="submitBook" id="invite_users">Invite Users</span> 
                            </a> 
                            <a href="/spaces/${document.getElementById('bufferSpace').value}">
                                <span class="submitBook" id="Proceed">Proceed to Space</span>
                            </a>
                        </div>
                    </div>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
    });
}

