package org.openbmp.api.service;

import org.openbmp.api.dto.RouterDTO;
import org.openbmp.api.exception.OpenBMPApiException;

import java.util.List;

public interface RouterService {

    public List<RouterDTO> findAllRoutersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException;

    public List<Object[]> getRoutersStatusCount() throws OpenBMPApiException;

}