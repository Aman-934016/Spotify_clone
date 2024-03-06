console.log("Let's write JavaScript");
let currentsong=new Audio();
function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs() {
    let a = await fetch("http://192.168.29.31:3000/Songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let Songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split("/Songs/")[1]);
        }
    }
    return Songs;
}
const playMusic=(track,pause=false)=>{
    if(!pause){
        currentsong.play()
        play.src="pause.svg"
    }
    currentsong.src="/Songs/"+track
    document.querySelector(".song-info").innerHTML=decodeURI(track)
    document.querySelector(".song-time").innerHTML=("00:00/00:00"*100)
}

async function main() {
    let x = await getsongs();
    playMusic(x[0],true)
    console.log(x);
    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of x) {
        songul.innerHTML = songul.innerHTML + `<li><div class="play-music">
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Song Artist</div>
        </div>
        <div class="play-now">
            <span>Play now</span>
            <img style="padding-right: 5px;" class="invert" src="play.svg" alt="">
        </div> </li>`;
    }
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })

    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration)

        document.querySelector(".song-time").innerHTML = 
        `${secondsToMinutesSeconds(currentsong.currentTime)*10}/${secondsToMinutesSeconds(currentsong.duration)*10}`

        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%";

        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left=percent+"%";
            currentsong.currentTime=((currentsong.duration)*percent)/100
        })
    })

    document.querySelector("#hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-100%"
    })

    prev.addEventListener("click",()=>{
        let index=x.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(x[index-1])
        }
    })

    next.addEventListener("click",()=>{
        let index=x.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)<x.length){
            playMusic(x[index+1])
        }
    })
}


main();
