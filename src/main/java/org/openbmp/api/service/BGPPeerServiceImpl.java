package org.openbmp.api.service;

import org.openbmp.api.dao.BGPPeerDao;
import org.openbmp.api.dto.BGPPeerDTO;
import org.openbmp.api.exception.OpenBMPApiException;
import org.openbmp.api.model.BGPPeer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service("BGPPeerServiceImpl")
@Transactional
public class BGPPeerServiceImpl implements BGPPeerService{

    @Autowired
    BGPPeerDao bgpPeerDao;

    public BGPPeerServiceImpl(){

    }

    public BGPPeerServiceImpl(BGPPeerDao bgpPeerDao){
        this.bgpPeerDao = bgpPeerDao;
    }


    // find all peers by a search criteria like peerSearchId / LocalIP / peer ASN etc..

    public List<BGPPeerDTO> findAllPeersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby) throws OpenBMPApiException{


        List<BGPPeerDTO> peerDTOList = new ArrayList<BGPPeerDTO>();
        try {
            List<BGPPeer> peerList = bgpPeerDao.findAllPeersBySearchCriteria(searchCriteria, criteriaValue, limit, withGeo, where, orderby);

            for (BGPPeer peer : peerList) {
                BGPPeerDTO peerBean = new BGPPeerDTO();

                peerBean.setHash_id(peer.getKey().getHash_id());
                peerBean.setRouter_hash_id(peer.getKey().getRouter_hash_id());

                peerBean.setPeer_rd(peer.getPeer_rd());
                peerBean.setIsIPv4(peer.getIsIPv4());
                peerBean.setPeer_addr(peer.getPeer_addr());
                peerBean.setName(peer.getName());
                peerBean.setPeer_bgp_id(peer.getPeer_bgp_id());
                peerBean.setPeer_as(peer.getPeer_as());
                peerBean.setState(peer.getState());
                peerBean.setIsL3VPNpeer(peer.getIsL3VPNpeer());

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                peerBean.setTimestamp(dateFormat.format(peer.getTimestamp()));
                peerBean.setIsPrePolicy(peer.getIsPrePolicy());
                peerBean.setGeo_ip_start(peer.getGeo_ip_start());
                peerBean.setLocal_ip(peer.getLocal_ip());
                peerBean.setLocal_bgp_id(peer.getLocal_bgp_id());
                peerBean.setLocal_port(peer.getLocal_port());
                peerBean.setLocal_hold_time(peer.getLocal_hold_time());
                peerBean.setLocal_asn(peer.getLocal_asn());
                peerBean.setRemote_port(peer.getRemote_port());
                peerBean.setRemote_hold_time(peer.getRemote_hold_time());
                peerBean.setSent_capabilities(peer.getSent_capabilities());
                peerBean.setRecv_capabilities(peer.getRecv_capabilities());
                peerBean.setBmp_reason(peer.getBmp_reason());
                peerBean.setBgp_err_code(peer.getBgp_err_code());
                peerBean.setBgp_err_subcode(peer.getBgp_err_subcode());
                peerBean.setError_text(peer.getError_text());

                //
                peerDTOList.add(peerBean);
            }

        }

        catch (Exception e) {
            throw new OpenBMPApiException("Exception while listing BGP Peers by " + searchCriteria +  e.getMessage());
        }
        return peerDTOList;
    }



    public List<Object[]> findBGPPeersRecordsCountByCategory(String category) throws OpenBMPApiException{

        return bgpPeerDao.findBGPPeersRecordsCountByCategory(category);
    }


}
