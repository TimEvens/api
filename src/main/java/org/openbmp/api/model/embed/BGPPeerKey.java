package org.openbmp.api.model.embed;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

// Composite Primary key for BGP Peer Table
@Embeddable
public class BGPPeerKey implements Serializable{


    @Column(name = "hash_id")
    private String hash_id;

    @Column(name = "router_hash_id")
    private String router_hash_id;


    // getters and setters

    public String getHash_id() {
        return hash_id;
    }

    public void setHash_id(String hash_id) {
        this.hash_id = hash_id;
    }

    public String getRouter_hash_id() {
        return router_hash_id;
    }

    public void setRouter_hash_id(String router_hash_id) {
        this.router_hash_id = router_hash_id;
    }
}
