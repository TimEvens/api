package org.openbmp.api.dao;

import java.util.List;

public interface DownstreamBgpAsnDao {

    public List<Object[]> findAllDownstreamASNsBySearchCriteria(String searchCriteria, Integer asn);
}
