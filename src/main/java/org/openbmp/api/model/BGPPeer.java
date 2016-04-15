package org.openbmp.api.model;

import org.openbmp.api.model.embed.BGPPeerKey;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "bgp_peers")
public class BGPPeer {

    @EmbeddedId
    private BGPPeerKey key;

    @Column(name = "peer_rd")
    private String peer_rd;

    //unsigned tiny int
    @Column(name = "isIPv4")
    private Integer isIPv4;

    @Column(name = "peer_addr")
    private String peer_addr;

    @Column(name = "name")
    private String name;

    @Column(name = "peer_bgp_id")
    private String peer_bgp_id;

    //unsigned int
    @Column(name = "peer_as")
    private Long peer_as;

    //tinyint
    @Column(name = "state")
    private Byte state;

    //tinyint
    @Column(name = "isL3VPNpeer")
    private Byte isL3VPNpeer;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    //tinyint
    @Column(name = "isPrePolicy")
    private Byte isPrePolicy;

    //varbinary
    @Column(name = "geo_ip_start")
    private byte[] geo_ip_start;

    @Column(name = "local_ip")
    private String local_ip;

    @Column(name = "local_bgp_id")
    private String local_bgp_id;

    //unsigned int
    @Column(name = "local_port")
    private Long local_port;

    //unsigned int
    @Column(name = "local_hold_time")
    private Long local_hold_time;

    //unsigned int
    @Column(name = "local_asn")
    private Long local_asn;

    //unsigned int
    @Column(name = "remote_port")
    private Long remote_port;

    //unsigned int
    @Column(name = "remote_hold_time")
    private Long remote_hold_time;

    @Column(name = "sent_capabilities")
    private String sent_capabilities;

    @Column(name = "recv_capabilities")
    private String recv_capabilities;

    //tinyint
    @Column(name = "bmp_reason")
    private Byte bmp_reason;

    //unsigned int
    @Column(name = "bgp_err_code")
    private Long bgp_err_code;

    //unsigned int
    @Column(name = "bgp_err_subcode")
    private Long bgp_err_subcode;

    @Column(name = "error_text")
    private String error_text;


    public BGPPeer(){

    }

    public BGPPeer(Long bgp_err_code, Long bgp_err_subcode, Byte bmp_reason, String error_text, byte[] geo_ip_start, Integer isIPv4, Byte isL3VPNpeer, Byte isPrePolicy, BGPPeerKey key, Long local_asn, String local_bgp_id, Long local_hold_time, String local_ip, Long local_port, String name, String peer_addr, Long peer_as, String peer_bgp_id, String peer_rd, String recv_capabilities, Long remote_hold_time, Long remote_port, String sent_capabilities, Byte state, Timestamp timestamp) {
        this.bgp_err_code = bgp_err_code;
        this.bgp_err_subcode = bgp_err_subcode;
        this.bmp_reason = bmp_reason;
        this.error_text = error_text;
        this.geo_ip_start = geo_ip_start;
        this.isIPv4 = isIPv4;
        this.isL3VPNpeer = isL3VPNpeer;
        this.isPrePolicy = isPrePolicy;
        this.key = key;
        this.local_asn = local_asn;
        this.local_bgp_id = local_bgp_id;
        this.local_hold_time = local_hold_time;
        this.local_ip = local_ip;
        this.local_port = local_port;
        this.name = name;
        this.peer_addr = peer_addr;
        this.peer_as = peer_as;
        this.peer_bgp_id = peer_bgp_id;
        this.peer_rd = peer_rd;
        this.recv_capabilities = recv_capabilities;
        this.remote_hold_time = remote_hold_time;
        this.remote_port = remote_port;
        this.sent_capabilities = sent_capabilities;
        this.state = state;
        this.timestamp = timestamp;
    }


    // getters and setters

    public BGPPeerKey getKey() {
        return key;
    }

