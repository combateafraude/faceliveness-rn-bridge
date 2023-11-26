package com.cafbridge_faceliveness;

import android.content.Intent;
import android.os.Bundle;

import com.caf.facelivenessiproov.input.FaceLiveness;
import com.caf.facelivenessiproov.input.VerifyLivenessListener;
import com.caf.facelivenessiproov.output.FaceLivenessResult;
import com.caf.facelivenessiproov.output.failure.NetworkReason;
import com.caf.facelivenessiproov.output.failure.SDKFailure;
import com.caf.facelivenessiproov.output.failure.ServerReason;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;


public class CafFaceLivenessActivity extends ReactActivity {
    private String token;
    private String personId;
    private String customConfig;
    private Intent intent;

    private FaceLivenessConfig config;

    private FaceLiveness faceLiveness;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        intent = getIntent();
        token = intent.getStringExtra("token");
        personId = intent.getStringExtra("personId");
        customConfig = intent.getStringExtra("config");

        try {
            config = new FaceLivenessConfig(customConfig);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        this.faceLiveness();
    }

    private void faceLiveness() {


        if (InternetConnectionChecker.isInternetConnected(getApplicationContext())) {
            WritableMap writableMap = new WritableNativeMap();
            writableMap.putString("type", "Error");
            writableMap.putString("message", "Error: Dispositivo não esta conectado a internet");

            getReactInstanceManager().getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FaceLiveness_Error", writableMap);
            finish();
        } else {
            faceLiveness = new FaceLiveness.Builder(token)
                    .setStage(config.cafStage)
                    .setFilter(config.filter)
                    .setEnableScreenshots(config.setEnableScreenshots)
                    .setLoadingScreen(config.setLoadingScreen)
                    .build();

            authenticate();
        }
    }

    private void authenticate() {
        faceLiveness.startSDK(this, personId, new VerifyLivenessListener() {
            @Override
            public void onSuccess(FaceLivenessResult faceLivenessResult) {
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("data", faceLivenessResult.getSignedResponse());

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceLiveness_Success", writableMap);
                finish();
            }

            @Override
            public void onError(FaceLivenessResult faceLivenessResult) {
                String message = "Error: " + faceLivenessResult.getErrorMessage();
                String type = "Error";
                WritableMap writableMap = new WritableNativeMap();
                SDKFailure sdkFailure = faceLivenessResult.getSdkFailure();

                if (sdkFailure instanceof NetworkReason) {
                    message = ("FaceLivenessResult " + "onError: " + " Throwable: " + ((NetworkReason) faceLivenessResult.getSdkFailure()).getThrowable());
                } else if (sdkFailure instanceof ServerReason) {
                    message = ("FaceLivenessResult " + "onError: " + " Status Code: " + ((ServerReason) faceLivenessResult.getSdkFailure()).getCode());
                    message = message + " Status Message: " + faceLivenessResult.getSdkFailure().getMessage();
                }

                writableMap.putString("message", message);
                writableMap.putString("type", type);

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceLiveness_Error", writableMap);
                finish();
            }

            @Override
            public void onCancel(FaceLivenessResult faceLivenessResult) {
                WritableMap writableMap = new WritableNativeMap();
                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceLiveness_Cancel", writableMap);
                finish();
            }

            @Override
            public void onLoading() {
                WritableMap writableMap = new WritableNativeMap();

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceLiveness_Loading", writableMap);
            }

            @Override
            public void onLoaded() {
                WritableMap writableMap = new WritableNativeMap();

                getReactInstanceManager().getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("FaceLiveness_Loaded", writableMap);
            }

        });
    }
}