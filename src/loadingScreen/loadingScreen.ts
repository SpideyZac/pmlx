import { ModularLoadingScreen } from "./modularLoadingScreen";

export class LoadingScreen {
    private modernLoader: ModularLoadingScreen;

    constructor() {
        this.modernLoader = new ModularLoadingScreen();
    }

    setTotal(mods: number): void {
        this.modernLoader.setTotal(mods);
    }

    setCurrentTotalParts(parts: number): void {
        this.modernLoader.setCurrentSteps(parts);
    }

    updateBar(num: number): void {
        this.modernLoader.setTotal(
            Math.max(num, this.modernLoader["state"].total)
        );
    }

    nextPart(): void {
        this.modernLoader.nextStep();
    }

    startImportMod(url: string, version: string): void {
        this.modernLoader.startOperation(url, version, 3);
        this.modernLoader.updateStatus(
            `Importing mod from URL: ${url} @ version ${version}`
        );
    }

    startFetchLatest(): void {
        this.modernLoader.nextStep();
        const url = this.modernLoader["state"].url;
        this.modernLoader.updateStatus(
            `Fetching latest mod version from ${url}/latest.json`
        );
    }

    finishFetchLatest(version: string): void {
        this.modernLoader.updateStatus(
            `Fetched latest mod version: v${version}`
        );
    }

    startFetchManifest(): void {
        this.modernLoader.nextStep();
        const { url, version } = this.modernLoader["state"];
        this.modernLoader.updateStatus(
            `Fetching mod manifest from ${url}/${version}/manifest.json`
        );
    }

    startFetchModMain(js: string): void {
        this.modernLoader.nextStep();
        const { url, version } = this.modernLoader["state"];
        this.modernLoader.updateStatus(
            `Fetching mod js from ${url}/${version}/${js}`
        );
    }

    finishImportMod(): void {
        this.modernLoader.completeOperation();
    }

    errorCurrent(): void {
        this.modernLoader.markCurrentAsError();
    }

    end(): void {
        this.modernLoader.destroy();
    }
}
