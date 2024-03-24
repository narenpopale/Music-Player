
var allplaylist = [];
var currPlaylist;
var allSongs = [];
var currSongIndex;


// Creating Playlist
var playlistList = document.querySelector('.playlist-list');
var createPlaylist = document.querySelector('#create');

createPlaylist.addEventListener('click', () => {
    let playlistName = window.prompt("Enter playlist name:");


    if (playlistName && db) {
        let playlistId = shortid();
        var transaction = db.transaction("store", "readwrite");
        var myStore = transaction.objectStore("store");
        
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

    // Eventlistener for Playlists
    playlist.forEach((item) => {
        item.addEventListener('click', (e) => {
            getCurrentPlaylist(item);
            addAllSongs();
        })
    })

    // Adding Current Playlist name 
    if (currPlaylist != undefined) {
        document.querySelector('.pl-name p').textContent = `${currPlaylist.name}`;
        allSongs = currPlaylist.songs;
    }
    else {
        document.querySelector('.pl-name p').textContent = "Select Playlist";
    }


    // Adding Current Song to the player

    // Eventlistener for Songs
    document.querySelectorAll('.song-title').forEach((song) => {
        song.addEventListener('click', () => {
            getCurrentSongIndex(song.textContent);
            addSongtoPlayer();
        })
    })

}, 1000);



// Getting current playlist to the currPlaylist variable
function getCurrentPlaylist(obj) {
    allplaylist.forEach((item) => {
        if (item.name == obj.textContent) {
            currPlaylist = item;
        }
    })
}


// Getting current song index
function getCurrentSongIndex(song) {
    if (currPlaylist != undefined) {
        let i = 0;
        currPlaylist.songs.forEach((item) => {
            if (item.name == song) {
                currSongIndex = i;
            }
            i++;
        })
    }
}


// Adding Current Playlist Songs to the HTML
function addAllSongs() {
    let songs = "";

    currPlaylist.songs.forEach(song => {
        songs += `
            <div class="item">
                <p class="song-title">${song.name}</p>
                <p class="date">${song.date.getDate()} / ${song.date.getMonth() + 1} / ${song.date.getFullYear()}</p>
                <p class="duration">${song.duration}</p>
            </div>
        `;
    });

    document.querySelector('.list').innerHTML = songs;
}



// Function for adding current song to the DOM
function addSongtoPlayer() {
    let audio = document.querySelector('#music');
    let sname = document.querySelector('marquee');
    audio.innerHTML = `<audio src="${allSongs[currSongIndex].audio}" controls></audio>`;
    sname.textContent = allSongs[currSongIndex].name;
    document.querySelector('audio').play();
}


// Adding song to the playlist
var saveSong = document.querySelector('#save-song');
var songName = document.querySelector('#s-name');
var songAudio = document.querySelector('#s-file');

// Storing song to the DB
saveSong.addEventListener('click', () => {

    let songs = currPlaylist.songs;

    if (db) {

        let fr = new FileReader();
        fr.readAsDataURL(songAudio.files[0]);

        // For URL
        fr.addEventListener('load', () => {
            const url = fr.result;

            const audio = new Audio();
            audio.src = url;

            // FOR Duration
            audio.addEventListener('loadedmetadata', () => {
                const audioDuration = audio.duration / 60;

                var transaction = db.transaction("store", "readwrite");
                var myStore = transaction.objectStore("store");

                let newSong = {
                    name: songName.value,
                    audio: url,
                    date: new Date(),
                    duration: audioDuration.toFixed(2)
                }
                songs.push(newSong);

                currPlaylist.songs = songs;

                myStore.put(currPlaylist);

                addAllSongs();
            });

        })

    }
})


// Song Navigation
var left = document.querySelector('#left');
var right = document.querySelector('#right');

left.addEventListener('click', () => {
    if (currSongIndex != undefined && currSongIndex > 0) {
        currSongIndex--;
        addSongtoPlayer();
    }
})

right.addEventListener('click', () => {
    if (currSongIndex != undefined && currSongIndex < allSongs.length - 1) {
        currSongIndex++;
        addSongtoPlayer();
    }
})


// Side Bar Featrue
var btn = document.querySelector('.mynav button');
var isOpen = false;

btn.addEventListener('click', ()=>{
    let side = document.querySelector('.main .side');
    if(!isOpen) {
        side.style.display = "block";
        isOpen = true;
    }
    else {
        side.style.display = "none";
        isOpen = false;
    }
})