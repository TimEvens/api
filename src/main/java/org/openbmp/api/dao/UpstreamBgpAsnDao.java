package org.openbmp.api.dao;

import java.util.List;

public interface UpstreamBgpAsnDao {

    public List<Object[]> findAllUpstreamASNsBySearchCriteria(String searchCriteria, Integer asn);
}
