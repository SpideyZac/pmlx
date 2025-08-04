// This code is terrible - I stole it from the PML project

export class LoadingScreen {
    private loadingDiv: HTMLDivElement;
    private loadingUI: HTMLDivElement;
    private loadingText: HTMLParagraphElement;
    private loadingBarOuter: HTMLDivElement;
    private loadingBarInner: HTMLDivElement;
    private loadingBarFill: HTMLDivElement;
    private progressDiv: HTMLDivElement;

    private total: number = 0;
    private current = {
        num: 0,
        text: null as HTMLParagraphElement | null,
        url: "",
        version: "",
        totalParts: 0,
        part: 0,
    };

    constructor() {
        const ui = document.getElementById("ui")!;
        this.loadingDiv = this.createLoadingContainer();
        this.loadingUI = document.createElement("div");
        this.loadingUI.style.margin = "20px 0 0 0";

        this.loadingText = this.createText("[PMLX] Loading Mods...", "32px");

        this.loadingBarOuter = this.createOuterBar();
        this.loadingBarInner = this.createInnerBar();
        this.loadingBarFill = this.createFillBar();

        this.loadingBarInner.appendChild(this.loadingBarFill);
        this.loadingBarOuter.appendChild(this.loadingBarInner);

        this.progressDiv = document.createElement("div");
        this.progressDiv.style.textAlign = "left";
        this.progressDiv.style.width = "1000px";
        this.progressDiv.style.margin = "50px auto";

        this.loadingUI.appendChild(this.loadingText);
        this.loadingUI.appendChild(this.loadingBarOuter);
        this.loadingUI.appendChild(this.progressDiv);

        this.loadingDiv.appendChild(this.loadingUI);
        ui.appendChild(this.loadingDiv);
    }

    setTotal(mods: number) {
        this.total = mods;
    }

    setCurrentTotalParts(parts: number) {
        this.current.totalParts = parts;
    }

    updateBar(num: number) {
        this.current.num = num;
        this.loadingBarFill.style.width = `${(this.current.num / this.total) * 100}%`;
    }

    nextPart() {
        this.updateBar(this.current.num + this.current.part / this.current.totalParts);
        this.current.part += 1;
    }

    private currPartStr() {
        return `[${this.current.part}/${this.current.totalParts}]`;
    }

    startImportMod(url: string, version: string) {
        this.current.url = url;
        this.current.version = version;
        this.current.part = 0;

        this.progressDiv.innerHTML = "";
        this.current.text = this.appendStatusText(`Importing mod from URL: ${url} @ version ${version}`);
    }

    startFetchLatest() {
        this.nextPart();
        this.current.text = this.appendStatusText(
            `${this.currPartStr()} Fetching latest mod version from ${this.current.url}/latest.json`
        );
    }

    finishFetchLatest(version: string) {
        this.current.version = version;
        if (this.current.text) {
            this.current.text.innerText = `${this.currPartStr()} Fetched latest mod version: v${version}`;
        }
    }

    startFetchManifest() {
        this.nextPart();
        this.current.text = this.appendStatusText(
            `${this.currPartStr()} Fetching mod manifest from ${this.current.url}/${this.current.version}/manifest.json`
        );
    }

    startFetchModMain(js: string) {
        this.nextPart();
        this.current.text = this.appendStatusText(
            `${this.currPartStr()} Fetching mod js from ${this.current.url}/${this.current.version}/${js}`
        );
    }

    finishImportMod() {
        this.current.totalParts = 0;
        this.current.part = 0;
        this.updateBar(Math.floor(this.current.num) + 1);
    }

    errorCurrent() {
        if (this.current.text) {
            this.current.text.style.color = "red";
        }
    }

    end() {
        this.loadingDiv.remove();
    }

    private createLoadingContainer(): HTMLDivElement {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.position = "absolute";
        div.style.left = "0";
        div.style.top = "0";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.textAlign = "center";
        div.style.backgroundColor = "#192042";
        div.style.transition = "background-color 1s ease-out";
        div.style.overflow = "hidden";

        div.innerHTML = `<img src="./public/pmllogo.svg" style="width: calc(100vw * (1000 / 1300)); height: 200px; margin: 30px auto 0 auto" />`;
        return div;
    }

    private createText(content: string, fontSize: string): HTMLParagraphElement {
        const p = document.createElement("p");
        p.innerText = content;
        p.style.margin = "5px";
        p.style.color = "#ffffff";
        p.style.fontSize = fontSize;
        p.style.fontStyle = "italic";
        p.style.fontFamily = "ForcedSquare, Arial, sans-serif";
        p.style.lineHeight = "1";
        return p;
    }

    private createOuterBar(): HTMLDivElement {
        const bar = document.createElement("div");
        bar.style.margin = "0 auto";
        bar.style.width = "600px";
        bar.style.height = "50px";
        bar.style.backgroundColor = "#28346a";
        bar.style.clipPath = "polygon(9px 0, 100% 0, calc(100% - 9px) 100%, 0 100%)";
        bar.style.overflow = "hidden";
        return bar;
    }

    private createInnerBar(): HTMLDivElement {
        const bar = document.createElement("div");
        bar.style.margin = "15px 20px";
        bar.style.width = "560px";
        bar.style.height = "20px";
        bar.style.backgroundColor = "#222244";
        bar.style.clipPath = "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)";
        bar.style.boxShadow = "inset 0 0 6px #000000";
        return bar;
    }

    private createFillBar(): HTMLDivElement {
        const bar = document.createElement("div");
        bar.style.width = "0";
        bar.style.height = "100%";
        bar.style.backgroundColor = "#ffffff";
        bar.style.clipPath = "polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)";
        bar.style.boxShadow = "inset 0 0 6px #000000";
        bar.style.transition = "width 0.1s ease-in-out";
        return bar;
    }

    private appendStatusText(message: string): HTMLParagraphElement {
        const p = this.createText(message, "18px");
        this.progressDiv.appendChild(p);
        return p;
    }
}
