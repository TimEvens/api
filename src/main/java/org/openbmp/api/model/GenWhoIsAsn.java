package org.openbmp.api.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name= "gen_whois_asncro")
public class GenWhoIsAsn {

    private Long asn;
    private String as_name;
    private String org_id;
    private String org_name;
    private String remarks;
    private String address;
    private String city;
    private String state_prov;
    private String postal_code;
    private String country;
    private String raw_output;
    private Timestamp timestamp;
    private String source;

    public GenWhoIsAsn() {
    }

    public GenWhoIsAsn(String address, String as_name, Long asn, String city, String country, String org_id, String org_name, String postal_code, String raw_output, String remarks, String source, String state_prov, Timestamp timestamp) {
        this.address = address;
        this.as_name = as_name;
        this.asn = asn;
        this.city = city;
        this.country = country;
        this.org_id = org_id;
        this.org_name = org_name;
        this.postal_code = postal_code;
        this.raw_output = raw_output;
        this.remarks = remarks;
        this.source = source;
        this.state_prov = state_prov;
        this.timestamp = timestamp;
    }

    // getters and setters
    @Column(name ="address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Column(name ="as_name")
    public String getAs_name() {
        return as_name;
    }

    public void setAs_name(String as_name) {
        this.as_name = as_name;
    }

    @Column(name ="asn")
    public Long getAsn() {
        return asn;
    }

    public void setAsn(Long asn) {
        this.asn = asn;
    }

    @Column(name ="city")
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Column(name ="country")
    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Column(name ="org_id")
    public String getOrg_id() {
        return org_id;
    }

    public void setOrg_id(String org_id) {
        this.org_id = org_id;
    }

    @Column(name ="org_name")
    public String getOrg_name() {
        return org_name;
    }

    public void setOrg_name(String org_name) {
        this.org_name = org_name;
    }

    @Column(name ="postal_code")
    public String getPostal_code() {
        return postal_code;
    }

    public void setPostal_code(String postal_code) {
        this.postal_code = postal_code;
    }

    @Column(name ="raw_output")
    public String getRaw_output() {
        return raw_output;
    }

    public void setRaw_output(String raw_output) {
        this.raw_output = raw_output;
    }

    @Column(name ="remarks")
    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    @Column(name ="source")
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    @Column(name ="state_prov")
    public String getState_prov() {
        return state_prov;
    }

    public void setState_prov(String state_prov) {
        this.state_prov = state_prov;
    }

    @Column(name ="timestamp")
    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
