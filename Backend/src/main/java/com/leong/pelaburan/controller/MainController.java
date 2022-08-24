package com.leong.pelaburan.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.management.relation.Role;
import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.taglibs.standard.lang.jstl.test.beans.PublicInterface2;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.leong.pelaburan.Repository.AdditionRepo;
import com.leong.pelaburan.Repository.FixedDepositRepo;
import com.leong.pelaburan.Repository.RegistrationRepo;
import com.leong.pelaburan.Repository.ScheduleRepo;
import com.leong.pelaburan.Repository.TransactionRepo;
import com.leong.pelaburan.Repository.UserRepo;
import com.leong.pelaburan.Repository.WithdrawRepo;
import com.leong.pelaburan.entity.Addition;
import com.leong.pelaburan.entity.FixedDeposit;
import com.leong.pelaburan.entity.FixedDeposit.Status;
import com.leong.pelaburan.entity.LoginDto;
import com.leong.pelaburan.entity.Registration;
import com.leong.pelaburan.entity.Schedule;
import com.leong.pelaburan.entity.Transaction;
import com.leong.pelaburan.entity.User;
import com.leong.pelaburan.entity.User.RoleType;
import com.leong.pelaburan.entity.Withdraw;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*",allowCredentials = "true" )

@Controller
@RequestMapping(path = "/main")
public class MainController {
    //Autowired all the repository
    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private AdditionRepo additionRepo;
    @Autowired
    private WithdrawRepo withdrawRepo;
    @Autowired
    private RegistrationRepo registrationRepo;
    @Autowired
    private FixedDepositRepo fixedDepositRepo;
    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private FixedDepositService fixedDepositService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserService userService;
    @Autowired
    EntityManager em;


    @PostMapping(path = "/login")
    public @ResponseBody ApiResponse login(@RequestBody LoginDto loginDto, HttpServletRequest request) {
        ApiResponse response = userService.login(loginDto);
        
        ApiResponse sessionResponse = (ApiResponse) request.getSession().getAttribute("session");
        if (sessionResponse == null)
            request.getSession().setAttribute("session", response.getUserId());        

        return response;
    }


    @GetMapping("/home")
    public @ResponseBody Long isLoggedIn(HttpSession session){

        Long sessionResponse = (Long) session.getAttribute("session");
        if(sessionResponse == null){
            return 0L;
        }
        
        return sessionResponse;
    }


    @PostMapping(path = "/logout")
    public @ResponseBody ApiResponse logout(HttpSession session){
        session.invalidate();
        return new ApiResponse(200, "Logged out successfully", null);
    }

    @PostMapping(path="/saveAdminURL")
    public @ResponseBody String saveAdmin(
        @RequestParam String username,
        @RequestParam String password,
        @RequestParam String role
    ){
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        RoleType newRole;
        role = role.toUpperCase();
        if(role.equals("ADMIN")){
            newRole = RoleType.ADMIN;
        }else{
            return "Invalid role";
        }
        user.setRole(newRole);
        userRepo.save(user);
        return "Admin saved";
    }

    @PostMapping(path = "/saveUserURL")
    public @ResponseBody String saveFixedDeposit(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String role,

            @RequestParam String certNo,
            @RequestParam String refNo,
            @RequestParam String startDate,
            @RequestParam Integer periodInMonth,
            @RequestParam Double principalAmount,
            @RequestParam Double interestRate,
            @RequestParam String bankName,
            @RequestParam(required = false) String comment) {

        FixedDeposit fd = new FixedDeposit();
        Registration reg = new Registration();

        User user = new User();

        if (userService.validateUsername(username) == false) {
            System.out.println("Username had beed used");
            return "Username had beed used";
        } else {
            user.setUsername(username);
            user.setPassword(password);
            role = role.toUpperCase();
            RoleType newRole;
            if (role.equals("USER")) {
                newRole = RoleType.USER;
            } else {
                return "Invalid role";
            }
            user.setRole(newRole);
            
            // Setting basic property for fixed deposit

            fd.setCertificateNo(certNo);
            fd.setReferenceNo(refNo);
            fd.setStartDate(LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE));
            fd.setCompoundPeriodMonth(periodInMonth);
            fd.setPrincipalAmount(principalAmount);
            fd.setInterestRate(interestRate);
            fd.setComment(comment);
            fd.setBankName(bankName);
            fd.setStatus(Status.NEW);

            // Setting basic property for registeration

            reg.setRegisteredDate(LocalDate.now());
            reg.setStatus(Status.NEW);

            LocalDate scheduleStart = fd.getStartDate();
            Integer month = fd.getCompoundPeriodMonth();
            Double tempCompoundEarn = fd.getPrincipalAmount();
            Double tempEarn = fixedDepositService.calculateEarning(fd);
            List<Schedule> schList = new ArrayList<Schedule>();
            for (int i = 0; i < month; i++) {
                Schedule sch = new Schedule();
                sch.setDateStart(scheduleStart);
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

            reg.setDepositAmount(fd.getPrincipalAmount());

            fd.setRegistration(reg);
            fd.setEndDate(LocalDate.parse(fixedDepositService.calculateEndDate(month, fd.getStartDate().toString()),
                    DateTimeFormatter.ISO_DATE));
            fixedDepositRepo.save(fd);

            user.setFixedDeposit(fd);
            userRepo.save(user);
            
        }
        Long index = fixedDepositRepo.count();
        return index.toString();
    }

