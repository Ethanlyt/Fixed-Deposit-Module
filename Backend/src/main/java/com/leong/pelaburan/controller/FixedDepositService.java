package com.leong.pelaburan.controller;

import org.springframework.stereotype.Service;

import com.leong.pelaburan.entity.FixedDeposit;

@Service

public interface FixedDepositService {

    public Double calculateEarning(FixedDeposit fd);
    
    public Double calculateEarning(Integer periodInMonth, Double principalAmount, Double interestRate);

    public String calculateEndDate(Integer periodInMonth, String startDate);

    public String rescheduleGenerated(Long userId);


}
