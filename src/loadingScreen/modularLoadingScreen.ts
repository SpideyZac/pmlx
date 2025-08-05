import { LoadingConfig, ProgressState, StatusMessage } from "./types";

class ProgressBar {
    private container: HTMLDivElement;
    private fill: HTMLDivElement;
    private config: Required<LoadingConfig>;

    constructor(config: Required<LoadingConfig>) {
        this.config = config;
        this.container = this.createProgressBar();
        this.fill = this.container.querySelector(
            ".progress-fill"
        ) as HTMLDivElement;
    }

    public updateProgress(percentage: number): void {
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        this.fill.style.width = `${clampedPercentage}%`;
    }

    public getElement(): HTMLDivElement {
        return this.container;
    }

    private createProgressBar(): HTMLDivElement {
        const outer = document.createElement("div");
        outer.className = "progress-bar-outer";
        this.applyProgressBarStyles(outer);

        const inner = document.createElement("div");
        inner.className = "progress-bar-inner";
        this.applyInnerBarStyles(inner);

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        this.applyFillBarStyles(fill);

        inner.appendChild(fill);
        outer.appendChild(inner);

        return outer;
    }

    private applyProgressBarStyles(element: HTMLDivElement): void {
        Object.assign(element.style, {
            margin: "0 auto",
            width: "600px",
            height: "50px",
            backgroundColor: this.config.secondaryColor,
            clipPath: "polygon(9px 0, 100% 0, calc(100% - 9px) 100%, 0 100%)",
            overflow: "hidden",
        });
    }

    private applyInnerBarStyles(element: HTMLDivElement): void {
        Object.assign(element.style, {
            margin: "15px 20px",
            width: "560px",
            height: "20px",
            backgroundColor: "#222244",
            clipPath: "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
            boxShadow: "inset 0 0 6px #000000",
        });
    }

    private applyFillBarStyles(element: HTMLDivElement): void {
        Object.assign(element.style, {
            width: "0",
            height: "100%",
            backgroundColor: this.config.primaryColor,
            clipPath: "polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)",
            boxShadow: "inset 0 0 6px #000000",
            transition: "width 0.1s ease-in-out",
        });
    }
}

class StatusLog {
    private container: HTMLDivElement;
    private config: Required<LoadingConfig>;
    private currentMessage: HTMLParagraphElement | null = null;

    constructor(config: Required<LoadingConfig>) {
        this.config = config;
        this.container = this.createStatusContainer();
    }

    public addMessage(message: StatusMessage): HTMLParagraphElement {
        const messageElement = this.createMessageElement(message);
        this.container.appendChild(messageElement);
        this.currentMessage = messageElement;
        return messageElement;
    }

    public markCurrentAsError(): void {
        if (this.currentMessage) {
            this.currentMessage.style.color = "red";
        }
    }

    public clear(): void {
        this.container.innerHTML = "";
        this.currentMessage = null;
    }

    public getElement(): HTMLDivElement {
        return this.container;
    }

    private createStatusContainer(): HTMLDivElement {
        const container = document.createElement("div");
        Object.assign(container.style, {
            textAlign: "left",
            width: "1000px",
            margin: "50px auto",
        });
        return container;
    }

    private createMessageElement(message: StatusMessage): HTMLParagraphElement {
        const element = document.createElement("p");
        element.innerText = message.text;
        Object.assign(element.style, {
            margin: "5px",
            color: message.isError ? "red" : this.config.primaryColor,
            fontSize: "18px",
            fontFamily: this.config.fontFamily,
            lineHeight: "1.2",
        });
        return element;
    }
}

export class ModularLoadingScreen {
    private config: Required<LoadingConfig>;
    private elements: {
        container: HTMLDivElement;
        ui: HTMLDivElement;
        title: HTMLParagraphElement;
        progressBar: ProgressBar;
        statusLog: StatusLog;
    };
    private state: ProgressState;

    constructor(config: LoadingConfig = {}) {
        this.config = this.mergeConfig(config);
        this.state = this.initializeState();
        this.elements = this.createElements();
        this.render();
    }

    public setTotal(total: number): void {
        this.state.total = Math.max(0, total);
        this.updateProgress();
    }

    public setCurrentSteps(totalSteps: number): void {
        this.state.totalSteps = Math.max(0, totalSteps);
        this.state.currentStep = 0;
    }

