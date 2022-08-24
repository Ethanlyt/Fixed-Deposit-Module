package com.leong.pelaburan.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.leong.pelaburan.entity.FixedDeposit.Status;

import lombok.Getter;
import lombok.Setter;


@Entity
@Getter 
@Setter



public class Registration{

    @Id
    @GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(scale = 2)
    private Double depositAmount;

    private LocalDate registeredDate;

    @Enumerated(EnumType.STRING)
    private Status status;

}
