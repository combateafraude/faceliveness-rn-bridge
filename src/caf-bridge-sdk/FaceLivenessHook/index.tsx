import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import { useEffect, useState } from "react";
import * as T from './types.d';


const isAndroid = Platform.OS === "android";

export const CAF_FACELIVENESS_MODULE =  NativeModules.CafFaceLiveness;
export const CAF_FACELIVENESS_MODULE_EMITTER = new NativeEventEmitter(CAF_FACELIVENESS_MODULE);

const defaultConfig: T.IFaceLivenessConfig = {
  cafStage: T.FaceLivenessCAFStage.PROD,
  filter: T.FaceLivenessFilter.LINE_DRAWING,
  setEnableScreenshots: false,
  setLoadingScreen: false
}

function formatedConfig(config?: T.IFaceLivenessConfig): string {
  const responseConfig = config || defaultConfig;

  return JSON.stringify({
    ...responseConfig,
    filter: isAndroid ? T.FaceLivenessFilter[responseConfig.filter]: responseConfig.filter,
    cafStage: isAndroid ? T.FaceLivenessCAFStage[responseConfig.cafStage] : responseConfig.cafStage
  })
}

function FaceLivenessHook(token: string, config?: T.IFaceLivenessConfig): T.FaceLivenessHookReturnType {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<T.FaceLivenessErrorType | undefined>();
  const [data, setData] = useState<string | undefined>();

  const handleEvent = (event: string, res?: T.FaceLivenessSDKResponseType) => {
    switch (event) {
      case "FaceLiveness_Success":
        setData(res?.data?.toString());
        break;
      case "FaceLiveness_Loading":
        setLoading(true);
        break;
      case "FaceLiveness_Loaded":
        setLoading(false);
        break;
      case "FaceLiveness_Error":
        setError({...res} as T.FaceLivenessErrorType);
        break;
      case "FaceLiveness_Cancel":
        setLoading(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const eventListener = (event: T.FaceLivenessEvent, res?: T.FaceLivenessSDKResponseType) =>
      handleEvent(event, res);

    CAF_FACELIVENESS_MODULE.addListener("FaceLiveness_Success", (event: any) => eventListener("FaceLiveness_Success", event));
    CAF_FACELIVENESS_MODULE.addListener("FaceLiveness_Loading", (event: any) => eventListener("FaceLiveness_Loading", event));
    CAF_FACELIVENESS_MODULE.addListener("FaceLiveness_Loaded", (event: any) => eventListener("FaceLiveness_Loaded", event));
    CAF_FACELIVENESS_MODULE.addListener("FaceLiveness_Error", (event: any) => eventListener("FaceLiveness_Error", event));
    CAF_FACELIVENESS_MODULE.addListener("FaceLiveness_Cancel", (event: any) => eventListener("FaceLiveness_Cancel", event));

    return () => {
      CAF_FACELIVENESS_MODULE_EMITTER.removeAllListeners("FaceLiveness_Success");
      CAF_FACELIVENESS_MODULE_EMITTER.removeAllListeners("FaceLiveness_Loading");
      CAF_FACELIVENESS_MODULE_EMITTER.removeAllListeners("FaceLiveness_Loaded");
      CAF_FACELIVENESS_MODULE_EMITTER.removeAllListeners("FaceLiveness_Error");
      CAF_FACELIVENESS_MODULE_EMITTER.removeAllListeners("FaceLiveness_Cancel");
    };
  }, [token]);

  const authenticate = (personId: string): void => {
    setData(undefined);
    setError(undefined);
    setLoading(true);
    console.log(formatedConfig(config))
    console.log(T.FaceLivenessCAFStage[config?.cafStage])
    CAF_FACELIVENESS_MODULE.faceLiveness(token, personId, formatedConfig(config));
  };

  return [authenticate, data, loading, error];
}

export default FaceLivenessHook;
