export type LoadingConfig = {
    title?: string;
    logoSrc?: string;
    backgroundColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    containerSelector?: string;
};

export type ProgressState = {
    current: number;
    total: number;
    currentStep: number;
    totalSteps: number;
    url: string;
    version: string;
};

export type StatusMessage = {
    text: string;
    isError?: boolean;
};