    public void setKey(BGPPeerKey key) {
        this.key = key;
    }

    public Long getBgp_err_code() {
        return bgp_err_code;
    }

    public void setBgp_err_code(Long bgp_err_code) {
        this.bgp_err_code = bgp_err_code;
    }

    public Long getBgp_err_subcode() {
        return bgp_err_subcode;
    }

    public void setBgp_err_subcode(Long bgp_err_subcode) {
        this.bgp_err_subcode = bgp_err_subcode;
    }

    public Byte getBmp_reason() {
        return bmp_reason;
    }

    public void setBmp_reason(Byte bmp_reason) {
        this.bmp_reason = bmp_reason;
    }

    public String getError_text() {
        return error_text;
    }

    public void setError_text(String error_text) {
        this.error_text = error_text;
    }

    public byte[] getGeo_ip_start() {
        return geo_ip_start;
    }

    public void setGeo_ip_start(byte[] geo_ip_start) {
        this.geo_ip_start = geo_ip_start;
    }

    public Integer getIsIPv4() {
        return isIPv4;
    }

    public void setIsIPv4(Integer isIPv4) {
        this.isIPv4 = isIPv4;
    }

    public Byte getIsL3VPNpeer() {
        return isL3VPNpeer;
    }

    public void setIsL3VPNpeer(Byte isL3VPNpeer) {
        this.isL3VPNpeer = isL3VPNpeer;
    }

    public Byte getIsPrePolicy() {
        return isPrePolicy;
    }

    public void setIsPrePolicy(Byte isPrePolicy) {
        this.isPrePolicy = isPrePolicy;
    }

    public Long getLocal_asn() {
        return local_asn;
    }

    public void setLocal_asn(Long local_asn) {
        this.local_asn = local_asn;
    }

    public String getLocal_bgp_id() {
        return local_bgp_id;
    }

    public void setLocal_bgp_id(String local_bgp_id) {
        this.local_bgp_id = local_bgp_id;
    }

    public Long getLocal_hold_time() {
        return local_hold_time;
    }

    public void setLocal_hold_time(Long local_hold_time) {
        this.local_hold_time = local_hold_time;
    }

    public String getLocal_ip() {
        return local_ip;
    }

    public void setLocal_ip(String local_ip) {
        this.local_ip = local_ip;
    }

    public Long getLocal_port() {
        return local_port;
    }

    public void setLocal_port(Long local_port) {
        this.local_port = local_port;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPeer_addr() {
        return peer_addr;
    }

    public void setPeer_addr(String peer_addr) {
        this.peer_addr = peer_addr;
    }

    public Long getPeer_as() {
        return peer_as;
    }

    public void setPeer_as(Long peer_as) {
        this.peer_as = peer_as;
    }

    public String getPeer_bgp_id() {
        return peer_bgp_id;
    }

    public void setPeer_bgp_id(String peer_bgp_id) {
        this.peer_bgp_id = peer_bgp_id;
    }

    public String getPeer_rd() {
        return peer_rd;
    }

    public void setPeer_rd(String peer_rd) {
        this.peer_rd = peer_rd;
    }

    public String getRecv_capabilities() {
        return recv_capabilities;
    }

    public void setRecv_capabilities(String recv_capabilities) {
        this.recv_capabilities = recv_capabilities;
    }

    public Long getRemote_hold_time() {
        return remote_hold_time;
    }

    public void setRemote_hold_time(Long remote_hold_time) {
        this.remote_hold_time = remote_hold_time;
    }

    public Long getRemote_port() {
        return remote_port;
    }

    public void setRemote_port(Long remote_port) {
        this.remote_port = remote_port;
    }

    public String getSent_capabilities() {
        return sent_capabilities;
    }

    public void setSent_capabilities(String sent_capabilities) {
        this.sent_capabilities = sent_capabilities;
    }

    public Byte getState() {
        return state;
    }

    public void setState(Byte state) {
        this.state = state;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