    @PostMapping(path = "/requestApplication")
    public @ResponseBody Long newFixedDeposit(
            @RequestParam Long userID,
            @RequestParam String certNo,
            @RequestParam String refNo,
            @RequestParam String startDate,
            @RequestParam Integer periodInMonth,
            @RequestParam Double principalAmount,
            @RequestParam Double interestRate,
            @RequestParam String bankName,
            @RequestParam(required = false) String comment) {

        FixedDeposit fd = new FixedDeposit();
        Registration reg = new Registration();
        User user = userRepo.findOne(userID);

            // Setting basic property for fixed deposit

            fd.setCertificateNo(certNo);
            fd.setReferenceNo(refNo);
            fd.setStartDate(LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE));
            fd.setCompoundPeriodMonth(periodInMonth);
            fd.setPrincipalAmount(principalAmount);
            fd.setInterestRate(interestRate);
            fd.setComment(comment);
            fd.setBankName(bankName);
            fd.setStatus(Status.NEW);

            // Setting basic property for registeration
            reg.setRegisteredDate(LocalDate.now());
            reg.setStatus(Status.NEW);

            LocalDate scheduleStart = fd.getStartDate();
            Integer month = fd.getCompoundPeriodMonth();
            Double tempCompoundEarn = fd.getPrincipalAmount();
            Double tempEarn = fixedDepositService.calculateEarning(fd);
            List<Schedule> schList = new ArrayList<Schedule>();
            for (int i = 0; i < month; i++) {
                Schedule sch = new Schedule();
                sch.setDateStart(scheduleStart);
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

            reg.setDepositAmount(fd.getPrincipalAmount());

            fd.setRegistration(reg);
            fd.setEndDate(LocalDate.parse(fixedDepositService.calculateEndDate(month, fd.getStartDate().toString()),
                    DateTimeFormatter.ISO_DATE));
            fixedDepositRepo.save(fd);

            user.setFixedDeposit(fd);
            userRepo.save(user);
        
        Long index = fixedDepositRepo.count();
        return index;
    }

    @GetMapping(path = "/getTransaction")
    public @ResponseBody List getTransaction(@RequestParam Long fdId){
        List<Transaction> transaction = transactionRepo.findByTransTOfd(fdId);
        return transaction;
    }

    @GetMapping(path = "/allAdmin")
    public @ResponseBody Iterable<FixedDeposit> getAllFixedDepositsAdmin() {

        return fixedDepositRepo.findAll();
    }

    @GetMapping(path = "/allUser")
    public @ResponseBody FixedDeposit getUserFixedDeposits(@RequestParam Long userId) {

            User user = userRepo.findOne(userId);
            return fixedDepositRepo.findOne(user.getFixedDeposit().getId());

    }

    @GetMapping(path = "/checkRole")
    public @ResponseBody RoleType userRole(@RequestParam Long userId){
        User user = userRepo.findOne(userId);
        return user.getRole();
    }

    @GetMapping(path = "/calculateEarn")
    public @ResponseBody String calculateEarning(@RequestParam(required = false) Integer periodInMonth, @RequestParam(required = false) Double principalAmount, @RequestParam(required = false) Double interestRate){
        return "RM: " + String.format("%5.2f", fixedDepositService.calculateEarning(periodInMonth, principalAmount, interestRate));
    }

    @GetMapping(path = "/calculateEndDate")
    public @ResponseBody String calculateEndDtae(@RequestParam(required = false) Integer periodInMonth,@RequestParam(required = false) String startDate) {
        return fixedDepositService.calculateEndDate(periodInMonth,startDate);
    }

    @PostMapping(path = "/withdrawMoney/{id}/{withdrawAmount}")
    public @ResponseBody String wiithdrawMoney(@PathVariable Long id, @PathVariable Double withdrawAmount) {
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        Withdraw withdraw = new Withdraw();
        Transaction transaction = new Transaction();
        // set to the current date in (YYYY-MM-DD) format
        withdraw.setDateWithdraw(LocalDate.now());
        withdraw.setWithdrawAmount(withdrawAmount);

        fd.setPrincipalAmount(fd.getPrincipalAmount() - withdrawAmount);
        withdraw.setWithdrawToFd(fd.getId());

        fixedDepositRepo.save(fd);
        withdrawRepo.save(withdraw);
        transaction.setAmount(withdraw.getWithdrawAmount());
        transaction.setDate(withdraw.getDateWithdraw());
        transaction.setTransTOfd(fd.getId());
        transaction.setType("Withrawal");
        transactionRepo.save(transaction);

        return "Saved";
    }

