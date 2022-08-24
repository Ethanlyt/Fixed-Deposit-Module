package com.leong.pelaburan.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Addition {
    @Id
    @GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDeposit;
    @Column(scale = 2)
    private Double depositAamount;

    private Long depositToFd;
}
