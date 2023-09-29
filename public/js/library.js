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
    alert("PEACE")
  
    // body.removeChild(MSG_CONTAINER)
  })

const book_list = document.getElementById("book_list")

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
    var imgSrc = `/userUploads/bookThumbnails/${bookCover}`
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

}
}

// GET LINKS 
const LINKS_ARRAY_container = document.getElementById("externalLinks").value
const LinksArray = JSON.parse(LINKS_ARRAY_container)
const LINkS_body = document.getElementById("external_links")

if(LinksArray.length > 0){
  LinksArray.forEach(link => {
    const LINK_TITLE = link.LINK_TITLE
    const LINK_DESCRIPTION = link.LINK_DESCRIPTION
    const LINK_IMAGE = link.LINK_IMAGE
    const LINK_URL = link.LINK_URL


LINkS_body.innerHTML += `<li class="card shadow h-50">
    <img src="${LINK_IMAGE}" alt='${LINK_TITLE}'>
    <div class="card-body pb-0">

      <h5 class="card-title"><a href="${LINK_URL}" target=_blank class="limited-text">${LINK_TITLE}</a></h5>
      <a href="${LINK_URL}" class="badge bg-purple bg-opacity-10 text-purple limited-text">${LINK_URL}</a>
  
 
  </li>`
  })
}


// Pagination Script 

  // Define the total number of items per page for books and links
  const ITEMS_PER_PAGE_BOOKS = 6;
  const ITEMS_PER_PAGE_LINKS = 3;
  
  // Initialize the current page numbers
  let currentPageBooks = 1;
  let currentPageLinks = 1;

  // Function to update the book list based on the current page
  function updateBookList(page) {
    // Make an AJAX request to your server to fetch books for the specified page
    fetch(`/library?pageBooks=${page}`)
      .then(response => response.json())
      .then(data => {
        // Render the book list based on the data received from the server
        renderBookList(data.books);
        currentPageBooks = page; // Update the current page number
        updateBookPaginationButtons();
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Function to update the link list based on the current page
  function updateLinkList(page) {
    // Make an AJAX request to your server to fetch links for the specified page
    fetch(`/library?pageLinks=${page}`)
      .then(response => response.json())
      .then(data => {
        // Render the link list based on the data received from the server
        renderLinkList(data.externalLinks);
        currentPageLinks = page; // Update the current page number
        updateLinkPaginationButtons();
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Function to render the book list
  function renderBookList(books) {
    // Replace this with your logic to render books on the page
    // Example: Clear existing content and display the new list of books
    const bookListContainer = document.getElementById("book-list-container");
    bookListContainer.innerHTML = "";
    books.forEach(book => {
      // Render each book item here
      const bookItem = document.createElement("div");
      bookItem.textContent = book.title; // Replace with book data
      bookListContainer.appendChild(bookItem);
    });
  }

  // Function to render the link list
  function renderLinkList(links) {
    // Replace this with your logic to render links on the page
    // Example: Clear existing content and display the new list of links
    const linkListContainer = document.getElementById("link-list-container");
    linkListContainer.innerHTML = "";
    links.forEach(link => {
      // Render each link item here
      const linkItem = document.createElement("div");
      linkItem.textContent = link.title; // Replace with link data
      linkListContainer.appendChild(linkItem);
    });
  }

  // Function to update pagination buttons for books
  
  function updateBookPaginationButtons() {
    let prevButton
    if(prevButton = document.getElementById("prevBookPage")){
    prevButton = document.getElementById("prevBookPage");
    const nextButton = document.getElementById("nextBookPage");
    prevButton.disabled = currentPageBooks === 1;
    nextButton.disabled = currentPageBooks * ITEMS_PER_PAGE_BOOKS >= bookCount;
    }
  }

  // Function to update pagination buttons for links
  function updateLinkPaginationButtons() {
    const prevButton = document.getElementById("prevLinkPage");
    const nextButton = document.getElementById("nextLinkPage");
    prevButton.disabled = currentPageLinks === 1;
    nextButton.disabled = currentPageLinks * ITEMS_PER_PAGE_LINKS >= linkCount;
  }

  // Initial page load
  let bookCount, linkCount;

  // Fetch the total counts for books and links
  fetch("/library")
    .then(response => response.json())
    .then(data => {
      bookCount = data.bookCount;
      // Fetch the total counts for links
      return fetch("/library");
    })
    .then(response => response.json())
    .then(data => {
      linkCount = data.linkCount;
      // Update the pagination buttons
      updateBookPaginationButtons();
      updateLinkPaginationButtons();
      // Fetch and render the initial book and link lists
      updateBookList(currentPageBooks);
      updateLinkList(currentPageLinks);
    })
    .catch(error => {
      console.error(error);
    });

  // Event listener for book pagination
  document.getElementById("prevBookPage").addEventListener("click", () => {
    // Handle previous button click for books
    if (currentPageBooks > 1) {
      updateBookList(currentPageBooks - 1);
    }
  });

  document.getElementById("nextBookPage").addEventListener("click", () => {
    // Handle next button click for books
    if (currentPageBooks * ITEMS_PER_PAGE_BOOKS < bookCount) {
      updateBookList(currentPageBooks + 1);
    }
  });

  // Event listener for link pagination
  document.getElementById("prevLinkPage").addEventListener("click", () => {
    // Handle previous button click for links
    if (currentPageLinks > 1) {
      updateLinkList(currentPageLinks - 1);
    }
  });

  document.getElementById("nextLinkPage").addEventListener("click", () => {
    // Handle next button click for links
    if (currentPageLinks * ITEMS_PER_PAGE_LINKS < linkCount) {
      updateLinkList(currentPageLinks + 1);
    }
  });
