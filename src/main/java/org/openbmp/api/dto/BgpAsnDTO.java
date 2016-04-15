package org.openbmp.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"asn","prefixesLearned","peerAddr", "peerHashId", "asName", "city", "stateProv", "country", "orgName"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BgpAsnDTO {

    // General DTO for both Upstream and Downstream ASN data

    private String asn;

    private String prefixesLearned;

    private String peerAddr;
    private String peerHashId;

    private String asName;
    private String city;
    private String stateProv;
    private String country;
    private String orgName;

    // Only used in Downstream
    private String peerAsn;


    @JsonProperty("asn")
    public String getAsn() {
        return asn;
    }

    public void setAsn(String asn) {
        this.asn = asn;
    }

    @JsonProperty("as_name")
    public String getAsName() {
        return asName;
    }

    public void setAsName(String asName) {
        this.asName = asName;
    }

    @JsonProperty("city")
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @JsonProperty("country")
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @JsonProperty("org_name")
    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    @JsonProperty("PeerAddr")
    public String getPeerAddr() {
        return peerAddr;
    }

    public void setPeerAddr(String peerAddr) {
        this.peerAddr = peerAddr;
    }

    @JsonProperty("peer_hash_id")
    public String getPeerHashId() {
        return peerHashId;
    }

    public void setPeerHashId(String peerHashId) {
        this.peerHashId = peerHashId;
    }

    @JsonProperty("Prefixes_Learned")
    public String getPrefixesLearned() {
        return prefixesLearned;
    }

    public void setPrefixesLearned(String prefixesLearned) {
        this.prefixesLearned = prefixesLearned;
    }

    @JsonProperty("state_prov")
    public String getStateProv() {
        return stateProv;
    }

    public void setStateProv(String stateProv) {
        this.stateProv = stateProv;
    }

    @JsonProperty("PeerASN")
    public String getPeerAsn() {
        return peerAsn;
    }

    public void setPeerAsn(String peerAsn) {
        this.peerAsn = peerAsn;
    }
}
