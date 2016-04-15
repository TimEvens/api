package org.openbmp.api.service;


import org.openbmp.api.dao.DownstreamBgpAsnDao;
import org.openbmp.api.exception.OpenBMPApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("DownstreamBgpAsnServiceImpl")
@Transactional
public class DownstreamBgpAsnServiceImpl implements DownstreamBgpAsnService {


    @Autowired
    DownstreamBgpAsnDao downstreamBgpAsnDao;

    public DownstreamBgpAsnServiceImpl(){

    }

    public DownstreamBgpAsnServiceImpl(DownstreamBgpAsnDao downstreamBgpAsnDao){
        this.downstreamBgpAsnDao = downstreamBgpAsnDao;
    }


    public List<Object[]> findAllDownstreamASNsBySearchCriteria(String searchCriteria, Integer asn) throws OpenBMPApiException{

        return downstreamBgpAsnDao.findAllDownstreamASNsBySearchCriteria(searchCriteria,asn);
    }
}
