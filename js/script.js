
var allplaylist = [];
var currPlaylist;


// Creating Playlist
var playlistList = document.querySelector('.playlist-list');
var createPlaylist = document.querySelector('#create');

createPlaylist.addEventListener('click', () => {
    let playlistName = window.prompt("Enter playlist name:");


    if (playlistName && db) {
        let playlistId = shortid();
        var transaction = db.transaction("store", "readwrite");
        var myStore = transaction.objectStore("store");
        // console.log(myStore);
        let newPlaylist = {
            id: playlistId,
            name: playlistName,
            songs: []
        }

        myStore.add(newPlaylist);

        var h4 = document.createElement('p');
        h4.textContent = playlistName;
        playlistList.appendChild(h4);
        allplaylist.push(newPlaylist);
    }
})


// Adding playlist to the sidebar
window.addEventListener('load', () => {
    let allpl = [];
    let playlists = "";
    var transaction = db.transaction("store", "readonly");
    var myStore = transaction.objectStore("store");
    var playlistRequest = myStore.getAll();

    playlistRequest.onsuccess = (e) => {
        let playlistResult = playlistRequest.result;

        playlistResult.forEach((e) => {
            allpl.push(e);
            playlists += `<p>${e.name}</p>`
        });

        allplaylist = allpl;
        playlistList.innerHTML = playlists;
    }
})


setInterval(() => {
    var playlist = document.querySelectorAll('.playlist-list p');
    
    playlist.forEach((item) => {
        item.addEventListener('click', (e) => {
            getCurrentPlaylist(item);
        })
    })

    if (currPlaylist != undefined) {
        document.querySelector('.pl-name p').textContent = `${currPlaylist.name}`;
        // console.log(currPlaylist);
    }

}, 1000);



// getting current playlist to the currPlaylist variable
function getCurrentPlaylist(obj) {
    allplaylist.forEach((item) => {
        if (item.name == obj.textContent) {
            // console.log(item.name);
            currPlaylist = item;
        }
    })
}


// Adding song to the playlist
var addSong = document.querySelector(".add-song");
// console.log(addSong);

addSong.addEventListener('click', ()=>{

})

var saveSong = document.querySelector('#save-song');
var songName = document.querySelector('#s-name');
var songAudio = document.querySelector('#s-file');
// console.log(saveSong);

saveSong.addEventListener('click', () => {
    console.log(songAudio.value);
    let songs = currPlaylist.songs;

    if(db) {
        var transaction = db.transaction("store", "readwrite");
        var myStore = transaction.objectStore("store");

        let newSong = {
            name: songName.value,
            audio: songAudio.value,
            date: new Date(),
            duration: 1
        }
        songs.push(newSong);

        currPlaylist.songs = songs;

        console.log(currPlaylist);
        myStore.put(currPlaylist);
    }
})