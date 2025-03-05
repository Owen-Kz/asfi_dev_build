const googleScholar_container = document.getElementById("googleScholar_container");

const personName = document.getElementById("name").value;

fetch(`/findGoogleScholar?name=${encodeURIComponent(personName)}`, {
  method: "GET"
})
  .then(res => res.json())
  .then(scholarData => {
    if(scholarData && scholarData.profiles) {
    /******************************************************
     * Populate Profile Section
     ******************************************************/
    const profile = scholarData.profiles.authors[0];
    document.getElementById("scholar-name").textContent = profile.name;
    document.getElementById("scholar-affiliation").textContent = "Affiliation: " + profile.affiliations;
    document.getElementById("scholar-email").textContent = profile.email;
    document.getElementById("scholar-cited-by").textContent = "Cited by: " + profile.cited_by;

    /******************************************************
     * Publications & Pagination Setup
     ******************************************************/
    const publications = scholarData.organic_results;
    const pageSize = 6; // Show 6 publications per page
    let currentPage = 1;
    const totalPages = Math.ceil(publications.length / pageSize);

    function renderPublications(page) {
      const container = document.getElementById("publications-container");
      container.innerHTML = "";
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = publications.slice(startIndex, endIndex);

      pageData.forEach(pub => {
        const pubDiv = document.createElement("div");
        pubDiv.classList.add("publication");

        // Extract authors from publication_info.authors if available
        const authors = pub.publication_info && pub.publication_info.authors ?
                        pub.publication_info.authors.map(a => a.name).join(", ") : "";

        // Use the summary if available; otherwise, fallback to snippet
        const pubInfo = (pub.publication_info && pub.publication_info.summary) ?
                        pub.publication_info.summary : pub.snippet;

        // Get citation count if available
        const citedBy = (pub.inline_links && pub.inline_links.cited_by) ? pub.inline_links.cited_by.total : "0";

        pubDiv.innerHTML = `
          <h3><a href="${pub.link}" target="_blank">${pub.title}</a></h3>
          <div class="authors">${authors}</div>
          <div class="publication-info">${pubInfo}</div>
          <div class="cited-by">Cited by: ${citedBy}</div>
        `;
        container.appendChild(pubDiv);
      });
    }

    function renderPagination() {
      const paginationContainer = document.getElementById("pagination-controls");
      paginationContainer.innerHTML = "";

      // Prev Button
      const prevButton = document.createElement("button");
      prevButton.textContent = "Prev";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          updatePage();
        }
      });
      paginationContainer.appendChild(prevButton);

      // Numbered Page Buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) {
          pageBtn.classList.add("active");
        }
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          updatePage();
        });
        paginationContainer.appendChild(pageBtn);
      }

      // Next Button
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          updatePage();
        }
      });
      paginationContainer.appendChild(nextButton);
    }

    function updatePage() {
      renderPublications(currentPage);
      renderPagination();
    }

    // Initial render once data is fetched
    updatePage();
}
  })
  .catch(error => {
    console.error("Error fetching Google Scholar data:", error);
  });
