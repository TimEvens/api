package org.openbmp.api.exception;

@SuppressWarnings("serial")
public class OpenBMPApiException extends Exception {

    public OpenBMPApiException() {
        super("OpenBMPApiException occured due to business logic failure");

    }

    public OpenBMPApiException(String message) {
        super(message);

    }

    public OpenBMPApiException(String message, Exception exception) {
        super(message, exception);

    }

}