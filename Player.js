const REPEATMODE = {
    "NO" : 0,
    "ONE" : 1,
    "LIST" : 2
};

class Player {
    constructor(el, app){
        this.app = app;
        this.playerDom = document.querySelector(el);
        this.audio = this.playerDom.querySelector("audio");
        this.pBar = this.playerDom.querySelector(".bar");
        this.cTime = this.playerDom.querySelector(".current-time");
        this.dTime = this.playerDom.querySelector(".total-time");
        
        this.filename = this.playerDom.querySelector(".file-name");
        this.filename.innerHTML = "선택한 파일이 없습니다.";

        this.playable = false;

        this.progress = this.playerDom.querySelector(".progress");
        this.playBtn = this.playerDom.querySelector("#playBtn");

        this.canvas = document.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.visualInfo = {
            aCtx:null,
            analyser:null,
            dataArray:[],
            barHeight:0,
            x:0,
            barWidth:0
        }

        // this.repeatMode = 0;
        this.repeatMode = REPEATMODE.NO;
        this.modeBtnList = document.querySelectorAll(".mode-btn > input");

        this.addEvent();

        requestAnimationFrame(()=>{
            this.frame();
        });
    }

    initVisual(){
        let v = document.querySelector("#visualizer");
        this.canvas.width = v.clientWidth;
        this.canvas.height = v.clientHeight;

        this.visualInfo.aCtx = new AudioContext(); //오디오 정보들을 다룰 수 있는 Context
        let src = this.visualInfo.aCtx.createMediaElementSource(this.audio);
        const analyser = this.visualInfo.analyser = this.visualInfo.aCtx.createAnalyser();
        src.connect(this.visualInfo.aCtx.destination);
        src.connect(analyser);
        analyser.fftSize = 256;

        const W = this.canvas.width;
        const bufferLength = analyser.frequencyBinCount; //읽기 전용 속성
        
        this.visualInfo.barWidth = ( (W + 100) / (bufferLength + 1 ));
        this.visualInfo.dataArray = new Uint8Array(bufferLength);
    }

    addEvent(){
        this.playBtn.addEventListener("click", ()=>{
            this.play();
        });
        document.querySelector("#stopBtn").addEventListener("click", ()=>{
            this.stop();
        });
        this.audio.addEventListener("loadeddata", ()=>{
            this.playable = true;
            
            this.play();            
        });

        this.audio.addEventListener("ended", () => {
            this.musicEnd();
        });

        this.progress.addEventListener("click", (e)=>{
            this.changeSeeking(e);
        });

        this.modeBtnList.forEach(btn => {
            btn.addEventListener("change", e => {
                this.repeatMode = e.target.value * 1;
            });
        });
    }

    loadMusic(file){
        if(this.visualInfo.aCtx == null){
            this.initVisual();
        }

        let fileURL = URL.createObjectURL(file);
        this.audio.src = fileURL;
        this.filename.innerHTML = file.name;
        
    }

    play(){
        if(!this.playable) return;
        
        if(this.audio.paused){
            this.audio.play();
            this.playBtn.innerHTML = "일시정지";
        }else {
            this.audio.pause();
            this.playBtn.innerHTML = "재생";
        }
    }

    stop(){
        //나중에 이부분에 정지 제어가 들어갑니다.
        this.audio.pause();
    }

    musicEnd(){
        if(this.repeatMode == REPEATMODE.NO){
            this.app.list.getNextMusic(false);
        }else if(this.repeatMode == REPEATMODE.ONE){
            this.audio.currentTime = 0;
            this.play();
        }else if(this.repeatMode == REPEATMODE.LIST){
            this.app.list.getNextMusic(true);
        }
    }

    frame(timestamp){
        this.render();
        requestAnimationFrame(()=>{
            this.frame();
        });
    }

    render(){
        if(!this.playable) return;

        let c = this.audio.currentTime;
        let d = this.audio.duration;
        this.pBar.style.width = `${c / d * 100}%`;

        
        this.cTime.innerHTML = c.timeFormat();
        this.dTime.innerHTML = d.timeFormat();
        
        this.visualInfo.analyser.getByteFrequencyData(this.visualInfo.dataArray);
        
        const W = this.canvas.width;
        const H = this.canvas.height;
        const ctx = this.ctx; //캔버스에 그려주기 위한 코드
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0,0,W,H);

        const arr = this.visualInfo.dataArray;
        const w = this.visualInfo.barWidth;
        let x = 0;
        for (let i = 0; i < arr.length; i++){
            let h = H * arr[i] / 255;
            ctx.fillStyle = this.getColor(arr[i]);
            ctx.fillRect(x,H / 2 - h / 2, w, h / 2);
            ctx.fillRect(x,H / 2, w, h / 2);
            x += w;
        }
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,H / 2, W, 1);
    }

    getColor(value){
        let r = 255 - value - 50;
        let g = 255 - value - 50;
        let b = value - 50;

        return `rgb(${r}, ${g}, ${b})`;
    }

    changeSeeking(e){
        if(!this.playable) return;
        
        let seek = e.offsetX / this.progress.clientWidth * this.audio.duration;
        this.audio.currentTime = seek;
    }
}