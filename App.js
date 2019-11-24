Number.prototype.timeFormat = function(){
    // let time = new Date(this);
    // let h = "0" + (time.getHours() - 9);
    // let m = "0" + time.getMinutes();
    // let s = "0" + time.getSeconds();
    // h.substr(h.length - 2, h.length);
    // m.substr(m.length - 2, m.length);
    // s.substr(s.length - 2, s.length);

    let h = "0" + Math.floor(this / 3600);
    let m = "0" + Math.floor((this % 3600) / 60);
    let s = "0" + Math.floor(this % 60);
    h = h.substring(h.length - 2, h.length);
    m = m.substring(m.length - 2, m.length);
    s = s.substring(s.length - 2, s.length);

    return `${h}:${m}:${s}`;
}

class App{
    constructor(playerEl, listEl){
        this.player = new Player(playerEl, this);
        this.playList = new PlayList(listEl, this);
    }
}

window.addEventListener("load", () => {
    let app = new App("#player", "#play-list");
});