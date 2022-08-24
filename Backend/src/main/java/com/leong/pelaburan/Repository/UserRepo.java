package com.leong.pelaburan.Repository;

import java.util.List;

import com.leong.pelaburan.entity.FixedDeposit;
import com.leong.pelaburan.entity.User;

public interface UserRepo extends CustomizedRepo<User, Long>{
    User findByUsername(String username);
    User findByFixedDeposit(FixedDeposit fixedDeposit);
    

}
