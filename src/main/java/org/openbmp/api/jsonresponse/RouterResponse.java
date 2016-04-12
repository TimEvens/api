package org.openbmp.api.jsonresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.openbmp.api.dto.RouterDTO;

public class RouterResponse {

    private String Result;

    private RouterDTO Records;

    private String Message;

    public RouterResponse() {
    }


    @JsonProperty("Result")
    public String getResult() {
        return Result;
    }

    public void setResult(String result) {
        Result = result;
    }

    @JsonProperty("Records")
    public RouterDTO getRecords() {
        return Records;
    }

    public void setRecords(RouterDTO records) {
        Records = records;
    }

    @JsonProperty("Message")
    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }
}
