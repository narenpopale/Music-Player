
var createPlaylist = document.querySelector('h3');
var playlistList = document.querySelector('.playlist-list');
var isSet = false;
var allplaylist = [];


createPlaylist.addEventListener('click', ()=>{
    let playlistName = window.prompt("Enter playlist name:");
    
    
    if(playlistName && db) {
        let playlistId = shortid();
        var transaction = db.transaction("store", "readwrite");
        var myStore = transaction.objectStore("store");
        // console.log(myStore);
        let newPlaylist = {
            id: playlistId,
            name: playlistName,
            songs: {

            }
        }
        isSet = true;
        myStore.add(newPlaylist);

        var h4 = document.createElement('h4');
        h4.textContent = playlistName;
        playlistList.appendChild(h4);
    }
})


setInterval(()=>{
    var playlist = document.querySelectorAll('h4');
    
    playlist.forEach((item) => {
        item.addEventListener('click', (e) => {
            // console.log(item);
        })
    })
    
},1000);



// Adding playlist to the sidebar
window.addEventListener('load', ()=>{
    let allpl = [];
    let playlists = "";
    var transaction = db.transaction("store", "readonly");
    var myStore = transaction.objectStore("store");
    var playlistRequest = myStore.getAll();

    playlistRequest.onsuccess = (e) => {
        let playlistResult = playlistRequest.result;
        
        playlistResult.forEach((e) => {
            allpl.push(e);
            playlists += `<h4>${e.name}</h4>`
        });
        
        allplaylist = allpl;
        playlistList.innerHTML = playlists;
    }
})