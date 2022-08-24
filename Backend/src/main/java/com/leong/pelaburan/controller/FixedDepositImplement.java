package com.leong.pelaburan.controller;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leong.pelaburan.Repository.FixedDepositRepo;
import com.leong.pelaburan.Repository.ScheduleRepo;
import com.leong.pelaburan.Repository.UserRepo;
import com.leong.pelaburan.entity.FixedDeposit;
import com.leong.pelaburan.entity.Schedule;
@Service
public class FixedDepositImplement implements FixedDepositService{

    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private FixedDepositRepo fixedDepositRepo;
    @Autowired
    private UserRepo userRepo;

    @Override
    public Double calculateEarning(FixedDeposit fd) {
        Double earning = ((fd.getPrincipalAmount() *(fd.getInterestRate() / 100)) / 12) * fd.getCompoundPeriodMonth();
        return earning;
    }
    
    public Double calculateEarning(Integer periodInMonth, Double principalAmount, Double interestRate) {
        Double earning = ((principalAmount * (interestRate / 100)) / 12) * periodInMonth;
        return earning;
    }

    @Override
    public String calculateEndDate(Integer periodInMonth, String startDate) {
        LocalDate start = LocalDate.parse(startDate);
        Integer days = periodInMonth * 30;
        LocalDate end = start.plusDays(days);
        return end.toString();
        
    }

    @Override
    public  String rescheduleGenerated(Long id) {
        FixedDeposit fd = fixedDepositRepo.findOne(id);

        if (!fd.getSchedule().isEmpty()) {
            // Select * from Schedule where Schedule.schedules_to_fd = id
            // em.createQuery("DELETE FROM Schedule sch WHERE
            // sch.schedulesToFd=?1").setParameter(1, id).executeUpdate();
            scheduleRepo.deleteByschedulesToFd(fd.getId());
            // scheduleRepo.delete(fd.getSchedule().get(6));
            System.out.println("Deleted");
        }
        // Find the defference of year
        // FD interest need 30days to be calculated
        LocalDate scheduleStart = fd.getStartDate();

        Integer month = fd.getCompoundPeriodMonth();

        Double tempCompoundEarn = fd.getPrincipalAmount();
        Double tempEarn = calculateEarning(fd);
        List<Schedule> schList = new ArrayList<Schedule>();

        for (int i = 0; i < month; i++) {
            Schedule sch = new Schedule();
            sch.setDateStart(scheduleStart);
            if (i == 0)
                scheduleStart = scheduleStart.plusDays(29);
            else
                scheduleStart = scheduleStart.plusDays(30);
            sch.setDateEnd(scheduleStart);
            sch.setAmountStart(tempCompoundEarn);
            tempCompoundEarn = tempCompoundEarn + tempEarn;
            sch.setAmountEnd(tempCompoundEarn);
            sch.setAmountEarned(tempEarn);
            sch.setSchedulesToFd(fd.getId());
            scheduleRepo.save(sch);

            schList.add(sch);
        }

        fd.setSchedule(schList);

        fixedDepositRepo.save(fd);
        return "Saved";

    }
    
}
