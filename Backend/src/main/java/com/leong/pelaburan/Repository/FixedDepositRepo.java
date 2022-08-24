package com.leong.pelaburan.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.leong.pelaburan.entity.FixedDeposit;

public interface FixedDepositRepo extends CustomizedRepo<FixedDeposit, Long> {
    @Query(value="SELECT fd FROM FixedDeposit fd WHERE fd.bankName='Maybank'",
        nativeQuery=true)
    List<FixedDeposit> searchFD (String query);


}