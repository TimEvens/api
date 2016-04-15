package org.openbmp.api.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.openbmp.api.model.BGPPeer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Repository("BGPPeerDaoImpl")
public class BGPPeerDaoImpl implements BGPPeerDao {


    @Autowired
    private SessionFactory sessionFactory;

    private Transaction tx = null;

    public BGPPeerDaoImpl() {

    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    // Find BGP Peers By A Search Criteria
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<BGPPeer> findAllPeersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby){

        Object criteriaVal = criteriaValue;

        Session session = null;
        List<BGPPeer> peerList = new ArrayList<BGPPeer>();

        long fetchStartTime = 0;

        StringBuilder baseQuery = new StringBuilder();

        try{

            session = sessionFactory.openSession();

            baseQuery.append("from BGPPeer bp");

            // append PathParam into query
            if(searchCriteria.equals("none")){
                baseQuery.append("  WHERE 1 = :criteriaVal");
                criteriaVal = Integer.valueOf(criteriaValue);
            }
            if(searchCriteria.equals("peerHashId")){
                baseQuery.append("  WHERE bp.key.hash_id = :criteriaVal");
            } else if(searchCriteria.equals("LocalIP")){
                baseQuery.append("  WHERE bp.local_ip LIKE :criteriaVal");
                criteriaVal = criteriaValue + "%";
            } else if(searchCriteria.equals("peerIP")){
                baseQuery.append("  WHERE bp.peer_addr LIKE :criteriaVal");
                criteriaVal = criteriaValue + "%";
            } else if(searchCriteria.equals("peerASN")){
                baseQuery.append("  WHERE bp.peer_as = :criteriaVal");
                criteriaVal = Long.valueOf(criteriaValue);
            }


            // append remaining QueryParams into query

            if (where != null && !where.isEmpty()) {
                baseQuery.append(" AND bp." + where);
            }

            if (orderby != null && !orderby.isEmpty()) {
                baseQuery.append(" ORDER BY bp." + orderby);
            }

            if (withGeo == null) {

                if (limit != null) {

                    System.out.println(" scenario 1 executed ");
                    fetchStartTime = System.currentTimeMillis();

                        peerList = session.createQuery(baseQuery.toString()).setParameter("criteriaVal",criteriaVal).setMaxResults(limit).list();

                    System.out.println("The scenario 1 Fetch time is : " + (System.currentTimeMillis() - fetchStartTime));
                } else {

                    System.out.println("scenario 2 executed ");
                    fetchStartTime = System.currentTimeMillis();

                        peerList = session.createQuery(baseQuery.toString()).setParameter("criteriaVal",criteriaVal).list();

                    System.out.println("The scenario 2 Fetch time is : " + (System.currentTimeMillis() - fetchStartTime));
                }

            } else {
                // todo change this query

                System.out.println("scenario 3 executed");
                fetchStartTime = System.currentTimeMillis();

                    peerList = session.createQuery(baseQuery.toString()).setParameter("criteriaVal",criteriaVal).setMaxResults(limit).list();

                System.out.println("The scenario 3 Fetch time is : " + (System.currentTimeMillis() - fetchStartTime));
            }


        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }


        return peerList;

    }


    // Find BGP Peers Records Count By a Certain Category Type
    public List<Object[]> findBGPPeersRecordsCountByCategory(String category){

        Session session = null;

        List<Object[]> records = new ArrayList<Object[]>();

        StringBuilder sqlQuery = new StringBuilder();

        if(category.equals("peerCountsByStatusIP")){
            sqlQuery.append("SELECT if(isL3VPNpeer, 'VPN', if(isIpv4, 'IPv4', 'IPv6')) as `IP-Type`,count(hash_id) as Count FROM bgp_peers GROUP BY `IP-Type`");
        } else if(category.equals("routersWithCountOfPeersByIPType")){
            sqlQuery.append("SELECT RouterName,RouterIP,if(isPeerVPN, 'VPN', if(isPeerIPv4, 'IPv4', 'IPv6')) as `IP-Type`, count(peer_hash_id) as Count FROM v_peers GROUP BY RouterName,`IP-Type`");
        }

        try{
            session = sessionFactory.openSession();

            records = session.createSQLQuery(sqlQuery.toString()).list();

        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }


        return records;
    }





}