package org.openbmp.api.dao;

import org.openbmp.api.model.Router;

import java.util.List;

public interface RouterDao {

    public List<Router> findAllRoutersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby);

    public List<Object[]> getRoutersStatusCount();

}