async function getUserData(username){
    return fetch(`/getUserPublicData/${username}`, {
        
    }).then(res =>res.json())
    .then(data =>{
        if(data.success){
            return data.user
        }else{
            return []
        }
    })
}


export {
    getUserData
}