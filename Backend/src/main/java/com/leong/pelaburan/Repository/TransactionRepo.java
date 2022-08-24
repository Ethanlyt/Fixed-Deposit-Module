package com.leong.pelaburan.Repository;


import java.util.List;

import javax.transaction.Transactional;

import com.leong.pelaburan.entity.Transaction;

@Transactional
public interface TransactionRepo extends CustomizedRepo<Transaction,Long> {
    List<Transaction> findByTransTOfd(Long transTOfd);
}
