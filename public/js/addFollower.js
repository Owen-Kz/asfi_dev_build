document.write ("<form onsubmit='return false' method='post' id='follow' >\
    <input type='text' name='followed_account' id='followed_account' value=<%=  searchUSERNAME %> readonly>\
    <input type='text' name='follower' id='follower' value='<%= visitor %>' readonly>\
    <button id='submitFollow'>sb</button>\
    </form>"
    );
