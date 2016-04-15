package org.openbmp.api.service;

import org.openbmp.api.exception.OpenBMPApiException;

import java.util.List;

public interface DownstreamBgpAsnService {

    public List<Object[]> findAllDownstreamASNsBySearchCriteria(String searchCriteria, Integer asn) throws OpenBMPApiException;
}
