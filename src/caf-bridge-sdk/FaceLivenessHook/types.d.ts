export type FaceLivenessErrorType = {
    type: string;
    message: string;
}

export type FaceLivenessSDKResponseType = Partial <FaceLivenessErrorType> & {
    data?: string;
};

export type FaceLivenessEvent =
    | "FaceLiveness_Success"
    | "FaceLiveness_Loading"
    | "FaceLiveness_Loaded"
    | "FaceLiveness_Error"
    | "FaceLiveness_Cancel";

export type FaceLivenessHookReturnType = [
    (personId: string) => void,
    FaceLivenessResponseType | undefined,
    boolean,
    FaceLivenessErrorType | undefined
];

export enum FaceLivenessCAFStage {
    BETA,
    PROD,
    DEV,
}

export enum FaceLivenessFilter {
    LINE_DRAWING,
    NATURAL,
}

export interface IFaceLivenessConfig {
    cafStage?: CAFStage;
    filter?: Filter;
    setEnableScreenshots?: boolean;
    setLoadingScreen?: boolean;
}