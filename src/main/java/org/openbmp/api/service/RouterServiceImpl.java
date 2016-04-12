package org.openbmp.api.service;

import org.openbmp.api.dto.RouterDTO;
import org.openbmp.api.dao.RouterDao;
import org.openbmp.api.exception.OpenBMPApiException;
import org.openbmp.api.model.Router;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service("RouterServiceImpl")
@Transactional
public class RouterServiceImpl implements RouterService{

    @Inject
    RouterDao routerDao;

    public RouterServiceImpl(){

    }

    // Find all Routers
    public RouterServiceImpl(RouterDao routerDao){
        this.routerDao = routerDao;
    }

    public List<RouterDTO> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException{


        List<RouterDTO> routerDTOList = new ArrayList<RouterDTO>();
        try {
            List<Router> routerList = routerDao.findAllRouters(limit, withGeo, where, orderby);

            for (Router router : routerList) {
                RouterDTO routerBean = new RouterDTO();

                /*routerBean.setHash_id(router.getHash_id());*/
                routerBean.setName(router.getName());
                routerBean.setIp_address(router.getIp_address());
                routerBean.setRouter_AS(router.getRouter_AS());

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                routerBean.setTimestamp(dateFormat.format(router.getTimestamp()));

                routerBean.setDescription(router.getDescription());
                routerBean.setIsConnected(router.getIsConnected());
                routerBean.setIsPassive(router.getIsPassive());
                routerBean.setTerm_reason_code(router.getTerm_reason_code());
                routerBean.setTerm_reason_text(router.getTerm_reason_text());
           /*     routerBean.setTerm_data(router.getTerm_data());*/
                routerBean.setInit_data(router.getInit_data());
     /*           routerBean.setGeo_ip_start(router.getGeo_ip_start());
                routerBean.setCollector_hash_id(router.getCollector_hash_id());*/

                //
                routerDTOList.add(routerBean);
            }

        }

        catch (Exception e) {
            throw new OpenBMPApiException("Exception while listing Routers" + e.getMessage());
        }
        return routerDTOList;

        //return routerDao.findAllRouters();
    }


    // Find Routers Status Count
    public HashMap<String, String> getRoutersStatusCount() throws OpenBMPApiException {

        HashMap<String, String> result = routerDao.getRoutersStatusCount();

        return result;

    }


    // Find All Routers Up
    public List<RouterDTO> findAllRoutersUp(Integer limit, String where, String orderby) throws OpenBMPApiException{


        List<RouterDTO> routerDTOList = new ArrayList<RouterDTO>();
        try {
            List<Router> routerList = routerDao.findAllRoutersUp(limit, where, orderby);

            for (Router router : routerList) {
                RouterDTO routerBean = new RouterDTO();

                routerBean.setName(router.getName());
                routerBean.setIp_address(router.getIp_address());
                routerBean.setRouter_AS(router.getRouter_AS());
                routerBean.setDescription(router.getDescription());
                routerBean.setIsConnected(router.getIsConnected());
                routerBean.setIsPassive(router.getIsPassive());
                routerBean.setTerm_reason_code(router.getTerm_reason_code());
                routerBean.setTerm_reason_text(router.getTerm_reason_text());
                routerBean.setInit_data(router.getInit_data());
                //
                routerDTOList.add(routerBean);
            }

        }

        catch (Exception e) {
            throw new OpenBMPApiException("Exception while listing Routers whose Status is Up" + e.getMessage());
        }
        return routerDTOList;

    }

    // Find All Routers Down
    public List<RouterDTO> findAllRoutersDown(Integer limit, String where, String orderby) throws OpenBMPApiException{

        List<RouterDTO> routerDTOList = new ArrayList<RouterDTO>();
        try {
            List<Router> routerList = routerDao.findAllRoutersDown(limit, where, orderby);

            for (Router router : routerList) {
                RouterDTO routerBean = new RouterDTO();

                routerBean.setName(router.getName());
                routerBean.setIp_address(router.getIp_address());
                routerBean.setRouter_AS(router.getRouter_AS());
                routerBean.setDescription(router.getDescription());
                routerBean.setIsConnected(router.getIsConnected());
                routerBean.setIsPassive(router.getIsPassive());
                routerBean.setTerm_reason_code(router.getTerm_reason_code());
                routerBean.setTerm_reason_text(router.getTerm_reason_text());
                routerBean.setInit_data(router.getInit_data());
                //
                routerDTOList.add(routerBean);
            }

        }

        catch (Exception e) {
            throw new OpenBMPApiException("Exception while listing Routers whose Status is Down" + e.getMessage());
        }
        return routerDTOList;

    }

}
