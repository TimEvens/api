package org.openbmp.api.dao;

import org.openbmp.api.model.BGPPeer;

import java.util.List;

public interface BGPPeerDao {

    public List<BGPPeer> findAllPeersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby);

    public List<Object[]> findBGPPeersRecordsCountByCategory(String category);

}