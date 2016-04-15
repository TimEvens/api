package org.openbmp.api.model;

import org.openbmp.api.model.embed.AddressType;
import org.openbmp.api.model.embed.ConnectionType;

public class GeoIP {


    private AddressType addr_type;

    // var binary
    private byte[] ip_start;

    //var binary
    private byte[] ip_end;

    private String country;

    private String stateprov;

    private String city;

    private double latitude;

    private double longitude;

    private double timezone_offset;

    private String timezone_name;

    private String isp_name;

    private ConnectionType connection_type;

    private String organization_name;


    public GeoIP(){

    }

    public GeoIP(AddressType addr_type, String city, ConnectionType connection_type, String country, byte[] ip_end, byte[] ip_start, String isp_name, double latitude, double longitude, String organization_name, String stateprov, String timezone_name, double timezone_offset) {
        this.addr_type = addr_type;
        this.city = city;
        this.connection_type = connection_type;
        this.country = country;
        this.ip_end = ip_end;
        this.ip_start = ip_start;
        this.isp_name = isp_name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.organization_name = organization_name;
        this.stateprov = stateprov;
        this.timezone_name = timezone_name;
        this.timezone_offset = timezone_offset;
    }


    public AddressType getAddr_type() {
        return addr_type;
    }

    public void setAddr_type(AddressType addr_type) {
        this.addr_type = addr_type;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public ConnectionType getConnection_type() {
        return connection_type;
    }

    public void setConnection_type(ConnectionType connection_type) {
        this.connection_type = connection_type;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public byte[] getIp_end() {
        return ip_end;
    }

    public void setIp_end(byte[] ip_end) {
        this.ip_end = ip_end;
    }

    public byte[] getIp_start() {
        return ip_start;
    }

    public void setIp_start(byte[] ip_start) {
        this.ip_start = ip_start;
    }

    public String getIsp_name() {
        return isp_name;
    }

    public void setIsp_name(String isp_name) {
        this.isp_name = isp_name;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getOrganization_name() {
        return organization_name;
    }

    public void setOrganization_name(String organization_name) {
        this.organization_name = organization_name;
    }

    public String getStateprov() {
        return stateprov;
    }

    public void setStateprov(String stateprov) {
        this.stateprov = stateprov;
    }

    public String getTimezone_name() {
        return timezone_name;
    }

    public void setTimezone_name(String timezone_name) {
        this.timezone_name = timezone_name;
    }

    public double getTimezone_offset() {
        return timezone_offset;
    }

    public void setTimezone_offset(double timezone_offset) {
        this.timezone_offset = timezone_offset;
    }
}
