// package com.leong.pelaburan.Repository;
// import org.springframework.data.jpa.repository.Query;

// import com.leong.pelaburan.entity.Fixeddeposit;
// import com.leong.pelaburan.entity.Fixeddeposit.InvStatus;


// public interface FixedDepositRepository extends CustomizedRepository<Fixeddeposit, Long> {
//     @Query(value = "SELECT * FROM fixeddeposit i WHERE i.STATUS=?1", nativeQuery = true)
//     Iterable <Fixeddeposit> findByStatus(InvStatus status);

    
// }

package com.leong.pelaburan.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.leong.pelaburan.entity.FixedDeposit;

public interface FixedDepositRepo extends CustomizedRepo<FixedDeposit, Long> {
    @Query(value="SELECT fd FROM FixedDeposit fd WHERE fd.bankName='Maybank'",
        nativeQuery=true)
    List<FixedDeposit> searchFD (String query);


}