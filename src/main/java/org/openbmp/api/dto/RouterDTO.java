package org.openbmp.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/*@JsonPropertyOrder({"ip_address","router_AS","init_data", "name", "timestamp", "description", "isConnected", "isPassive", "term_reason_code", "term_reason_text"})*/
public class RouterDTO {

    /*private String hash_id;*/

    private String name;

    private String ip_address;

    private  Long router_AS;

    private String timestamp;

    private String description;

    private Byte isConnected;

    private Byte isPassive;

    private Integer term_reason_code;

    private String term_reason_text;

    /*private String term_data;*/

    private String init_data;

    /*private byte[] geo_ip_start;*/

    /*private String collector_hash_id;*/



    /*@JsonProperty("hash_id")
    public String getHash_id() {
        return hash_id;
    }

    public void setHash_id(String hash_id) {
        this.hash_id = hash_id;
    }*/



    @JsonProperty("RouterName")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("RouterIP")
    public String getIp_address() {
        return ip_address;
    }

    public void setIp_address(String ip_address) {
        this.ip_address = ip_address;
    }

    @JsonProperty("RouterAS")
    public Long getRouter_AS() {
        return router_AS;
    }

    public void setRouter_AS(Long router_AS) {
        this.router_AS = router_AS;
    }

    @JsonProperty("LastModified")
    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("isConnected")
    public Byte getIsConnected() {
        return isConnected;
    }

    public void setIsConnected(Byte isConnected) {
        this.isConnected = isConnected;
    }

    @JsonProperty("isPassive")
    public Byte getIsPassive() {
        return isPassive;
    }

    public void setIsPassive(Byte isPassive) {
        this.isPassive = isPassive;
    }

    @JsonProperty("LastTermCode")
    public Integer getTerm_reason_code() {
        return term_reason_code;
    }

    public void setTerm_reason_code(Integer term_reason_code) {
        this.term_reason_code = term_reason_code;
    }

    @JsonProperty("LastTermReason")
    public String getTerm_reason_text() {
        return term_reason_text;
    }

    public void setTerm_reason_text(String term_reason_text) {
        this.term_reason_text = term_reason_text;
    }

   /* @JsonProperty("term_data")
    public String getTerm_data() {
        return term_data;
    }

    public void setTerm_data(String term_data) {
        this.term_data = term_data;
    }*/

    @JsonProperty("InitData")
    public String getInit_data() {
        return init_data;
    }

    public void setInit_data(String init_data) {
        this.init_data = init_data;
    }

    /*@JsonProperty("geo_ip_start")
    public byte[] getGeo_ip_start() {
        return geo_ip_start;
    }

    public void setGeo_ip_start(byte[] geo_ip_start) {
        this.geo_ip_start = geo_ip_start;
    }

    @JsonProperty("collector_hash_id")
    public String getCollector_hash_id() {
        return collector_hash_id;
    }

    public void setCollector_hash_id(String collector_hash_id) {
        this.collector_hash_id = collector_hash_id;
    }*/
}
