//To handle the api response
package com.leong.pelaburan.controller;


public class ApiResponse {
    private int status;
    private String message;
    private Long userId;

    public ApiResponse(int Status, String message, Long userId) {
        this.status = Status;
        this.message = message;
        this.userId = userId;
    }

    public int getStatus(){
        return status;
    }
    public String getMessage(){
        return message;
    }
    public Long getUserId() {
        return userId;
    }
}
