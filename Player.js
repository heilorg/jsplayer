class Player{
    constructor(el, app){
        this.app = app;
        this.playerDom = document.querySelector(el);
        this.audio = this.playerDom.querySelector("audio");
        this.bar = this.playerDom.querySelector(".bar");
        this.cTime = this.playerDom.querySelector(".current-time");
        this.tTime = this.playerDom.querySelector(".total-time");
        this.fileName = this.playerDom.querySelector(".file-name");
        this.progress = this.playerDom.querySelector(".progress");
        this.playBtn = this.playerDom.querySelector("#playBtn");
        this.playable = false;

        this.addEvent();
        requestAnimationFrame(() => this.frame());
    }
    
    addEvent(){
        document.querySelector("#playBtn").addEventListener("click", () => {
            this.play();
        });
        document.querySelector("#stopBtn").addEventListener("click", () => {
            this.stop();
        });
        this.audio.addEventListener("loadeddata", () => {
            this.play();
            this.playable = true;
        });

        this.progress.addEventListener("click", e => {
            this.changeSeeking(e);
        });
    }

    loadMusic(file){
        let fileURL = URL.createObjectURL(file);
        this.audio.src = fileURL;
        this.fileName.innerText = file.name;
        this.playable = true;
    }

    play(){
        if(!this.playable)return;

        if(this.audio.paused){
            this.audio.play();
            this.playBtn.innerText = "일시정지";
            this.playBtn.style.backgroundColor = "rgb(193, 72, 241)";
        }else{
            this.audio.pause();
            this.playBtn.innerText = "재생";
            this.playBtn.style.backgroundColor = "rgb(72, 72, 241)";
        }
    }
    stop(){
        if(this.playable){
            this.audio.currentTime = 0;
            this.audio.pause();
        }
    }

    frame(timeStamp){
        this.render();
        requestAnimationFrame(() => {
            this.frame();
        });
    }

    render(){
        if(!this.playable)return;

        let current = this.audio.currentTime;
        let duration = this.audio.duration;
        
        // this.cTime.innerText = this.getTimeData(current * 1000);
        // this.tTime.innerText = this.getTimeData(duration * 1000);
        this.cTime.innerText = current.timeFormat();
        this.tTime.innerText = duration.timeFormat();

        this.bar.style.width = `${current / duration * 100}%`;
    }

    changeSeeking(e){
        if(!this.playable)return;
        let w = this.progress.clientWidth;
        let x = e.offsetX;
        let d = this.audio.duration;

        this.audio.current = x / w * d;
    }
}