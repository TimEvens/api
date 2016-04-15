package org.openbmp.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BGPPeerDTO {


    private String hash_id;

    private String router_hash_id;

    private String peer_rd;

    private Integer isIPv4;
    private String peer_addr;

    private String name;
    private String peer_bgp_id;

    private Long peer_as;

    private Byte state;

    private Byte isL3VPNpeer;

    private String timestamp;

    private Byte isPrePolicy;

    private byte[] geo_ip_start;

    private String local_ip;

    private String local_bgp_id;

    private Long local_port;

    private Long local_hold_time;

    private Long local_asn;

    private Long remote_port;

    private Long remote_hold_time;

    private String sent_capabilities;

    private String recv_capabilities;

    private Byte bmp_reason;

    private Long bgp_err_code;

    private Long bgp_err_subcode;

    private String error_text;


    @JsonProperty("bgp_err_code")
    public Long getBgp_err_code() {
        return bgp_err_code;
    }

    public void setBgp_err_code(Long bgp_err_code) {
        this.bgp_err_code = bgp_err_code;
    }

    @JsonProperty("bgp_err_subcode")
    public Long getBgp_err_subcode() {
        return bgp_err_subcode;
    }

    public void setBgp_err_subcode(Long bgp_err_subcode) {
        this.bgp_err_subcode = bgp_err_subcode;
    }

    @JsonProperty("bmp_reason")
    public Byte getBmp_reason() {
        return bmp_reason;
    }

    public void setBmp_reason(Byte bmp_reason) {
        this.bmp_reason = bmp_reason;
    }

    @JsonProperty("error_text")
    public String getError_text() {
        return error_text;
    }

    public void setError_text(String error_text) {
        this.error_text = error_text;
    }

    @JsonProperty("geo_ip_start")
    public byte[] getGeo_ip_start() {
        return geo_ip_start;
    }

    public void setGeo_ip_start(byte[] geo_ip_start) {
        this.geo_ip_start = geo_ip_start;
    }

    @JsonProperty("hash_id")
    public String getHash_id() {
        return hash_id;
    }

    public void setHash_id(String hash_id) {
        this.hash_id = hash_id;
    }

    @JsonProperty("isIPv4")
    public Integer getIsIPv4() {
        return isIPv4;
    }

    public void setIsIPv4(Integer isIPv4) {
        this.isIPv4 = isIPv4;
    }

    @JsonProperty("isL3VPNpeer")
    public Byte getIsL3VPNpeer() {
        return isL3VPNpeer;
    }

    public void setIsL3VPNpeer(Byte isL3VPNpeer) {
        this.isL3VPNpeer = isL3VPNpeer;
    }

    @JsonProperty("isPrePolicy")
    public Byte getIsPrePolicy() {
        return isPrePolicy;
    }

    public void setIsPrePolicy(Byte isPrePolicy) {
        this.isPrePolicy = isPrePolicy;
    }

    @JsonProperty("local_asn")
    public Long getLocal_asn() {
        return local_asn;
    }

    public void setLocal_asn(Long local_asn) {
        this.local_asn = local_asn;
    }

    @JsonProperty("local_bgp_id")
    public String getLocal_bgp_id() {
        return local_bgp_id;
    }

    public void setLocal_bgp_id(String local_bgp_id) {
        this.local_bgp_id = local_bgp_id;
    }

    @JsonProperty("local_hold_time")
    public Long getLocal_hold_time() {
        return local_hold_time;
    }

    public void setLocal_hold_time(Long local_hold_time) {
        this.local_hold_time = local_hold_time;
    }

    @JsonProperty("local_ip")
    public String getLocal_ip() {
        return local_ip;
    }

    public void setLocal_ip(String local_ip) {
        this.local_ip = local_ip;
    }

    @JsonProperty("local_port")
    public Long getLocal_port() {
        return local_port;
    }

    public void setLocal_port(Long local_port) {
        this.local_port = local_port;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("peer_addr")
    public String getPeer_addr() {
        return peer_addr;
    }

    public void setPeer_addr(String peer_addr) {
        this.peer_addr = peer_addr;
    }

    @JsonProperty("peer_as")
    public Long getPeer_as() {
        return peer_as;
    }

    public void setPeer_as(Long peer_as) {
        this.peer_as = peer_as;
    }

    @JsonProperty("peer_bgp_id")
    public String getPeer_bgp_id() {
        return peer_bgp_id;
    }

    public void setPeer_bgp_id(String peer_bgp_id) {
        this.peer_bgp_id = peer_bgp_id;
    }

    @JsonProperty("peer_id")
    public String getPeer_rd() {
        return peer_rd;
    }

    public void setPeer_rd(String peer_rd) {
        this.peer_rd = peer_rd;
    }

    @JsonProperty("recv_capabilities")
    public String getRecv_capabilities() {
        return recv_capabilities;
    }

    public void setRecv_capabilities(String recv_capabilities) {
        this.recv_capabilities = recv_capabilities;
    }

    @JsonProperty("remote_hold_name")
    public Long getRemote_hold_time() {
        return remote_hold_time;
    }

    public void setRemote_hold_time(Long remote_hold_time) {
        this.remote_hold_time = remote_hold_time;
    }

    @JsonProperty("remote_port")
    public Long getRemote_port() {
        return remote_port;
    }

    public void setRemote_port(Long remote_port) {
        this.remote_port = remote_port;
    }

    @JsonProperty("router_hash_id")
    public String getRouter_hash_id() {
        return router_hash_id;
    }

    public void setRouter_hash_id(String router_hash_id) {
        this.router_hash_id = router_hash_id;
    }

    @JsonProperty("sent_capabilities")
    public String getSent_capabilities() {
        return sent_capabilities;
    }

    public void setSent_capabilities(String sent_capabilities) {
        this.sent_capabilities = sent_capabilities;
    }

    @JsonProperty("state")
    public Byte getState() {
        return state;
    }

    public void setState(Byte state) {
        this.state = state;
    }

    @JsonProperty("timestamp")
    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
