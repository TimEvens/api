package org.openbmp.api.model.embed;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public enum ConnectionType implements Serializable {
    DIALUP,ISDN,CABLE,DSL,FTTX,WIRELESS;

    public String toString() {
        return name().toLowerCase();
    }
}
