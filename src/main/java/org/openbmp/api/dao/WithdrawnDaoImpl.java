package org.openbmp.api.dao;

import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository("WithdrawnDaoImpl")
public class WithdrawnDaoImpl implements WithdrawmDao {


    @Autowired
    private SessionFactory sessionFactory;

    private Transaction tx = null;

    public WithdrawnDaoImpl(){

    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }



}
