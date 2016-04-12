package org.openbmp.api.dao;

import org.openbmp.api.model.Router;

import java.util.HashMap;
import java.util.List;

public interface RouterDao {

    /*public List<Router> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby);

    public List<Router> findAllRoutersUp(Integer limit, String where, String orderby);*/



    public List<Router> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby);

    public HashMap<String,String> getRoutersStatusCount();

    public List<Router> findAllRoutersUp(Integer limit, String where, String orderby);

    public List<Router> findAllRoutersDown(Integer limit, String where, String orderby);

}