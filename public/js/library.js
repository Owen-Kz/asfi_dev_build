import { booksNavigation } from "./libraryBooksNavigation.js";
import { LinksPagination } from "./libraryLinksPagination.js";

$(".read").on("click", function(){
    $(".modal_container").removeClass("hidden");
    $(".modal_container").addClass("shown");
});

$("#close_modal").on("click", function(){
    if($(".modal_container").hasClass("shown")){
        $(".modal_container").removeClass("shown");
        $(".modal_container").addClass("hidden");
    }else{

    }
})
const book_list = document.getElementById("book_list")
  
// SEARCH FOR A PAGE
  //Check if the current searcg exceeds the Total Page Count 
  $("#findPage").on("keyup", function(){
    if(parseInt($("#findPage").val()) > parseInt($("#currenPageCount").val())){
        var body = document.getElementById("body")

        var MSG_CONTAINER = document.createElement("div")
        MSG_CONTAINER.setAttribute("class","msg_container")

        var WARNING = document.createElement("div")
        WARNING.setAttribute("id", "warning")

        body.appendChild(MSG_CONTAINER)
        MSG_CONTAINER.appendChild(WARNING)

       $("#warning").text("Search exceeds page limit")
    }else{
        $("#pageSearch").trigger("submit")
    }
  })

  $(".msg_container").on("click", function(){
    console.log("PEACE")
  
    // body.removeChild(MSG_CONTAINER)
  })



  // Define the total number of items per page for books and links
  const ITEMS_PER_PAGE_BOOKS = 6;
  const ITEMS_PER_PAGE_LINKS = 3;
  
  // Initialize the current page numbers
  let currentPageBooks = 1;
  let currentPageLinks = 1; 
  
  for(let i =0; i < 10; i++){
    book_list.innerHTML+= `
    <li class="card shadow h-50">
   
    <div class="card-body pb-0">
      <!-- Badge and favorite -->
      <div class="d-flex justify-content-between mb-2">
            <div class="book_year" style="background-color:grey;">
                
            </div>
      </div>
      <!-- Title -->
      <h5 class="card-title" style="background-color:grey;"><a href="#" ></a></h5>
        <a href="#" class="badge bg-purple bg-opacity-10 text-purple" style="background-color:grey;"></a>
     
    </div> 
    <!-- Card footer -->
    <div class="card-footer pt-0 pb-3">
      <hr>
      <div class="d-flex justify-content-around">
                          <a href="#" style="background-color:ash;"><div class="h6 fw-light mb-0 button refad"></div></a>
                   <a href="#" style="background-color:ash;"> <div class="h6 fw-light mb-0 button download"></div></a>
      </div>
    </div>
  </li>` 
  }
function updateUIWithData(Books_Data){
  book_list.innerHTML = ""
if(Books_Data.length  > 0){
Books_Data.forEach(book => {
  const bookTitle =  book.book_title
  const bookAuthor =  book.book_author
  const bookYear =  book.book_year
  const bookId =  book.book_id
  const book_owner_username = book.book_owner_username
  
  const bookCover =  book.book_cover
  const bookFile =  book.file
  const book_Qsf =  book.book_Qsf
  var imgSrc
  if(bookCover === "cover.jpg"){
    var imgSrc = `https://eu.ui-avatars.com/api/?background=random&name=${bookTitle}&font-size=0.5&size=125&background=333333&color=ffffff`
  }else{
    var imgSrc = `/userUploads/thumbnails/${bookCover}`
  }

  book_list.innerHTML += `<li class="card shadow h-50">
  <img src="${imgSrc}" alt='${bookCover}'>
  <div class="card-body pb-0">
    <!-- Badge and favorite -->
    <div class="d-flex justify-content-between mb-2">
          <div class="book_year">
              ${bookYear}
          </div>
    </div>
    <!-- Title -->
    <h5 class="card-title"><a href="/library/b/${bookId}">${bookTitle}</a></h5>
                    <a href="#" class="badge bg-purple bg-opacity-10 text-purple">${book_owner_username}</a>
   
  </div> 
  <!-- Card footer -->
  <div class="card-footer pt-0 pb-3">
    <hr>
    <div class="d-flex justify-content-around">
                        <a href="/library/b/${bookId}"><div class="h6 fw-light mb-0 button refad"><i class="fa fa-book"></i></div></a>
                 <a href="/library/books/${bookId}"> <div class="h6 fw-light mb-0 button download"><i class="fa fa-download"></i></div></a>
    </div>
  </div>
</li>
           
`

});

}else{
  
for(i =0; i < 10; i++){
  book_list.innerHTML+= `
  <li class="card shadow h-50">
 
  <div class="card-body pb-0">
    <!-- Badge and favorite -->
    <div class="d-flex justify-content-between mb-2">
          <div class="book_year" style="background-color:grey;">
              
          </div>
    </div>
    <!-- Title -->
    <h5 class="card-title" style="background-color:grey;"><a href="#" ></a></h5>
      <a href="#" class="badge bg-purple bg-opacity-10 text-purple" style="background-color:grey;"></a>
   
  </div> 
  <!-- Card footer -->
  <div class="card-footer pt-0 pb-3">
    <hr>
    <div class="d-flex justify-content-around">
                        <a href="#" style="background-color:ash;"><div class="h6 fw-light mb-0 button refad"></div></a>
                 <a href="#" style="background-color:ash;"> <div class="h6 fw-light mb-0 button download"></div></a>
    </div>
  </div>
</li>` 
}
}
}

