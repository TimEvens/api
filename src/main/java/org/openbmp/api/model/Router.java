package org.openbmp.api.model;

import javax.persistence.*;
import java.sql.Timestamp;


@Entity
@Table(name = "routers")
public class Router {

    @Id
    //@GeneratedValue
    @Column(name = "hash_id")
    private String hash_id;

    @Column(name = "name")
    private String name;

    @Column(name = "ip_address")
    private String ip_address;

    // unsigned INT
    @Column(name = "router_AS")
    private  Long router_AS;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    @Column(name = "description")
    private String description;

    @Column(name = "isConnected")
    private Byte isConnected;

    @Column(name = "isPassive")
    private Byte isPassive;

    @Column(name = "term_reason_code")
    private Integer term_reason_code;

    @Column(name = "term_reason_text")
    private String term_reason_text;

    // medium text - String (or) byte[]
    @Column(name = "term_data")
    private String term_data;

    // medium text - String (or) byte[]
    @Column(name = "init_data")
    private String init_data;

    @Column(name = "geo_ip_start")
    private byte[] geo_ip_start;

    @Column(name = "collector_hash_id")
    private String collector_hash_id;


    public Router(){

    }

    public Router(String hash_id, String name, String ip_address, Long router_AS, Timestamp timestamp, String description, Byte isConnected, Byte isPassive, Integer term_reason_code, String term_reason_text, String term_data, String init_data, byte[] geo_ip_start, String collector_hash_id) {
        this.hash_id = hash_id;
        this.name = name;
        this.ip_address = ip_address;
        this.router_AS = router_AS;
        this.timestamp = timestamp;
        this.description = description;
        this.isConnected = isConnected;
        this.isPassive = isPassive;
        this.term_reason_code = term_reason_code;
        this.term_reason_text = term_reason_text;
        this.term_data = term_data;
        this.init_data = init_data;
        this.geo_ip_start = geo_ip_start;
        this.collector_hash_id = collector_hash_id;
    }

    // Getters and Setters


    public String getHash_id() {
        return hash_id;
    }

    public void setHash_id(String hash_id) {
        this.hash_id = hash_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIp_address() {
        return ip_address;
    }

    public void setIp_address(String ip_address) {
        this.ip_address = ip_address;
    }

    public Long getRouter_AS() {
        return router_AS;
    }

    public void setRouter_AS(Long router_AS) {
        this.router_AS = router_AS;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Byte getIsConnected() {
        return isConnected;
    }

    public void setIsConnected(Byte isConnected) {
        this.isConnected = isConnected;
    }

    public Byte getIsPassive() {
        return isPassive;
    }

    public void setIsPassive(Byte isPassive) {
        this.isPassive = isPassive;
    }

    public Integer getTerm_reason_code() {
        return term_reason_code;
    }

    public void setTerm_reason_code(Integer term_reason_code) {
        this.term_reason_code = term_reason_code;
    }

    public String getTerm_data() {
        return term_data;
    }

    public void setTerm_data(String term_data) {
        this.term_data = term_data;
    }

    public String getTerm_reason_text() {
        return term_reason_text;
    }

    public void setTerm_reason_text(String term_reason_text) {
        this.term_reason_text = term_reason_text;
    }

    public String getInit_data() {
        return init_data;
    }

    public void setInit_data(String init_data) {
        this.init_data = init_data;
    }

    public byte[] getGeo_ip_start() {
        return geo_ip_start;
    }

    public void setGeo_ip_start(byte[] geo_ip_start) {
        this.geo_ip_start = geo_ip_start;
    }

    public String getCollector_hash_id() {
        return collector_hash_id;
    }

    public void setCollector_hash_id(String collector_hash_id) {
        this.collector_hash_id = collector_hash_id;
    }
}
