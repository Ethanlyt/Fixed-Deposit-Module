package com.leong.pelaburan.entity;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class FixedDeposit {
    // Declare enum name Status
    public static enum Status {
        NEW("NEW"),          //New: Just registered (default)
        APPROVED("APPROVED"),//Approved: Approved my admin
        REJECTED("REJECTED");//Rejected: Rejected my admin

        private String value;

        private Status(String value) {
            this.value = value;
        }

        private String getValue() {
            return value;
        }
    }

    @Id
    @GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
    private Long id;

    private String certificateNo;
    private String referenceNo;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer compoundPeriodMonth;
    @Column(scale = 2)
    private Double principalAmount;
    @Column(scale = 2)
    private Double interestRate;
    private String comment;
    private String bankName;
    
    public long getDaysFromStartDateToEndDate(){
        return this.startDate.until(this.endDate,ChronoUnit.DAYS);
    }

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany
    @JoinColumn(name = "schedulesToFd")
    private List<Schedule> schedule;

    @OneToMany
    @JoinColumn(name = "transTOfd")
    private List<Transaction> transaction;

    // Regitra
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private Registration registration;

    // Addition
    @OneToMany
    @JoinColumn(name = "depositToFd")
    private List<Addition> deposit;

    // Withdrawal
    @OneToMany
    @JoinColumn(name = "withdrawToFd")
    private List<Withdraw> withdraw;

    


}
