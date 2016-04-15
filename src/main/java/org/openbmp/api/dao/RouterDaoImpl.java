package org.openbmp.api.dao;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.openbmp.api.model.Router;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    public List<Router> findAllRoutersBySearchCriteria(String searchCriteria, String criteriaValue, Integer limit, Boolean withGeo, String where, String orderby){

        Object criteriaVal = criteriaValue;

        Session session = null;
        List<Router> routerList = new ArrayList<Router>();

        long queryTime = 0;

        StringBuilder baseQuery = new StringBuilder();

        try{

            session = sessionFactory.openSession();

            baseQuery.append("from Router rt");

            // append next part into query based on search criteria
            if(searchCriteria.equals("none")){
                baseQuery.append("  WHERE 1 = :criteriaVal");
                criteriaVal = Integer.valueOf(criteriaValue);
            }
            else if(searchCriteria.equals("up")){
                baseQuery.append("  WHERE rt.isConnected = :criteriaVal");
                criteriaVal = Byte.valueOf(criteriaValue);
            } else if(searchCriteria.equals("down")){
                baseQuery.append("  WHERE rt.isConnected = :criteriaVal");
                criteriaVal = Byte.valueOf(criteriaValue);
            }

            // append remaining QueryParams into query

            if(where != null && !where.isEmpty()){
                baseQuery.append(" WHERE rt." + where);
            }

            if(orderby != null && !orderby.isEmpty()){
                baseQuery.append(" ORDER BY rt." + orderby);
            }


            if(withGeo == null || withGeo == false){

                if(limit != null){

                    System.out.println(" scenario 1 executed ");

                    Query query = session.createQuery(baseQuery.toString()).setParameter("criteriaVal",criteriaVal).setMaxResults(limit);

                    queryTime = System.currentTimeMillis();
                    routerList = query.list();
                    System.out.println("The scenario 1 Query time is : " + (System.currentTimeMillis() - queryTime));


                }else{

                    System.out.println("scenario 2 executed ");

                    Query query = session.createQuery(baseQuery.toString()).setParameter("criteriaVal",criteriaVal);

                    queryTime = System.currentTimeMillis();
                    routerList = query.list();
                    System.out.println("The scenario 2 Query time is : " + (System.currentTimeMillis() - queryTime));
                }
            } else{
                // todo change this query

                System.out.println("scenario 3 executed");

                Query query = session.createSQLQuery("select name, ip_address , router_AS , description, isConnected, isPassive, term_reason_code ,term_reason_text , init_data ,timestamp , geo_ip_start FROM routers LEFT JOIN v_geo_ip ON (v_geo_ip.ip_start_bin = routers.geo_ip_start)").setMaxResults(limit);

                queryTime = System.currentTimeMillis();
                routerList = query.list();
                System.out.println("The scenario 3 Query time is : " + (System.currentTimeMillis() - queryTime));
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally {
            if(session != null){
                session.close();
            }
        }

        System.out.println("Number of Rows : " + routerList.size() + " Number of columns : " + routerList.get(0).getClass().getDeclaredFields().length);

        return routerList;
    }


    // Find Status Count of Routers
    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<Object[]> getRoutersStatusCount(){

        Session session = null;

        List<Object[]> records = new ArrayList<Object[]>();

        long queryTime = 0;

        try{

            session = sessionFactory.openSession();

            Query query = session.createSQLQuery("SELECT if(isConnected, 'UP', 'DOWN') as StatusType,count(hash_id) as Count FROM routers GROUP BY StatusType");

            queryTime = System.currentTimeMillis();
            records = query.list();

            System.out.println("The Query time for router status count is : " + (System.currentTimeMillis() - queryTime));


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