    public nextStep(): void {
        if (this.state.currentStep < this.state.totalSteps) {
            this.state.currentStep++;
            this.updateProgress();
        }
    }

    public startOperation(
        url: string,
        version: string,
        totalSteps: number = 1
    ): void {
        this.state.url = url;
        this.state.version = version;
        this.state.currentStep = 0;
        this.state.totalSteps = totalSteps;
        this.elements.statusLog.clear();
    }

    public updateStatus(
        message: string,
        isError: boolean = false
    ): HTMLParagraphElement {
        const stepInfo =
            this.state.totalSteps > 1
                ? `[${this.state.currentStep}/${this.state.totalSteps}] `
                : "";
        return this.elements.statusLog.addMessage({
            text: `${stepInfo}${message}`,
            isError,
        });
    }

    public markCurrentAsError(): void {
        this.elements.statusLog.markCurrentAsError();
    }

    public completeOperation(): void {
        this.state.current = Math.min(this.state.current + 1, this.state.total);
        this.state.currentStep = 0;
        this.state.totalSteps = 0;
        this.updateProgress();
    }

    public destroy(): void {
        this.elements.container.remove();
    }

    public getProgressPercentage(): number {
        if (this.state.total === 0) return 0;
        const baseProgress = this.state.current / this.state.total;
        const stepProgress =
            this.state.totalSteps > 0
                ? this.state.currentStep /
                  this.state.totalSteps /
                  this.state.total
                : 0;
        return Math.min(100, (baseProgress + stepProgress) * 100);
    }

    private mergeConfig(config: LoadingConfig): Required<LoadingConfig> {
        return {
            title: config.title || "[PMLX] Loading Mods...",
            logoSrc: config.logoSrc || "./public/pmllogo.svg",
            backgroundColor: config.backgroundColor || "#192042",
            primaryColor: config.primaryColor || "#ffffff",
            secondaryColor: config.secondaryColor || "#28346a",
            fontFamily: config.fontFamily || "ForcedSquare, Arial, sans-serif",
            containerSelector: config.containerSelector || "#ui",
        };
    }

    private initializeState(): ProgressState {
        return {
            current: 0,
            total: 0,
            currentStep: 0,
            totalSteps: 0,
            url: "",
            version: "",
        };
    }

    private createElements() {
        const container = this.createContainer();
        const ui = this.createUI();
        const title = this.createTitle();
        const progressBar = new ProgressBar(this.config);
        const statusLog = new StatusLog(this.config);
        return { container, ui, title, progressBar, statusLog };
    }

    private createContainer(): HTMLDivElement {
        const container = document.createElement("div");
        Object.assign(container.style, {
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            textAlign: "center",
            backgroundColor: this.config.backgroundColor,
            transition: "background-color 1s ease-out",
            overflow: "hidden",
        });
        container.innerHTML = `<img src="${this.config.logoSrc}" style="width: calc(100vw * (1000 / 1300)); height: 200px; margin: 30px auto 0 auto" />`;
        return container;
    }

    private createUI(): HTMLDivElement {
        const ui = document.createElement("div");
        ui.style.margin = "20px 0 0 0";
        return ui;
    }

    private createTitle(): HTMLParagraphElement {
        const title = document.createElement("p");
        title.innerText = this.config.title;
        Object.assign(title.style, {
            margin: "5px",
            color: this.config.primaryColor,
            fontSize: "32px",
            fontStyle: "italic",
            fontFamily: this.config.fontFamily,
            lineHeight: "1",
        });
        return title;
    }

    private render(): void {
        const targetElement = document.querySelector(
            this.config.containerSelector
        );
        if (!targetElement) {
            throw new Error(
                `Container element not found: ${this.config.containerSelector}`
            );
        }
        this.elements.ui.appendChild(this.elements.title);
        this.elements.ui.appendChild(this.elements.progressBar.getElement());
        this.elements.ui.appendChild(this.elements.statusLog.getElement());
        this.elements.container.appendChild(this.elements.ui);
        targetElement.appendChild(this.elements.container);
    }

    private updateProgress(): void {
        const percentage = this.getProgressPercentage();
        this.elements.progressBar.updateProgress(percentage);
    }
}
