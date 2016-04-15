package org.openbmp.api.model.embed;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public enum AddressType implements Serializable{
    IPV4, IPV6;

    public String toString() {
        return name().toLowerCase();
    }
}
