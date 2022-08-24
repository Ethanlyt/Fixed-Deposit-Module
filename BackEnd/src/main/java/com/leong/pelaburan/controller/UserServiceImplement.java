package com.leong.pelaburan.controller;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.leong.pelaburan.Repository.MyApplicationSecurityConfig;
import com.leong.pelaburan.Repository.UserRepo;
import com.leong.pelaburan.entity.LoginDto;
import com.leong.pelaburan.entity.User;

@Transactional
@Service
public class UserServiceImplement implements UserService {
    @Autowired
    private UserRepo userRepo;
    // @Autowired
    // private MyApplicationSecurityConfig security;

    @Override
    public ApiResponse login(LoginDto loginDto){
        User user = userRepo.findByUsername(loginDto.getUsername());
        
        if(user == null){
            return new ApiResponse(0, "User does not exist", null);
        }
        
        // if(!security.passwordEncoder().matches(loginDto.getPassword(), user.getPassword())){
        //     return new ApiResponse(401, "Password mismatch.", null);
        // }
        if(!loginDto.getPassword().equals(user.getPassword()))
            return new ApiResponse(401, "Password mismatch.", null);
        return new ApiResponse(200, "Login success", user.getId());
    }

    @Override
    public boolean validateUsername(String username){
        if (userRepo.findByUsername(username) != null) {
            return false;
        }
        return true;
    }
}