    @PostMapping(path = "/depositMoney/{id}/{depositAmount}")
    public @ResponseBody String depositMoney(@PathVariable long id,@PathVariable Double depositAmount) {
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        Addition deposit = new Addition();
        Transaction transaction = new Transaction();

        //set to the current date in (YYYY-MM-DD) format
        deposit.setDateDeposit(LocalDate.now());
        deposit.setDepositAamount(depositAmount);
        // deposit.setDepositingId(fd.getId());

        fd.setPrincipalAmount(fd.getPrincipalAmount()+depositAmount);
        deposit.setDepositToFd(fd.getId());
        fixedDepositRepo.save(fd);

        additionRepo.save(deposit);
        transaction.setAmount(deposit.getDepositAamount());
        transaction.setDate(deposit.getDateDeposit());
        transaction.setTransTOfd(fd.getId());
        transaction.setType("Deposit");
        transactionRepo.save(transaction);
        
        fixedDepositService.rescheduleGenerated(id);

        return "Saved";

    }

    @PostMapping(path = "/scheduleGenerate")
    public @ResponseBody String scheduleGenerated(@RequestParam Long userId){
        FixedDeposit fd = userRepo.findOne(userId).getFixedDeposit();

        if (!fd.getSchedule().isEmpty()) {
            scheduleRepo.deleteByschedulesToFd(fd.getId());
            System.out.println("Deleted");
        }
        LocalDate scheduleStart = fd.getStartDate();

        Integer month = fd.getCompoundPeriodMonth();
        
        Double tempCompoundEarn = fd.getPrincipalAmount();
        Double tempEarn = fixedDepositService.calculateEarning(fd);
        List <Schedule> schList = new ArrayList<Schedule>();

        for ( int i = 0 ; i<month ; i++){
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

    @GetMapping(path = "/getDetail")
    public @ResponseBody FixedDeposit jadualRingkasan(@RequestParam Long id){
        // User user = userRepo.findOne(id);
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        return fd;
    }

    @DeleteMapping ("/delete/{id}")
    public @ResponseBody String deleteFD(@PathVariable Long id){
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        User user = userRepo.findByFixedDeposit(fd);
        
        scheduleRepo.deleteByschedulesToFd(id);
        user.setFixedDeposit(null);
        fixedDepositRepo.delete(fd);
        return "Deleted";
    }

    @PutMapping("/approve/{id}")
    public @ResponseBody String approveFD(@PathVariable Long id){
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        fd.setStatus(Status.APPROVED);
        fd.getRegistration().setStatus(Status.APPROVED);
        fixedDepositRepo.save(fd);
        return "Approved";
    }

    @PutMapping("/reject/{id}")
    public @ResponseBody String rejectFD(@PathVariable Long id) {
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        fd.setStatus(Status.REJECTED);
        fd.getRegistration().setStatus(Status.REJECTED);
        fixedDepositRepo.save(fd);
        return "Rejected";
    }
    
    @PutMapping("/update/{id}")
    public @ResponseBody String updateFD
    (
        @PathVariable long id,
        @RequestParam String certificateNo,
        @RequestParam String referenceNo,
        @RequestParam String startDate,
        @RequestParam Integer compoundPeriodMonth,
        @RequestParam Double principalAmount,
        @RequestParam Double interestRate,
        @RequestParam String comment,
        @RequestParam String bankName
    ){
        FixedDeposit fd = fixedDepositRepo.findOne(id);
        fd.setCertificateNo(certificateNo);
        fd.setReferenceNo(referenceNo);
        fd.setStartDate(LocalDate.parse(startDate));
        fd.setCompoundPeriodMonth(compoundPeriodMonth);
        fd.setPrincipalAmount(principalAmount);
        fd.setInterestRate(interestRate);
        fd.setComment(comment);
        fd.setBankName(bankName);

        LocalDate scheduleStart = fd.getStartDate();
        Integer month = fd.getCompoundPeriodMonth();
        Double tempCompoundEarn = fd.getPrincipalAmount();
        Double tempEarn = fixedDepositService.calculateEarning(fd);

        scheduleRepo.deleteByschedulesToFd(id);
        System.out.println("Deleted");
        
        List<Schedule> schList = new ArrayList<Schedule>();
        for (int i = 0; i < month; i++) {
            Schedule sch = new Schedule();
            sch.setDateStart(scheduleStart);
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
        return "Updated";
    }
    
    @GetMapping(path = "/getSchedulePreview")
    public @ResponseBody List<Schedule> schedulePreview(@RequestParam Long id) {
        List<Schedule> schedule = scheduleRepo.findBySchedulesToFd(id);
        return schedule;
    }

    @GetMapping(path = "/getSchedulePreviewByuser")
    public @ResponseBody List<Schedule> schedulePreviewUser(@RequestParam Long userId) {
        User user = userRepo.findOne(userId);
        List<Schedule> schedule = scheduleRepo.findBySchedulesToFd(user.getFixedDeposit().getId());
        return schedule;
    }
    
    @GetMapping(value="/getFdId")
    public @ResponseBody Long getFdId(@RequestParam Long userId) {
        FixedDeposit fd = userRepo.findOne(userId).getFixedDeposit();
        if (fd == null){
            return 0l;
        }
        Long fdId = fd.getId(); 
        return fdId;
    }
    
}
