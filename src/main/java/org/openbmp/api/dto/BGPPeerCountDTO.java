package org.openbmp.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"routerName","routerIP","ipType", "count"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BGPPeerCountDTO {

    /* DTO for returning count records by categories for BGP Peers Resource */

    private String routerName;
    private String routerIP;
    private String ipType;
    private String count;


    @JsonProperty("IP-Type")
    public String getIpType() {
        return ipType;
    }

    public void setIpType(String ipType) {
        this.ipType = ipType;
    }

    @JsonProperty("Count")
    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }

    @JsonProperty("RouterIP")
    public String getRouterIP() {
        return routerIP;
    }

    public void setRouterIP(String routerIP) {
        this.routerIP = routerIP;
    }

    @JsonProperty("RouterName")
    public String getRouterName() {
        return routerName;
    }

    public void setRouterName(String routerName) {
        this.routerName = routerName;
    }
}
