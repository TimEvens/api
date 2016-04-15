package org.openbmp.api.model;


import org.openbmp.api.model.embed.AsPathAnalysisKey;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "as_path_analysisco")
public class AsPathAnalysis {

    @EmbeddedId
    private AsPathAnalysisKey primaryKey;

    @Column(name = "asn_left")
    private Long asn_left;

    @Column(name = "asn_right")
    private Long asn_right;

    @Column(name = "timestamp")
    private Timestamp timestamp;


    public AsPathAnalysis() {
    }

    public AsPathAnalysis(Long asn_left, Long asn_right, AsPathAnalysisKey primaryKey, Timestamp timestamp) {
        this.asn_left = asn_left;
        this.asn_right = asn_right;
        this.primaryKey = primaryKey;
        this.timestamp = timestamp;
    }

    // getters and setters

    public AsPathAnalysisKey getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(AsPathAnalysisKey primaryKey) {
        this.primaryKey = primaryKey;
    }

    public Long getAsn_left() {
        return asn_left;
    }

    public void setAsn_left(Long asn_left) {
        this.asn_left = asn_left;
    }

    public Long getAsn_right() {
        return asn_right;
    }

    public void setAsn_right(Long asn_right) {
        this.asn_right = asn_right;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
