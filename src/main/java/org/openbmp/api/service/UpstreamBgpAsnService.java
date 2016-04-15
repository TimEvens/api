package org.openbmp.api.service;

import org.openbmp.api.exception.OpenBMPApiException;

import java.util.List;

public interface UpstreamBgpAsnService {

    public List<Object[]> findAllUpstreamASNsBySearchCriteria(String searchCriteria, Integer asn) throws OpenBMPApiException;
}
