package com.leong.pelaburan.controller;

import com.leong.pelaburan.entity.LoginDto;

public interface UserService {
    public ApiResponse login(LoginDto loginDto);
    public boolean validateUsername(String username);
}
