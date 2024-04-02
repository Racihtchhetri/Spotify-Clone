let currentsong = new Audio();
let songs ;
function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and remaining seconds
   
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time string
    return `${formattedMinutes} : ${formattedSeconds}`;
}


async function getSongs(){
    let a = await fetch("/songs/")
    let response = await a.text();
    // console.log(response)
    let div = document.createElement('div');
    div.innerHTML =response;
    let as = div.getElementsByTagName('a')
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (track) => {
    currentsong.src = "/songs/" + track;
    currentsong.play();
    play.src = "pause.svg";
    document.querySelector('.songinfo').innerHTML = track.replaceAll("%20", " "); // Replace %20 with spaces
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
  
}


async function main(){
    
    // list of all the songs
    songs = await getSongs();
  
    let songUl = document.querySelector(".liabraryContent").getElementsByTagName('ul')[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li class ="back">
        <img  class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div class="songname">${song.replaceAll("%20"," ")}</div>
                           
                        </div>  </li>`;
    }
//Attach an event listener to each songs

Array.from(document.querySelector('.liabraryContent').getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element =>{
        
        playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
    })
})

let play = document.getElementById('play');
play.addEventListener("click", (e) => {
    if (currentsong.paused) {
        currentsong.play();
        play.src = "pause.svg";
    } else {
        currentsong.pause();
        play.src = "play.svg";
    }
});

currentsong.addEventListener("timeupdate", () => {
    document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} : ${secondsToMinutesSeconds(currentsong.duration)}`

    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration) * 100 + "%";
})
 

document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
});



//previous button

let previousBtn = document.getElementById('previous');
previousBtn.addEventListener("click", (e) => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1) <= songs.length){
    playMusic(songs[index-1])
    }
   
})

//next button

let nextBtn = document.getElementById('next');
nextBtn.addEventListener("click", (e) => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index+1) < songs.length){
    playMusic(songs[index+1])
    }
})
//add eventlistener to volume 
document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("click", (e) => {
    const volumeValue = parseInt(e.target.value);
    currentsong.volume = parseInt(e.target.value)/100;

      // Change volume image if volume is 0
      const volumeImg = document.querySelector(".vol");
      if (volumeValue === 0) {
          volumeImg.src = "mute.svg"; // Replace "mute.png" with the path to your mute image
      } else {
          volumeImg.src = "volume.svg"; // Replace "volume.png" with the path to your normal volume image
      }
})
}
main();