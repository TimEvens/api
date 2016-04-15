package org.openbmp.api.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository("DownstreamBgpAsnDaoImpl")
public class DownstreamBgpAsnDaoImpl implements DownstreamBgpAsnDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Transaction tx = null;

    public DownstreamBgpAsnDaoImpl() {

    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {

        this.sessionFactory = sessionFactory;
    }

    public List<Object[]> findAllDownstreamASNsBySearchCriteria(String searchCriteria, Integer asn){

        Session session = null;

        List<Object[]> records = new ArrayList<Object[]>();

        StringBuilder sqlQuery = new StringBuilder();

        if(searchCriteria.equals("criteria1")){

            sqlQuery.append("SELECT downstreamASN.asn,as_name,city,state_prov,country,org_name FROM \n" +
                    "(select distinct asn_right as asn from as_path_analysis where asn = :asn and asn_right != 0)              \n" +
                    "downstreamASN\n" +
                    "LEFT JOIN gen_whois_asn w ON (downstreamASN.asn = w.asn)\n" +
                    "GROUP BY downstreamASN.asn \n" +
                    "ORDER BY downstreamASN.asn");

        } else if(searchCriteria.equals("criteria2")){

            sqlQuery.append("SELECT downstreamASN.asn, count(distinct prefix_bin,prefix_len) as Prefixes_Learned, \n" +
                    "as_name,city,state_prov,country,org_name \n" +
                    "FROM (select distinct asn_right as asn,path_attr_hash_id from as_path_analysis where asn = :asn and asn_right != 0) \n" +
                    "downstreamASN\n" +
                    "JOIN rib on (downstreamASN.path_attr_hash_id = rib.path_attr_hash_id)\n" +
                    "LEFT JOIN gen_whois_asn w ON (downstreamASN.asn = w.asn)\n" +
                    "GROUP BY downstreamASN.asn \n" +
                    "ORDER BY downstreamASN.asn");

        } else if(searchCriteria.equals("criteria3")){

            sqlQuery.append("SELECT downstreamASN.asn, count(distinct prefix_bin,prefix_len) as Prefixes_Learned, \n" +
                    "p.peer_addr as PeerAddr,p.hash_id as peer_hash_id, \n" +
                    "as_name,city,state_prov,country,org_name \n" +
                    "FROM (select distinct asn_right as asn,path_attr_hash_id from as_path_analysis where asn = :asn and asn_right != 0) \n" +
                    "downstreamASN\n" +
                    "JOIN rib on (downstreamASN.path_attr_hash_id = rib.path_attr_hash_id)\n" +
                    "JOIN bgp_peers p ON (rib.peer_hash_id = p.hash_id)\n" +
                    "LEFT JOIN gen_whois_asn w ON (downstreamASN.asn = w.asn)\n" +
                    "GROUP BY downstreamASN.asn \n" +
                    "ORDER BY downstreamASN.asn");

        }

        try{
            session = sessionFactory.openSession();

            records = session.createSQLQuery(sqlQuery.toString()).setInteger("asn",asn).list();

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
