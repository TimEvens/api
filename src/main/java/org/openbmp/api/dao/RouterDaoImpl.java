package org.openbmp.api.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.openbmp.api.model.Router;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Repository("RouterDaoImpl")
public class RouterDaoImpl implements RouterDao {


    @Autowired
    private SessionFactory sessionFactory;

    private Transaction tx = null;

    public RouterDaoImpl(){

    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<Router> findAllRouters(Integer limit, Boolean withGeo, String where, String orderby){

        Session session = null;
        List<Router> routerList = new ArrayList<Router>();

        try{

            session = sessionFactory.openSession();
            /*routerList = session.createCriteria(Router.class).list();*/

            StringBuilder baseQuery = new StringBuilder();
            baseQuery.append("from Router rt");

            if(where != null && !where.isEmpty()){
                baseQuery.append(" WHERE rt." + where);
            }

            if(orderby != null && !orderby.isEmpty()){
                baseQuery.append(" ORDER BY rt." + orderby);
            }

           if(withGeo == null){

               if(limit != null){
                   routerList = session.createQuery(baseQuery.toString()).setMaxResults(limit).list();
               }else{
                   routerList = session.createQuery(baseQuery.toString()).list();
               }

           } else{
                // todo change this query
                    routerList = session.createQuery(baseQuery.toString()).setMaxResults(limit).list();
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }


        /*List<Router> routerList = sessionFactory.getCurrentSession().createCriteria(Router.class).list();*/


        return routerList;
    }


    // Find Status Count of Routers
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public HashMap<String,String> getRoutersStatusCount(){

        Session session = null;
        HashMap<String,String> statusCountMap = new HashMap<String, String>();

        try{

            session = sessionFactory.openSession();

            List<Object[]> rows = session.createSQLQuery("SELECT if(isConnected, 'UP', 'DOWN') as StatusType,count(hash_id) as Count FROM routers GROUP BY StatusType").list();

            for (Object[] row : rows) {
                String statusType = (String) row[0];
                BigInteger count = (BigInteger) row[1];

                statusCountMap.put(statusType,count.toString());

            }

        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }

        return statusCountMap;

    }




    // Find all routers up
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<Router> findAllRoutersUp(Integer limit, String where, String orderby){

        Session session = null;
        List<Router> routerList = new ArrayList<Router>();

        try{

            session = sessionFactory.openSession();

            StringBuilder baseQuery = new StringBuilder();
            baseQuery.append("from Router rt WHERE rt.isConnected = 1");

            if(where != null && !where.isEmpty()){
                baseQuery.append(" WHERE rt." + where);
            }

            if(orderby != null && !orderby.isEmpty()){
                baseQuery.append(" ORDER BY rt." + orderby);
            }

            if(limit != null){
                    routerList = session.createQuery(baseQuery.toString()).setMaxResults(limit).list();
            }else{
                    routerList = session.createQuery(baseQuery.toString()).list();
            }


        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }


        return routerList;
    }


    // Find all routers down
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<Router> findAllRoutersDown(Integer limit, String where, String orderby){

        Session session = null;
        List<Router> routerList = new ArrayList<Router>();

        try{

            session = sessionFactory.openSession();

            StringBuilder baseQuery = new StringBuilder();
            baseQuery.append("from Router rt WHERE rt.isConnected = 0");

            if(where != null && !where.isEmpty()){
                baseQuery.append("AND WHERE rt." + where);
            }

            if(orderby != null && !orderby.isEmpty()){
                baseQuery.append(" ORDER BY rt." + orderby);
            }

            if(limit != null){
                routerList = session.createQuery(baseQuery.toString()).setMaxResults(limit).list();
            }else{
                routerList = session.createQuery(baseQuery.toString()).list();
            }


        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }

        return routerList;
    }


}
