package org.openbmp.api.service;

import org.openbmp.api.dto.RouterDTO;
import org.openbmp.api.exception.OpenBMPApiException;

import java.util.HashMap;
import java.util.List;

public interface RouterService {

    /*public List<RouterDTO> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException;

    public List<RouterDTO> findAllRoutersUp(Integer limit, String where, String orderby) throws OpenBMPApiException;*/


    public List<RouterDTO> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException;

    public HashMap<String, String> getRoutersStatusCount() throws OpenBMPApiException;

    public List<RouterDTO> findAllRoutersUp(Integer limit, String where, String orderby) throws OpenBMPApiException;

    public List<RouterDTO> findAllRoutersDown(Integer limit, String where, String orderby) throws OpenBMPApiException;


}