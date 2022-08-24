package com.leong.pelaburan.Repository;

import javax.persistence.EntityManager;
import javax.websocket.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.leong.pelaburan.entity.User;

@Repository
public class UserRepoImplementation {
    @Autowired
    private EntityManager em;

    public User save(User user){
        Session session = em.unwrap(Session.class);
        ((EntityManager) session).persist(user);
        return user;
    }
}
