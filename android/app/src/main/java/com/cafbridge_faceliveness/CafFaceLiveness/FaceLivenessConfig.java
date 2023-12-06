package com.cafbridge_faceliveness.CafFaceLiveness;

import com.caf.facelivenessiproov.input.CAFStage;
import com.caf.facelivenessiproov.input.iproov.Filter;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class FaceLivenessConfig implements Serializable {
    public CAFStage cafStage = CAFStage.PROD;
    public Filter filter = Filter.LINE_DRAWING;
    public boolean setEnableScreenshots = false;
    public boolean setLoadingScreen = false;


    public  FaceLivenessConfig(String jsonString) throws JSONException {
        JSONObject jsonObject = new JSONObject(jsonString);

        if (jsonObject.has("cafStage")) {
            this.cafStage = CAFStage.valueOf(jsonObject.getString("cafStage"));
        }

        if (jsonObject.has("filter")) {
            this.filter = Filter.valueOf(jsonObject.getString("filter"));
        }

        if (jsonObject.has("setEnableScreenshots")) {
            this.setEnableScreenshots = jsonObject.getBoolean("setEnableScreenshots");
        }

        if (jsonObject.has("setLoadingScreen")) {
            this.setLoadingScreen = jsonObject.getBoolean("setLoadingScreen");
        }
    }
}