document.write ("<form onsubmit='return false' method='post' id='UnfollowForm' >\
<input type='text' name='UNfollowed_account' id='UNfollowed_account' value=<%=  searchUSERNAME %> readonly>\
<input type='text' name='UNfollower' id='UNfollower' value='<%= visitor %>' readonly>\
<button id='submitUNFollow'>sb</button>\
</form>"
)