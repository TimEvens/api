package org.openbmp.api.service;


import org.openbmp.api.dao.UpstreamBgpAsnDao;
import org.openbmp.api.exception.OpenBMPApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("UpstreamBgpAsnServiceImpl")
@Transactional
public class UpstreamBgpAsnServiceImpl implements UpstreamBgpAsnService {


    @Autowired
    UpstreamBgpAsnDao upstreamBgpAsnDao;

    public UpstreamBgpAsnServiceImpl(){

    }

    public UpstreamBgpAsnServiceImpl(UpstreamBgpAsnDao upstreamBgpAsnDao){
        this.upstreamBgpAsnDao = upstreamBgpAsnDao;
    }


    public List<Object[]> findAllUpstreamASNsBySearchCriteria(String searchCriteria, Integer asn) throws OpenBMPApiException{

        return upstreamBgpAsnDao.findAllUpstreamASNsBySearchCriteria(searchCriteria,asn);
    }
}
