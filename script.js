console.log('Welcome  to client side project by Nischal Agrawal')

let currentSong = new Audio()
let songs
let currFolder



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    currFolder=folder
    


    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    // console.log(response);
    
    let div = document.createElement("div");
    div.innerHTML = response;

    // Uncommented for debugging purposes
    // let tds = div.getElementsByTagName("td")
    // console.log(tds);

    let as = div.getElementsByTagName('a');
    console.log(as);

    songs = [];
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }





    let songUL = document.querySelector(".scroll").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for(let song of songs) {
        songUL.innerHTML =         songUL.innerHTML    + 
        //  `<li> ${song.replaceAll("-"," ").replaceAll(/\d+/g, '')} </li>`
        `<li><img class="invert" width="34" src="img/music.svg" alt="" style="filter:invert(1)">
                            <div class="info">
                                <div style="color: white" >${song.replaceAll("-"," ").replaceAll(/\d+/g, '').split(".")[0].replaceAll("%", ' ')}</div>
                                <div style="color: grey" >Nischal</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="" style="filter:invert(1)">
                            </div> </li>`
      
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".scroll").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
    
}

// getsongs Function:

// Fetches data from the specified URL.
// Parses the response as text and creates a temporary div to manipulate the DOM.
// Extracts all <a> tags and filters out those ending with .mp3.
// Returns an array of song URLs.



// only using getsongs will not return anything
// getsongs().then(songs => console.log(songs))
// let songs = getsongs
// console.log(songs); will return a pending promise


// main Function:

// Calls getsongs and waits for the result.
// Logs the resulting array of song URLs.



const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src = "img/play.svg"
    // currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML =decodeURI(currentSong.src.split("http://127.0.0.1:3000/")).replaceAll("/"," ").replaceAll(","," ").split(".")[0].replaceAll("-"," ").replaceAll(/\d+/g, '')
    // console.log(document.querySelector(".songinfo").innerHTML);
    
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}





async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let albums = document.querySelector(".albums")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            albums.innerHTML = albums.innerHTML + 
            `<div class="card"  data-folder="${folder}">
                        <div class="img"><img src="/songs/${folder}/cover.jpg" alt=""></div>
                        <div class="play"><img src="img/play.svg" alt=""></div>
                        <div class="info">
                            <div class="name" >${response.title}</div>
                            <div class="artist" >${response.description}</div>
                        </div>
                    </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}





async function main (){



 // Get the list of all the songs
 await getSongs("songs/ncs")
 playMusic(songs[0], true)

 // Display all the albums on the page
 await displayAlbums()

    

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })


    // listen for time update
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
    })
    

    // for seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e);
        e.addEventListener("click", async item => {
            console.log(item,item.currentTarget.dataset);
            
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        } )
    })



    
    //play the  first song
    // var audio = new Audio(songs[0]);
    // audio.play(); 
        
}
main() 

