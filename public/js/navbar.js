document.write("<div class='navbar-logo_container'> <a class='navbar-brand' href=''>\
                 <img class='light-mode-item navbar-brand-item' src='/files/images/ASFIScholar_Logo.png' alt='logo'>\
                 <img class='dark-mode-item navbar-brand-item' src='/files/images/ASFIScholar_Logo.png' alt='logo'></a>\
        </div>\
        <div class='navbar-contents'>\
            <ul class='navbar_buttons'>\
                <a href='/dashboard'>\
                    <li class='navbar_item ' id='dashboard_link_pg' title='Dashboard'><span class='icon icon-bxs_dashboard_icon'></span>\
                        <span class='nav_tool_tip'>Dashboard</span></li>\
                    </a>\
                    <a href='/library'><li class='navbar_item ' id='library_link_pg' title='Library'><span class='icon icon-Library'></span><span class='nav_tool_tip '>Library</span></li></a>\
                    <a href='/Directory'><li class='navbar_item ' id='directory_link_pg' title='Directory'><span class='icon icon-folder'></span><span class='nav_tool_tip'>Directory</span></li></a>\
                    <a href='/Tutorials'><li class='navbar_item ' id='tutorials_link_pg' title='Tutorials'><img src='/files/icons_img/tutorial.png' alt='Tutorials'><span class='nav_tool_tip'>Tutorials</span></li></a>\
                    <a href='/Podcasts'><li class='navbar_item ' id='podcasts_link_pg' title='Podcasts'><span class='icon icon-mic'></span><span class='nav_tool_tip'>Podcasts</span></li></a>\
                    <a href='/vc'><li class='navbar_item ' id='video_conferencing_link_pg' title='Video Conferencing'><img src='/files/icons_img/VC.png' alt=' Video Conferencing'><span class='nav_tool_tip '>Video Conferencing</span></li></a>\
            </ul>\
        </div>\
        <div class='navbar_content_bottom'>\
            <ul class='bottom_navbar_ul'>\
                <a href='/settings'><li class='navbar_item' id='settings_link_pg'><i class='fa fa-cogs'></i></li></a>\
            </ul>\
        </div>");


// CHECK FOR ACTIVE PAGES 
function getURL(){
    return window.location.pathname
}
const url = getURL()

// FOR THE DASHBOARD PAGE 
    if(url == "/dashboard/" || url == "/Dashboard/" || url == "/dashboard" || url == "/Dashboard"){
        var dashboard =  document.getElementById("dashboard_link_pg");
        dashboard.classList += "active_item";

    }
// FOR THE LIBRARY PAGE 
    if(url == "/library/" || url == "/Library/" || url == "/library" || url == "/Library"){
        var dashboard =  document.getElementById("library_link_pg");
        dashboard.classList += "active_item";
    }
// FOR THE Directory PAGE 
    if(url == "/directory/" || url == "/Directory/" || url == "/Spaces/" || url == "/spaces/" || url == "/:username" || url == "/directory" || url == "/Directory" || url == "/Spaces" || url == "/spaces" || url == "/:username"){
        var dashboard =  document.getElementById("directory_link_pg");
        dashboard.classList += "active_item";
    }

// FOR THE TUTORIALS PAGE 
    if(url == "/tutorials/" || url == "/Tutorials/" || url == "/tutorials" || url == "/Tutorials"){
        var dashboard =  document.getElementById("tutorials_link_pg");
        dashboard.classList += "active_item";
    }

// FOR THE PODCASTS PAGE  
    if(url == "/podcasts/" || url == "/Podcasts/" || url == "/podcasts" || url == "/Podcasts" ){
        var dashboard =  document.getElementById("podcasts_link_pg");
        dashboard.classList += "active_item";
        console.log("Podcast is active")
    }

// FOR THE VIDEO CONFERENCING PAGE  
    if(url == "/video_conferencing/" || url == "/Video_conferencing/" || url == "/video_conferencing" || url == "/Video_conferencing"){
        var dashboard =  document.getElementById("video_conferencing_link_pg");
        dashboard.classList += "active_item";
    }

    // FOR THE SETTINGS PAGE
    if(url == "/settings/" || url == "/Settings/" || url == "/Settings" || url == "/settings"){
        var settings =  document.getElementById("settings_link_pg");
        settings.classList += "active_item";
    }

