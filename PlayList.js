class PlayList{
    constructor(el, app){
        this.app = app;
        this.listDom = document.querySelector(el);
        this.itemList = document.querySelector(".item-list");
        this.itemList.innerHTML = "";

        this.fileList = [];
        this.idx = 0;

        this.addEvent();
    }

    addEvent(){
        document.querySelector("#openDialog").addEventListener("click", () => {
            document.querySelector("#audioFile").click();
        });

        document.querySelector("#audioFile").addEventListener("change", e => {
            let files = e.target.files;
            for(let i = 0; i < files.length; i++){
                let file = files[i];

                if(file.type.substring(0, 5) !== "audio"){
                    return;
                }

                let item = document.createElement("li");
                item.classList.add("item");
                item.innerHTML = file.name;
                item.dataset.idx = this.idx;

                let obj = {id:this.idx++, file:file, dom:item};
                this.fileList.push(obj);

                item.addEventListener("dblclick", e => {
                    if(document.querySelector(".active"))
                        document.querySelector(".active").classList.remove("active");
                    item.classList.add("active");

                    let id = e.target.dataset.idx;
                    let music = this.fileList.find(x => x.id == id);
                    this.app.player.loadMusic(music.file);

                    // this.app.player.loadMusic(file);
                });

                this.itemList.append(item);
            }

            e.target.value = "";
        });
    }
}