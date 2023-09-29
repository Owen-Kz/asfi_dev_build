// Make an AJAX request to fetch the data from the server
const usernameVist = document.getElementById("usernameVisit")

// $.ajax({
// 	url: `/userFollowers/${usernameVist.value}`,
// 	method: "GET",
// 	success: function (response, textStatus, xhr) {
		var dataJSON = document.getElementById("dataJSON").value;
		var data = JSON.parse(dataJSON);
		

	  // Process and use the data as needed
	  for (var i = 0; i < data.length; i++) {
		var user = data[i];
	
		// Perform any other actions with the user data
		var ul = document.getElementById('followers-list');
	var li = document.createElement("li");
	var a = document.createElement("a");
	var img = document.createElement("img");
	var str = document.createElement("strong");
	var spn = document.createElement("span");
    var spn2 = document.createElement("span")
	var em  = document.createElement("em");	
    var div = document.createElement("div")
	var user = data[i];
	var FULLNAME = `${user.firstname} ${user.lastname}`
    var username = user.username;
	let userTITLE

		// <i class="fas fa-check-circle text-warning small"></i>
	if(user.title !== "N/A"){
		userTITLE = user.title;	
	}else{
		userTITLE = ""
	}

    var profile_photo = `${user.profile_photo}`
	var lett = FULLNAME;

	ul.setAttribute('id', 'followers-list')
	li.setAttribute('data-index',i);
	li.setAttribute('id', 'li')
	li.setAttribute('data-name',FULLNAME);
	li.setAttribute('data-index',('0' + i).slice(-2));
	li.appendChild(a);

	var createImageContainer = document.createElement("div")
	createImageContainer.setAttribute("class", "image_container")

	if(profile_photo == "avatar.jpg"){
	img.setAttribute('src', 'https://eu.ui-avatars.com/api/?background=random&name='+lett+'&font-size=0.6');
	}else{
	img.setAttribute('src', '/userUploads/profileImages/'+profile_photo);
	}
	// img.setAttribute('src', 'https://eu.ui-avatars.com/api/?background=random&name='+lett+'&font-size=0.6');
	div.setAttribute('class', 'text')
    createImageContainer.appendChild(img)
    a.appendChild(createImageContainer);
    a.appendChild(div)
	str.appendChild(document.createTextNode(FULLNAME));
	div.appendChild(str);
	spn.appendChild(document.createTextNode('@'+username));
	div.appendChild(spn);
    spn2.appendChild(document.createTextNode(userTITLE))
    div.appendChild(spn2)
	// em.appendChild(document.createTextNode(100 - i));
	// a.appendChild(em);
	a.setAttribute('href','/@'+username);
	ul.appendChild(li);
	  }
	// },
// 	error: function (xhr, status, error) {
// 	  // Handle error
// 	  console.error(error);
// 	},
//   });
  

  