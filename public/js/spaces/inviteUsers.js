$(".search-chat").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $(".invite-users li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  
  async function GetFollowing() {
    try {
      const res = await fetch(`/directory/users/spaces/${spaceID.value}`, {
        method: "GET"
      });
      const data = await res.json();
  
      if (data.success) {
        return data.userData;
      } else {
        console.warn("Fetch returned success: false");
        return [];
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
  
  async function feedData() {
    const usersArray = await GetFollowing();
    const inviteUsers = document.querySelector("#inviteusers");
    inviteUsers.innerHTML = "";
  
    if (usersArray.length > 0) {
      const listItems = usersArray.map(user => {
        return `
          <li>
            <div class="profile-container">
              <div class="waiting-img"><img src="${user.profile_picture}" alt=""></div>
              <span class="username">${user.first_name} ${user.last_name}</span>
            </div>
            <form class="inviteForm">
              <input name="username" value="${user.username}" hidden/>
              <button type="submit" class="invite">Invite</button>
            </form>
          </li>
          <div class="line"></div>
        `;
      }).join("");
  
      inviteUsers.innerHTML = listItems;
      attachInviteHandlers();
    } else {
      inviteUsers.innerHTML = `<li>Start Following Users to invite them</li>`;
    }
  }
  
  function attachInviteHandlers() {
    const inviteForms = document.querySelectorAll(".inviteForm");
  
    inviteForms.forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = form.querySelector("input");
        const data = {
          userEmail: username.value,
          space_id: spaceID.value
        };
  
        try {
          const res = await fetch("/inviteToSpace", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          const result = await res.json();
  
          form.innerHTML = result.success
            ? `<button type="button" class="invite" disabled>User invited</button>`
            : `<button type="button" class="invite" disabled>${result.error}</button>`;
        } catch (error) {
          console.error("Invite error:", error);
          form.innerHTML = `<button type="button" class="invite" disabled>Error</button>`;
        }
      });
    });
  }
  
  // Load on page ready
  feedData();
  