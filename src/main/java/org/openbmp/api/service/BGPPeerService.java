package org.openbmp.api.service;

import org.openbmp.api.dto.BGPPeerDTO;
import org.openbmp.api.exception.OpenBMPApiException;

import java.util.List;

public interface BGPPeerService {

    public List<BGPPeerDTO> findAllPeersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException;

    public List<Object[]> findBGPPeersRecordsCountByCategory(String category) throws OpenBMPApiException;

}