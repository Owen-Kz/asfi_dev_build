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
  let currentPageLinks = 1; 
  function addLoadingPlaceholders() {
    for (let i = 0; i < 3; i++) {
        const dummyCard = document.createElement("li");
        dummyCard.className = "card shadow h-50 w-90 loading-placeholder";
        dummyCard.style.width = "80px";
        dummyCard.innerHTML = `
            <div class="card-body pb-0">
                <h5 class="card-title" style="background-color: grey; height: 20px; width: 80%;"></h5>
                <div style="background-color: grey; height: 15px; width: 60%; margin-top: 10px;"></div>
            </div> 
            <div class="card-footer pt-0 pb-3">
                <hr>
                <div class="d-flex justify-content-around">
                    <div style="background-color: grey; height: 20px; width: 40px;"></div>
                    <div style="background-color: grey; height: 20px; width: 40px;"></div>
                </div>
            </div>
        `;
        book_list.appendChild(dummyCard);
    }
}

function removeLoadingPlaceholders() {
    document.querySelectorAll(".loading-placeholder").forEach(el => el.remove());
}


// GET LINKS 
const LINkS_body = document.getElementById("external_links")



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
            const { LINK_TITLE, LINK_IMAGE, LINK_URL, LINK_OWNER } = link;
            const linkItem = document.createElement("li");
            linkItem.className = "card shadow h-50";
            linkItem.innerHTML = `
                <img src="${LINK_IMAGE}" alt='${LINK_TITLE}'>
                <div class="card-body pb-0">
                    <h5 class="card-title"><a href="${LINK_URL}" target=_blank class="limited-text">${LINK_TITLE}</a></h5>
                    <a href="${LINK_URL}" class="badge bg-purple bg-opacity-10 text-purple limited-text">${LINK_URL}</a>
                    <div style="margin-top: 10px; margin-bottom: 20px;" class="d-flex justify-content-center justify-content-around">
                    <span>Published by </span> <a href="@${LINK_OWNER}/chat" class="badge bg-purple bg-opacity-10 text-purple"">${LINK_OWNER}</a>
                    </div>
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
        // loadingIndicator.remove();
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







 
// Load PDF.js 
async function renderPDFPreview(bookFile, canvas) {
    // const loadingTask = pdfjsLib.getDocument(bookFile);
    // loadingTask.promise.then(pdf => {
    //     return pdf.getPage(1); // Load only page 1
    // }).then(page => {
    //     const context = canvas.getContext("2d");
    //     const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

    //     // Resize canvas to match the page size
    //     canvas.width = viewport.width;
    //     canvas.height = viewport.height;

    //     const renderContext = {
    //         canvasContext: context,
    //         viewport: viewport
    //     };

    //     return page.render(renderContext);
    // }).catch(error => {
    //     console.error("Error rendering PDF:", error);
    // });

    const urlPage = bookFile;

    pdfjsLib.getDocument(urlPage).promise.then(pdf => {
      pdf.getPage(1).then(page => {
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed


        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
       return page.render(renderContext);
      });
    });

}

function updateUIWithData(Books_Data) {
    if (Books_Data.length > 0) {
        Books_Data.forEach(book => {
            const bookTitle = book.book_title;
            const bookAuthor = book.book_author;
            const bookYear = book.book_year;
            const bookId = book.book_id;
            const bookOwnerUsername = book.book_owner_username;
            const bookFile = book.file; // Cloudinary PDF URL

            const listItem = document.createElement("li");
            listItem.className = "card shadow h-50"

            // Create a canvas for PDF preview
            const canvas = document.createElement("canvas");
            canvas.className = "book-thumbnail";
            
            // Load the PDF into the canvas
            renderPDFPreview(bookFile, canvas);
            
            listItem.innerHTML = `
               <div class="card" style="width:90%">
                  <div class="card-body pb-0" style="margin-top:20px; position:absolute;">
                      <div class="d-flex justify-content-between mb-2">
                          <div class="book_year" style="background: var(--bs-bg-header); padding: 2px; border-radius: 6px;">${bookYear}</div>
                      </div>
                      <h5 class="card-title" style="background: var(--bs-bg-header); padding: 4px; border-radius: 6px;><a href="/library/b/${bookId}">${bookTitle}</a></h5>
                      <a href="#" class="badge bg-purple bg-opacity-10 text-purple">${bookOwnerUsername}</a>
                  </div> 
               </div>
            
               <div class="card-footer pt-0 pb-3" style="background:var(--bs-bg-header);">
                  <hr>
                  <div class="d-flex justify-content-around">
                      <a href="/library/b/${bookId}" class="button refad"><i class="fa fa-book"></i></a>
                      <a href="/library/books/${bookId}" class="button download"><i class="fa fa-download"></i></a>
                  </div>
                  <div style="margin-top: 30px;" class="d-flex justify-content-center justify-content-around">
                      <span>Published by </span> <a href="@${bookAuthor}/chat" class="badge bg-purple bg-opacity-10 text-purple">${bookAuthor}</a>
                  </div>
               </div>
            `;
            
            // Now get the card div inside listItem
            const cardDiv = listItem.querySelector(".card");
            
            // Insert the canvas at the start of the card div, before .card-body
            cardDiv.insertBefore(canvas, cardDiv.firstChild);
            
            // Append the new book to the list
            book_list.appendChild(listItem);
            
        });
    }
}

// Fetch and update the UI
// Track current page for books
let currentPageBooks = 1;
let isFetchingBooks = false;
let hasMoreBooks = true; // Flag to check if more books exist

async function fetchBooks(page) {
    if (isFetchingBooks || !hasMoreBooks) return;
    isFetchingBooks = true;

    // Add 3 dummy cards as loading placeholders
    addLoadingPlaceholders();

    try {
        const response = await fetch(`/getAllBooksOnLibrary?pageBook=${page}`);
        const data = await response.json();

        if (data.status !== "success") {
            console.log(data.message);
            return;
        }

        const booksList = JSON.parse(data.books);
        if (booksList.length === 0) {
            hasMoreBooks = false; // No more books to load
            removeLoadingPlaceholders();
            return;
        }

        removeLoadingPlaceholders(); // Remove dummy cards after data is loaded
        updateUIWithData(booksList); // Append books
        currentPageBooks++; // Increment page number
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        isFetchingBooks = false;
    }
}


// Attach scroll event listener to book list container
book_list.addEventListener("scroll", () => {
    if (book_list.scrollTop + book_list.clientHeight >= book_list.scrollHeight - 50) {
        fetchBooks(currentPageBooks);
    }
});

// Initial Load
fetchBooks(currentPageBooks);


export {
  updateUIWithData
}