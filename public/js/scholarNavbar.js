document.write(`<div class='navbar-logo_container'> <a class='navbar-brand' href=''>\
<a class="avatar avatar-sm p-0" href="#" id="profileDropdown" role="button" data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown" aria-expanded="false">
				<% if(ProfileImage == "avatar.jpg"){ %>
					<img class="avatar-img rounded-circle border border-white border-3 shadow" src="https://eu.ui-avatars.com/api/?background=random&name=<%= UserFirstname %>+<%= UserLastName %>&font-size=0.5&rounded=true&size=128&background=333333&color=ffffff" alt='<%= ProfileImage %> '>
					<% } else { %>
						<img class="avatar-img rounded-circle border border-white border-3 shadow profileImageContainer"
						src="" alt="Loading" >
					<% }%>
				
			</a><personal_info>
				<account_name><%=UserFirstname %> <%= UserLastName %></account_name>
			</personal_info>

</div>\
        <div class='navbar-contents'>\
        <ul class='navbar_buttons'>\
         <a href='/feed'><li class='navbar_item ' id='feed_link_pg' title='Feed'><span class='icon icon-newspaper'></span><p class='navName'>Feed</p><span class='nav_tool_tip '>Feed</span></li></a>\
        <a href='/dashboard'>\
            <li class='navbar_item ' id='dashboard_link_pg' title='Dashboard'><span class='icon icon-bxs_dashboard_icon'></span> <p class='navName'>Dashboard</p>\
                <span class='nav_tool_tip'>Dashboard</span></li>\
            </a>\
            <a href='/library'><li class='navbar_item ' id='library_link_pg' title='Library'><span class='icon icon-Library'></span><p class='navName'>Library</p><span class='nav_tool_tip '>Library</span></li></a>\
            <a href='/Directory'><li class='navbar_item ' id='directory_link_pg' title='Find Scholars and Spaces to follow'><span class='icon icon-folder'></span><p class='navName'>Scholars Directory</p><span class='nav_tool_tip'>Directory</span></li></a>\
            <a href='/Tutorials'><li class='navbar_item ' id='tutorials_link_pg' title='Tutorials'><img src='/files/icons_img/tutorial.png' alt='Tutorials'><p class='navName'>Tutorials</p><span class='nav_tool_tip'>Tutorials</span></li></a>\
            <a href='/Podcasts'><li class='navbar_item ' id='podcasts_link_pg' title='Podcasts'><span class='icon icon-mic'></span><p class='navName'>Podcasts</p><span class='nav_tool_tip'>Podcasts</span></li></a>\
            <a href='https://asfischolar.net'><li class='navbar_item ' id='asfi_meet_link_pg' title='ASFIMeet'><span  ><img src="https://asfischolar.net/assets/asfimeet.png" style="object-fit:cover;"></span><p class='navName'>ASFIMeet</p><span class='nav_tool_tip'>ASFIMeet</span></li></a>\
    </ul>\
        </div>\
        
        <div class='navbar_content_bottom'>\
            <ul class='bottom_navbar_ul'>\
                <a href='/settings'><li class='navbar_item' id='settings_link_pg'><i class='fa fa-cogs'></i></li></a>\
            </ul>\
        </div>`);


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
//for Feeds page 
if(url == "/feed"){
    const feed = document.getElementById("feed_link_pg")
    feed.classList += "active_item"
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

