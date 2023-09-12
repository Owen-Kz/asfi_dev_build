const socialLinksArrayContainer = document.getElementById("SocialLinks").value
const socialLinksArray = JSON.parse(socialLinksArrayContainer)

console.log(socialLinksArray)

if(socialLinksArray.length > 0){
    // socialLinksArray.forEach(link => {
        const Facebook = socialLinksArray[0].Facebook
        const LinkedIn = socialLinksArray[0].LinkedIn
        const GoogleScholar = socialLinksArray[0].GoogleScholar
        const YouTube = socialLinksArray[0].YouTube
        const Orchid = socialLinksArray[0].Orchid
        const instagram = socialLinksArray[0].Instagram
        const Scopius = socialLinksArray[0].Scopius
        const Web_of_science = socialLinksArray[0].Web_of_science
        const Twitter = socialLinksArray[0].Twitter
        const ResearchGate = socialLinksArray[0].ResearchGate
        const Academia = socialLinksArray[0].Academia
        const social_links_body = document.getElementById("social_link_body")
    // });
// console.log(socialLinksArray)
        if(LinkedIn != "N/A" && LinkedIn != " "){
            social_links_body.innerHTML +=`
            <li class="list-group-item px-0">
            <span class="h6 fw-light"><i class="fab fa-linkedin text-primary me-1 me-sm-3"></i>LinkedIn:</span>
            <a href="${LinkedIn}">${LinkedIn}</a>
        </li>`;
        }

        if(Facebook != "N/A" && Facebook != ""){
            social_links_body.innerHTML += `
            <li class="list-group-item px-0">
                <span class="h6 fw-light"><i class="fab fa-facebook text-facebook me-1 me-sm-3"></i>Facebook:</span>
                <a href="${Facebook}">${Facebook}</a>
            </li>`
        }

        if(Twitter != "N/A" && Twitter != ""){
            social_links_body.innerHTML += `  
            <li class="list-group-item px-0">
                <span class="h6 fw-light"><i class="fab fa-twitter text-twitter me-1 me-sm-3"></i>Twitter: </span>
                <a href="${Twitter}">${Twitter}</a>
            </li>`
        }

        if(instagram != "N/A" && instagram != ""){
            social_links_body.innerHTML += `<li class="list-group-item px-0">
            <span class="h6 fw-light"><i class="fab fa-instagram text-instagram-gradient me-1 me-sm-3"></i>Instagram:</span>
            <a href="${instagram}">${instagram}</a>
        </li>`
        }
        if(YouTube != "N/A" && YouTube !=""){
            social_links_body.innerHTML +=`<li class="list-group-item px-0">
            <span class="h6 fw-light"><i class="fab fa-youtube text-youtube me-1 me-sm-3"></i>Youtube:</span>
            <a href="${YouTube}">${YouTube}</a>
        </li>`
        }
        if(GoogleScholar != "N/A" && GoogleScholar != ""){
            social_links_body.innerHTML += `<li class="list-group-item px-0">
            <span class="h6 fw-light">
            <i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#4285f4" d="M256 411.12L0 202.667 256 0z"/><path fill="#356ac3" d="M256 411.12l256-208.453L256 0z"/><circle fill="#a0c3ff" cx="256" cy="362.667" r="149.333"/><path fill="#76a7fa" d="M121.037 298.667c23.968-50.453 75.392-85.334 134.963-85.334s110.995 34.881 134.963 85.334H121.037z"/></svg> 
            </i>Google Scholar:</span>
            <a href="${GoogleScholar}">${GoogleScholar}</a>
        </li>`
        }
        if(ResearchGate != "N/A" && ResearchGate != ""){
            social_links_body.innerHTML += `  <li class="list-group-item px-0">
            <span class="h6 fw-light">
            <i>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="researchgate"><path fill="#2FCAAA" d="M0 24h24V0H0v24zM13.549 7.233c0-.654.472-1.628 1.822-1.628S17 6.564 17 6.564l-.574.385s-.295-.67-1.055-.67c-.423 0-1.055.391-1.055 1.055v1.435c0 .718.353 1.248.959 1.248.755 0 1.152-.584 1.152-1.435h-.959v-.574h1.629c0 1.098.251 2.673-1.822 2.673l-.001.001c-1.248 0-1.725-.841-1.725-1.724V7.233zM5.635 17.48c.831-.155 1.178-.07 1.178-1.28v-5.861c0-1.21-.343-1.125-1.178-1.28v-.434c1.382.054 2.845-.032 3.798-.032 1.698 0 2.994.771 2.994 2.442 0 1.13-.895 2.261-2.101 2.545a17.86 17.86 0 0 0 2.26 3.155c.385.418.921.787 1.457.787v.391h.002c-.353.161-1.778.321-2.679-.761-.493-.568-1.355-1.784-2.261-3.407-.477 0-.787 0-1.146-.032V16.2c0 1.259.321 1.136 1.382 1.28v.434a52.203 52.203 0 0 0-1.908-.044c-.702 0-1.398.032-1.8.044v-.434z"></path><path fill="#2FCAAA" d="M9.032 13.078c1.323 0 2.127-.788 2.127-1.961 0-1.194-.745-1.848-1.993-1.848-.402 0-.863 0-1.206.032v3.734c.344.026.568.042 1.072.042v.001z"></path></svg>
            </i>
            ResearchGate:</span>
            <a href="${ResearchGate}">${ResearchGate}</a>
        </li>`
        }
        if(Web_of_science != "N/A" && Web_of_science != ""){
            social_links_body.innerHTML += `    <li class="list-group-item px-0">
            <span class="h6 fw-light">
            <i>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 398.8c-11.8 5.1-23.4 9.7-34.9 13.5c16.7 33.8 31 35.7 34.9 35.7s18.1-1.9 34.9-35.7c-11.4-3.9-23.1-8.4-34.9-13.5zM446 256c33 45.2 44.3 90.9 23.6 128c-20.2 36.3-62.5 49.3-115.2 43.2c-22 52.1-55.6 84.8-98.4 84.8s-76.4-32.7-98.4-84.8c-52.7 6.1-95-6.8-115.2-43.2C21.7 346.9 33 301.2 66 256c-33-45.2-44.3-90.9-23.6-128c20.2-36.3 62.5-49.3 115.2-43.2C179.6 32.7 213.2 0 256 0s76.4 32.7 98.4 84.8c52.7-6.1 95 6.8 115.2 43.2c20.7 37.1 9.4 82.8-23.6 128zm-65.8 67.4c-1.7 14.2-3.9 28-6.7 41.2c31.8 1.4 38.6-8.7 40.2-11.7c2.3-4.2 7-17.9-11.9-48.1c-6.8 6.3-14 12.5-21.6 18.6zm-6.7-175.9c2.8 13.1 5 26.9 6.7 41.2c7.6 6.1 14.8 12.3 21.6 18.6c18.9-30.2 14.2-44 11.9-48.1c-1.6-2.9-8.4-13-40.2-11.7zM290.9 99.7C274.1 65.9 259.9 64 256 64s-18.1 1.9-34.9 35.7c11.4 3.9 23.1 8.4 34.9 13.5c11.8-5.1 23.4-9.7 34.9-13.5zm-159 88.9c1.7-14.3 3.9-28 6.7-41.2c-31.8-1.4-38.6 8.7-40.2 11.7c-2.3 4.2-7 17.9 11.9 48.1c6.8-6.3 14-12.5 21.6-18.6zM110.2 304.8C91.4 335 96 348.7 98.3 352.9c1.6 2.9 8.4 13 40.2 11.7c-2.8-13.1-5-26.9-6.7-41.2c-7.6-6.1-14.8-12.3-21.6-18.6zM336 256a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zm-80-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg> 
            </i>Web of Science:</span>
            <a href="${Web_of_science}">${Web_of_science}</a>
        </li>`
        }
        if(Scopius !="N/A" && Scopius != ""){
            social_links_body.innerHTML +=`    <li class="list-group-item px-0">
            <i>
            <span class="h6 fw-light"><svg viewBox="0 0 448 512"  xmlns="http://www.w3.org/2000/svg"><path d="m48 32c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-352c0-26.5-21.5-48-48-48zm16 64h320v320h-320zm97.3457 83.27148c-26.48541 0-42.63281 17.22603-42.63281 39.18946 0 21.96348 19.37833 31.43868 37.03516 42.20508 13.13499 7.96715 26.91406 13.35091 26.91406 27.5625 0 13.78101-12.27179 23.6875-26.91406 23.6875-14.42683 0-23.90104-3.23309-34.88282-9.90821l-2.58593 17.01172c11.19722 5.16784 22.60906 7.53711 38.32812 7.53711 21.96359 0 45.00391-13.56447 45.00391-40.48047 0-20.45618-18.08792-29.71697-35.5293-40.05273-13.56586-8.18245-27.99219-13.78058-27.99219-28.85352 0-11.19707 8.18249-23.46875 24.33204-23.46875 13.99635 0 23.68729 2.14946 35.96093 9.47071l1.07617-17.00782c-11.41267-4.73722-19.5951-6.89258-38.11328-6.89258zm134.75391 0c-41.77367 0-73.42578 32.51443-73.42578 73.85743 0 47.15681 37.68263 72.99804 72.78125 72.99804 17.65683 0 32.29805-2.36978 43.92578-8.18359l-1.29102-16.36524c-13.13499 7.1058-27.13255 9.90626-41.1289 9.90626-30.5768 0-54.90821-25.62467-54.90821-59.64649 0-35.95975 23.89985-58.13672 51.89258-58.13672 17.65683 0 31.22459 2.79834 44.14453 9.9043l1.29102-16.15039c-11.84315-5.5985-21.53311-8.1836-43.28125-8.1836z"/></svg></i> Scopus:</span>
            <a href="${Web_of_science}">${Web_of_science}</a>
        </li>`
        }
        if(Orchid != "N/A" && Orchid != ""){
            social_links_body.innerHTML +=` <li class="list-group-item px-0">
            <span class="h6 fw-light"><svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m48 32c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-352c0-26.5-21.5-48-48-48zm176 64c88.37321 0 160 71.63992 160 160 0 88.36009-71.62679 160-160 160s-160-71.63991-160-160c0-88.36008 71.62679-160 160-160zm-62.61328 58.25391c-7.20016 0-13.03906 5.85223-13.03906 13.02539 0 7.22679 5.85238 13.04101 13.03906 13.04101 7.21328 0 13.03853-5.80111 13.05273-13.04101 0-7.18667-5.83945-13.02539-13.05273-13.02539zm-9.4668 39.90625v132.49414h18.95899v-132.49414zm48.5332 0v132.29296h41.90821c11.77313 0 19.7334-.31931 23.91992-.97265 4.17337-.67994 8.7462-2.00076 13.74609-3.94727 8.54657-3.22692 16.04045-7.97364 22.48047-14.32031 6.33319-6.13339 11.1981-13.25231 14.61133-21.3457h.00195c3.39973-8.07989 5.13334-16.56124 5.11914-25.44141 0-12.37322-3.10653-23.82493-9.30664-34.31836-6.20013-10.47997-14.53388-18.45366-25.02734-23.85351-10.50692-5.41333-24.74519-8.09375-42.78516-8.09375zm19 16.8789h23.67969c9.12005 0 15.7078.33446 19.81446 1.04102 4.12016.67996 8.46645 2.12091 13.0664 4.26758v-.00196c4.55983 2.16014 8.63889 4.92053 12.18555 8.25391 9.61335 8.98698 14.41406 20.59939 14.41406 34.82617 0 14.48017-4.6805 26.45388-14.02734 35.94727-2.91995 2.91994-6.13209 5.36104-9.63867 7.34765-3.50655 2.0001-7.88149 3.62674-13.13477 4.91992-5.25328 1.29317-12.61136 1.94532-22.07812 1.94532h-24.28126z"/></svg> ORCID:</span>
            <a href="${Orchid}">${Orchid}</a>
        </li>`
        }
        if(Academia != "N/A" &&  Academia != ""){
            social_links_body.innerHTML += `
    <li class="list-group-item px-0">
    <span class="h6 fw-light">
    <i><svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="m48 32c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-352c0-26.5-21.5-48-48-48zm159.79297 64c13.84989-.009235 27.69894.065306 41.54883.304688 37.90242 95.769872 76.87554 191.171612 115.29297 286.757812 3.86753 10.93902 16.28252 13.7763 26.33789 15.80273 0 5.70872.03515 11.41676.03515 17.12696-50.02039-.0378-100.04056.03689-150.0625-.03711 0-5.74523.03516-11.45499.03516-17.16406 12.52441-.95591 28.65788-.21841 36.09961-12.56055 2.87395-9.57663-.33071-19.56009-3.86719-28.47266-5.30418-13.2243-10.60874-26.44817-15.91406-39.63476-38.64033-.14616-77.24053.11182-115.88086-.10938-6.96146 16.24434-13.00418 32.85791-19.37695 49.32227-2.65131 7.25635-5.48704 16.90792.92187 23.0957 8.14043 6.92532 19.63312 6.74091 29.65234 8.28711.036 5.7464.03607 11.49287.07227 17.27539-31.89881-.0372-63.796493.0735-95.695312-.07422-.000001-5.67257.035156-11.34406.035156-16.98047 9.760071-2.02491 21.953528-4.42154 25.673828-15.14062 32.931248-84.131 65.898238-168.29689 98.349608-252.61133-5.34146-11.49312-9.65208-23.42525-14.80859-34.992188 13.84988-.092488 27.70089-.186077 41.55078-.195312zm-9.83594 73.5332c-14.51282 39.45015-30.2036 78.49383-45.01172 117.83399a9679.2904 9679.2904 0 0 0 92.12305 0c-15.69177-39.26633-31.45571-78.53111-47.11133-117.83399z"/></svg></i> Academia:</span>
    <a href="${Academia}">${Academia}</a>
    </li>
            `
        }
        
}