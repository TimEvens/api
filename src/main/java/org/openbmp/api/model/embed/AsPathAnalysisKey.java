package org.openbmp.api.model.embed;

import javax.persistence.Column;
import javax.persistence.Embeddable;

// Composite Primary key for As Path Analysis Table
@Embeddable
public class AsPathAnalysisKey {

    @Column(name = "asn")
    private Long asn;

    @Column(name = "path_attr_hash_id")
    private String path_attr_hash_id;

    @Column(name = "peer_hash_id")
    private String peer_hash_id;


    public Long getAsn() {
        return asn;
    }

    public void setAsn(Long asn) {
        this.asn = asn;
    }

    public String getPath_attr_hash_id() {
        return path_attr_hash_id;
    }

    public void setPath_attr_hash_id(String path_attr_hash_id) {
        this.path_attr_hash_id = path_attr_hash_id;
    }

    public String getPeer_hash_id() {
        return peer_hash_id;
    }

    public void setPeer_hash_id(String peer_hash_id) {
        this.peer_hash_id = peer_hash_id;
    }
}
