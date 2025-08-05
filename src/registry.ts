import { ModularLoadingScreen } from "./loadingScreen";

export const PolyVersion = "0.5.1";
export const ActiveLoaderRegistry = {};
export const ActiveLoadingScreen = new ModularLoadingScreen();
ActiveLoadingScreen.destroy(); // temp