// GET LINKS 
const LINkS_body = document.getElementById("external_links")

// for(let i=0; i<5; i++){
//   LINkS_body.innerHTML += `<li class="card shadow h-50">
        
//   <div class="card-body pb-0">
  
//     <h5 class="card-title" style="background-color:grey;"><a href="#" target=_blank class="limited-text"></a></h5>
//     <a style="background-color:grey;" href="#" class="badge bg-purple bg-opacity-10 text-purple limited-text"></a>
  
//   </li>`
// } 

// const LINkS_body = document.getElementById("linksContainer");
// let currentPageLinks = 1;
let isFetching = false;
let hasMoreLinks = true;
  // Show loading indicator
  for(let i=0; i<4; i++){
    const loadingIndicator = document.createElement("li");
    loadingIndicator.className = "card shadow h-50";
    loadingIndicator.innerHTML = `  <div class="card-body pb-0">
  
    <h5 class="card-title" style="background-color:grey;"><a href="#" target=_blank class="limited-text"></a></h5>
   <a style="background-color:grey;" href="#" class="badge bg-purple bg-opacity-10 text-purple limited-text"></a>
  `;
    LINkS_body.appendChild(loadingIndicator);
    }
async function fetchLinks(page) {
    if (isFetching || !hasMoreLinks) return;
    isFetching = true;

  

    try {
        const response = await fetch(`/getAllLinksOnLibrary?pageLink=${page}`);
        const data = await response.json();

        if (data.status !== "success") {
            console.log(data.message);
            return;
        }

        const LinksArray = JSON.parse(data.externalLinks);
        if (LinksArray.length === 0) {
            hasMoreLinks = false;
            return;
        }

        LinksArray.forEach(link => {
            const { LINK_TITLE, LINK_IMAGE, LINK_URL } = link;
            const linkItem = document.createElement("li");
            linkItem.className = "card shadow h-50";
            linkItem.innerHTML = `
                <img src="${LINK_IMAGE}" alt='${LINK_TITLE}'>
                <div class="card-body pb-0">
                    <h5 class="card-title"><a href="${LINK_URL}" target=_blank class="limited-text">${LINK_TITLE}</a></h5>
                    <a href="${LINK_URL}" class="badge bg-purple bg-opacity-10 text-purple limited-text">${LINK_URL}</a>
                </div>
            `;
            LINkS_body.prepend(linkItem);
        });

        currentPageLinks++;
    } catch (error) {
        console.error("Error fetching links:", error);
    } finally {
        isFetching = false;
        for(let i=0; i<4; i++){
        loadingIndicator.remove();
        }
    }
}

// Infinite scrolling inside LINkS_body
LINkS_body.addEventListener("scroll", () => {
    if (LINkS_body.scrollTop + LINkS_body.clientHeight >= LINkS_body.scrollHeight - 50) {
        fetchLinks(currentPageLinks);
    }
});

// Initial Load
fetchLinks(currentPageLinks);







 

  // FEtch the books and update ui 
  fetch(`/getAllBooksOnLibrary`, {
    method:"GET",
  }).then(res =>res.json())
  .then(data =>{
    if(data.status === "success"){

      const currentPage =data.currentPageBooks
      const totalPages = data.totalPagesBooks

      const booksList = JSON.parse(data.books)
    updateUIWithData(booksList)
    booksNavigation(totalPages, currentPage)
    }else{ 
      console.log(data.messsage)
    } 
  })


export {
  updateUIWithData
}